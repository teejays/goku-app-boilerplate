package gateway

import (
	"fmt"
	"io/ioutil"
	"net/http"

	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	resolver "<goku_app_backend_go_module_name>/backend/goku.generated/graphql"
)

func StartServer(addr string, port int, schemaFilePath string) error {
	if port < 1 {
		port = 8080
	}

	// Sample Schema
	/*
		s := `
				type Query {
					hello: String!
					helloWithArgs(name: String!): String!
				}
				type HelloArgs {
					Name: String!
				}
		`
	*/

	opts := []graphql.SchemaOpt{graphql.UseFieldResolvers()}
	schema, err := ParseSchemaFile(schemaFilePath, &resolver.Resolver{}, opts...)
	if err != nil {
		return err
	}
	http.Handle("/graphql", &relay.Handler{Schema: schema})
	return http.ListenAndServe(fmt.Sprintf("%s:%d", addr, port), nil)
}

func ParseSchemaFile(schemaFilePath string, resolver interface{}, opts ...graphql.SchemaOpt) (*graphql.Schema, error) {
	schemaData, err := ioutil.ReadFile(schemaFilePath)
	if err != nil {
		return nil, err
	}
	schemaString := string(schemaData)
	schema, err := graphql.ParseSchema(schemaString, resolver, opts...)
	if err != nil {
		return nil, err
	}
	return schema, nil

}
