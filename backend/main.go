package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/teamwork/reload"
	"github.com/teejays/clog"
	gopi "github.com/teejays/gopi"

	"github.com/teejays/goku-example-one/backend/gateway"
	db_connection "github.com/teejays/goku-example-one/backend/goku.generated/db_connection"
	http_handlers "github.com/teejays/goku-example-one/backend/goku.generated/http_handlers"
	"github.com/teejays/goku-example-one/backend/services/users/auth"
)

func main() {
	if err := mainErr(); err != nil {
		clog.Errorf("Error encountered: %s", err)
	}
}

func mainErr() error {
	var err error
	var ctx = context.Background()

	clog.LogToSyslog = false // No need to log to Syslog, since we may run this on Docker

	go func() {
		err := reload.Do(clog.Noticef)
		if err != nil {
			panic(err)
		}
	}()

	err = db_connection.InitDatabaseConnections(ctx)
	if err != nil {
		return fmt.Errorf("Initializing Database connections: %w", err)
	}

	// Initialize the Server
	clog.LogToSyslog = false

	// Get the Routes
	var routes = http_handlers.GetRoutes()

	// Middlewares
	preMiddlewareFuncs := []gopi.MiddlewareFunc{gopi.MiddlewareFunc(gopi.LoggerMiddleware)}
	postMiddlewareFuncs := []gopi.MiddlewareFunc{gopi.SetJSONHeaderMiddleware}
	authMiddlewareFunc, err := auth.GetAuthenticateHTTPMiddleware()
	if err != nil {
		return fmt.Errorf("constructing an AuthenticatorFunc: %w", err)
	}

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		var addr = "0.0.0.0"
		var port = 8080
		clog.Warnf("Starting HTTP server at %s:%d", addr, port)
		err := gopi.StartServer(addr, port, routes, authMiddlewareFunc, preMiddlewareFuncs, postMiddlewareFuncs)
		if err != nil {
			log.Fatalf("HTTP Server Error: %s", err)
		}
	}()

	gokuAppPath := os.Getenv("GOKU_APP_PATH")
	if gokuAppPath == "" {
		return fmt.Errorf("Env variabel GOKU_APP_PATH not set")
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		var addr = "0.0.0.0"
		var port = 8081
		clog.Warnf("Starting Gateway server at %s:%d", addr, port)
		err := gateway.StartServer(addr, port, filepath.Join(gokuAppPath, "backend/goku.generated/graphql/schema.generated.graphql"))
		if err != nil {
			log.Fatalf("HTTP Server Error: %s", err)
		}
	}()

	wg.Wait()

	return nil
}
