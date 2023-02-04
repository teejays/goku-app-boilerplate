package users_service_methods

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/teejays/goku-util/client/db"
	"github.com/teejays/goku-util/errutil"
	"github.com/teejays/goku-util/filter"
	"github.com/teejays/goku-util/panics"

	"<goku_app_backend_go_module_name>/backend/services/users/auth"
	types_users "<goku_app_backend_go_module_name>/backend/services/users/goku.generated/types"
	dal_user "<goku_app_backend_go_module_name>/backend/services/users/user/goku.generated/dal"
	types_user "<goku_app_backend_go_module_name>/backend/services/users/user/goku.generated/types"
)

func AuthenticateUser(ctx context.Context, req types_users.AuthenticateRequest) (types_users.AuthenticateResponse, error) {
	var resp types_users.AuthenticateResponse
	var err error

	// Need access to a client (that we can use to make calls)
	conn, err := db.NewConnection("users")
	if err != nil {
		return resp, fmt.Errorf("Fetching DB Connection for '%s': %w", "users", err)
	}
	// Get the DAL wrapper
	d := dal_user.UserEntityDAL{}
	listUsersResp, err := d.ListUser(ctx, conn, types_user.ListUserRequest{
		Filter: types_user.UserFilter{
			Email: filter.NewStringCondition(filter.EQUAL, req.Email),
		},
	})
	if len(listUsersResp.Items) < 1 {
		err := fmt.Errorf("User: %w", errutil.ErrNotFound)
		return resp, errutil.WrapGerror(err, http.StatusUnauthorized, "Invalid email and/or password")
	}
	panics.If(len(listUsersResp.Items) > 1, "Multiple (%d) users found with the same email: %s", len(listUsersResp.Items), req.Email)

	user := listUsersResp.Items[0]
	hashedPasswordBase64 := user.PasswordHash
	hashedPassword, err := base64.StdEncoding.DecodeString(hashedPasswordBase64)
	if err != nil {
		return resp, fmt.Errorf("Could not base64 decode hashed password: %w", err)
	}

	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(req.Password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return resp, errutil.NewGerror(http.StatusUnauthorized, "Invalid email and/or password", "submitted & hashed password did not match")
	}
	if err != nil {
		return resp, fmt.Errorf("comparing hashed password: %w", err)
	}

	// Create and generate a token
	token, err := auth.CreateTokenForUser(ctx, user)
	if err != nil {
		return resp, err
	}

	resp.Token = token

	return resp, err
}

func RegisterUser(ctx context.Context, req types_users.RegisterUserRequest) (types_users.AuthenticateResponse, error) {
	var resp types_users.AuthenticateResponse
	var err error

	// Need access to a client (that we can use to make calls)
	conn, err := db.NewConnection("users")
	if err != nil {
		return resp, fmt.Errorf("Fetching DB Connection for '%s': %w", "users", err)
	}
	// Get the DAL wrapper
	d := dal_user.UserEntityDAL{}

	// Make sure we have no user with the same email
	existingUsers, err := d.ListUser(ctx, conn, types_user.ListUserRequest{
		Filter: types_user.UserFilter{
			Email: filter.NewStringCondition(filter.EQUAL, req.Email),
		},
	})
	if len(existingUsers.Items) > 0 {
		return resp, fmt.Errorf("Email is already in use")
	}

	// Get the salt
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return resp, fmt.Errorf("Could not handle the password: %w", err)
	}

	hashedBase64 := base64.RawStdEncoding.EncodeToString(hashed)

	var u = types_user.User{
		Email:        req.Email,
		PasswordHash: hashedBase64,
		Name:         req.Name,
		PhoneNumber:  &req.PhoneNumber,
	}

	u, err = d.AddUser(ctx, conn, u)
	if err != nil {
		return resp, fmt.Errorf("Cannot create user: %w", err)
	}

	resp, err = AuthenticateUser(ctx, types_users.AuthenticateRequest{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		return resp, err
	}

	return resp, err
}
