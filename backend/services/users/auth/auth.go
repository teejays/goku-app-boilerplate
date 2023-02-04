package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/teejays/clog"
	"github.com/teejays/go-jwt"
	"github.com/teejays/goku-util/errutil"
	"github.com/teejays/goku-util/scalars"
	api "github.com/teejays/gopi"

	user_types "<goku_app_backend_go_module_name>/backend/services/users/user/goku.generated/types"

	"github.com/teejays/goku-util/ctxutil"
)

func getJWTSecret() ([]byte, error) {
	return []byte("I am a secret key"), nil
}

// CreateTokenForUser generate a new JWT token for a given user
func CreateTokenForUser(ctx context.Context, user user_types.User) (string, error) {
	// Get the secret, create the client, and return an authenticator func
	secret, err := getJWTSecret()
	if err != nil {
		return "", err
	}

	jwtClient, err := jwt.NewClient(secret)
	if err != nil {
		return "", err
	}

	var claim = jwt.BaseClaim{
		ExternallBaseClaim: jwt.ExternallBaseClaim{
			Issuer:  "goku-pharmacy-app",
			Subject: user.ID.String(),
		},
	}

	token, err := jwtClient.CreateToken(&claim, time.Hour*5)
	if err != nil {
		return "", fmt.Errorf("creating token from claim: %w", err)
	}

	return token, nil

}

// Authenticator funcs authenticates using a given token, and sets the context values
type AuthenticatorFunc func(ctx context.Context, token string) (context.Context, error)

func GetAuthenticatorFunc() (AuthenticatorFunc, error) {

	// Get the secret, create the client, and return an authenticator func
	secret, err := getJWTSecret()
	if err != nil {
		return nil, err
	}

	jwtClient, err := jwt.NewClient(secret)
	if err != nil {
		return nil, err
	}

	authenticatorFunc := func(ctx context.Context, token string) (context.Context, error) {
		return AuthenticateTokenWithClient(ctx, jwtClient, token)
	}
	return authenticatorFunc, nil
}

// AuthenticateTokenWithClient handles the system authentication, given a token and an already set jwt.Client. It provides an authenticated context
// upon successful auth.
func AuthenticateTokenWithClient(ctx context.Context, client *jwt.Client, token string) (context.Context, error) {
	var err error

	// Get the claim from the token (this verifies the token as well)
	var claim jwt.BaseClaim
	err = client.VerifyAndDecode(token, &claim)
	if err != nil {
		// Assume that an error here means StatusUnauthorized
		return ctx, fmt.Errorf("%s: %w", err, errutil.ErrBadToken)
	}

	if claim.Subject == "" {
		return ctx, fmt.Errorf("auth middleware: got an empty `sub` from a verified jwt token")
	}

	userID, err := scalars.ParseID(claim.Subject)
	if err != nil {
		return ctx, fmt.Errorf("auth middleware: cannot parse `sub` from JWT claim as uuid.UUID: %w", err)
	}

	// Authentication successful
	// Add the authentication payload to the context
	ctx = ctxutil.SetUserID(ctx, userID)
	ctx = ctxutil.SetJWTToken(ctx, token)

	return ctx, nil
}

/**
 * HTTP
 */

func GetAuthenticateHTTPMiddleware() (api.MiddlewareFunc, error) {
	// if I am reading this after a while, I am sure I am not going to understand all this currying, but I do right not.
	// We basically need to separate the JWT secret, and setting of JWT client out of the logic for actual authentication.

	// Get a function that can process authentication
	authenticatorFunc, err := GetAuthenticatorFunc()
	if err != nil {
		return nil, fmt.Errorf("Getting AuthenticatorFunc: %w", err)
	}

	middlewareFunc := func(next http.Handler) http.Handler {

		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			clog.Debug("AuthenticateRequest() called...")

			// Get the token
			token, err := extractBearerTokenFromHTTPRequest(r)
			if err != nil {
				api.WriteError(w, http.StatusUnauthorized, err)
				return
			}

			ctx, err := authenticatorFunc(r.Context(), token)
			if err != nil {
				api.WriteError(w, http.StatusUnauthorized, err)
				return
			}

			// Add the updated context to http.Request
			r = r.WithContext(ctx)

			clog.Debug("Authentication process finished...")
			next.ServeHTTP(w, r)
		})
	}

	return middlewareFunc, nil

}

// TODO: Maybe move this to gopi helpers
func extractBearerTokenFromHTTPRequest(r *http.Request) (string, error) {

	// Get the authentication header
	val := r.Header.Get("Authorization")
	clog.Debugf("Authenticate Header: %v", val)
	// In JWT, we're looking for the Bearer type token
	// This means that the val should be like: Bearer <token>
	if strings.TrimSpace(val) == "" {
		return "", fmt.Errorf("Authorization header not found")
	}
	// - split by the space
	valParts := strings.Split(val, " ")
	if len(valParts) != 2 {
		return "", fmt.Errorf("Authorization header has an unexpected format: it's not 'Authorization:Bearer <TOKEN>'")
	}
	if valParts[0] != "Bearer" {
		return "", fmt.Errorf("Authorization header has an unexpected format: it's not `Authorization:Bearer <TOKEN>'")
	}

	return valParts[1], nil
}
