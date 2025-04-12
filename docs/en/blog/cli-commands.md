---
sidebar: auto
---

# Detailed Guide to go-doudou CLI Commands

[[toc]]

![programming.jpg](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1740&fm=jpg&fit=crop)
Photo by [Christopher Gower](https://unsplash.com/@cgower?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/m_HRfLhgABo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

go-doudou is a powerful Go language microservice development framework that provides rich command-line tools to help developers quickly build, deploy, and manage microservices. This article will detail the usage of various commands and subcommands of the go-doudou CLI tool, and explain them in conjunction with actual examples.

## Installation and Upgrade

### Installing go-doudou

For Go versions below 1.17:

```shell
go get -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

For Go versions >= 1.17, it's recommended to use the following command to install the `go-doudou` command-line tool globally:

```shell
go install -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

It's recommended to use the following command to download go-doudou as a project dependency:

```shell
go get -v -d github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

::: tip
If you encounter a `410 Gone error`, please execute the following command first, and then execute the above installation command:

```shell
export GOSUMDB=off
``` 
:::

### Upgrading go-doudou

Execute the `go-doudou version` command to upgrade the globally installed go-doudou command-line tool:

```shell
go-doudou version
```

If a new version is detected, you will be prompted whether to upgrade. After selecting "Yes", the latest version will be automatically installed.

## Command Overview

The basic usage of the go-doudou command-line tool is as follows:

```shell
go-doudou [flags]
go-doudou [command]
```

Main commands include:

- `svc`: Generate or update services
  - `init`: Initialize new project
  - `http`: Generate HTTP routes and handlers
    - `client`: Generate HTTP client code
    - `test`: Generate integration test code
  - `grpc`: Generate gRPC service code
  - `crud`: Generate generic CRUD code from database
  - `run`: Run the service
  - `push`: Build Docker image and push
  - `deploy`: Deploy the service to Kubernetes
  - `shutdown`: Shut down the deployed service
- `completion`: Generate autocompletion script for specified shell
- `enum`: Generate functions for constants to implement IEnum interface
- `name`: Bulk add or update JSON tags of struct fields
- `version`: Show the version number of go-doudou
- `work`: Build modular application

::: warning Note
Although the `ddl` command may still be visible in the help information, this command has been deprecated and is not recommended for use in new projects. Please use the `svc crud` command instead.
:::

You can view the help information by running `go-doudou -h`:

```shell
go-doudou -h
```

Example output:
```
go-doudou works like a scaffolding tool but more than that. 
it lets api providers design their apis and help them code less. 
it generates openapi 3.0 spec json document for frontend developers or other api consumers to understand what apis there, 
consumers can import it into postman to debug and test, or upload it into some code generators to download client sdk.
it provides some useful components and middleware for constructing microservice cluster like service register and discovering, 
load balancing and so on. it just begins, more features will come out soon.

Usage:
  go-doudou [flags]
  go-doudou [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  enum        Generate functions for constants to implement IEnum interface
  help        Help about any command
  name        bulk add or update json tag of struct fields
  svc         generate or update service
  version     Print the version number of go-doudou
  work        Build modular application

Flags:
  -h, --help      help for go-doudou
  -v, --version   version for go-doudou
```

## Detailed Explanation of the completion Command

The `completion` command is used to generate an autocompletion script for the specified shell to improve the efficiency of using the go-doudou command line.

### Basic Usage

```shell
go-doudou completion [command]
```

### Subcommands

- `bash`: Generate an autocompletion script for bash
- `fish`: Generate an autocompletion script for fish
- `powershell`: Generate an autocompletion script for powershell
- `zsh`: Generate an autocompletion script for zsh

### Examples

Generate bash autocompletion script:
```shell
go-doudou completion bash > ~/.bash_completion
```

Generate zsh autocompletion script:
```shell
go-doudou completion zsh > ~/.zsh_completion
```

## Detailed Explanation of the svc Command

The `svc` command is the most commonly used command in the go-doudou command-line tool, used to generate or update service-related code. It contains multiple subcommands:

### svc init

The `svc init` command is used to initialize a new go-doudou microservice project.

#### Basic Usage

```shell
go-doudou svc init [dir] [flags]
```

where `[dir]` is the name of the project directory to initialize.

#### Common Parameters

- `-m, --mod`: Module name
- `--module`: Initialize as a component of a modular application (boolean value). When set to `true`, go-doudou will automatically call `go work use` to add the component to the workspace.
- `-f, --file`: Path or download link to an OpenAPI 3.0 or Swagger 2.0 specification JSON file
- `--case`: Naming convention for protobuf message fields and JSON tags, supports "lowerCamel" and "snake" (default "lowerCamel")
- `-t, --type`: Specify project type, value can be "grpc" or "rest" (default "grpc")
- `--grpc_gen_cmd`: Command for generating gRPC service and message code (default uses protoc command)

#### Examples

Basic initialization:
```shell
go-doudou svc init myservice -m github.com/myorg/myservice
```

Initialize with MySQL database and generate gRPC code:
```shell
go-doudou svc init myservice --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_grpc
```

Initialize as a component of a modular application:
```shell
go-doudou svc init component-c -m my-workspace/component-c --module
```

When using the `--module` flag, go-doudou will automatically perform the following operations:
1. Create the necessary project structure
2. Automatically call `go work use` to add the newly created component to the workspace
3. Generate plugins and entry code for the modular application
4. Update the main application's import statements to automatically include the new component's plugins

### svc http

The `svc http` command is used to generate HTTP routes and handlers.

#### Basic Usage

```shell
go-doudou svc http [flags]
```

#### Common Parameters

- `--handler`: Whether to generate default handler implementations (boolean value)
- `-c, --client`: Whether to generate default Go HTTP client code (boolean value)
- `-o, --omitempty`: Whether to add `omitempty` to JSON tags in generated anonymous structs (boolean value)
- `--case`: JSON tag naming convention applied to fields in anonymous structs in generated handlers, options are "lowerCamel" or "snake" (default "lowerCamel")
- `--doc`: Whether to generate OpenAPI 3.0 JSON documentation (boolean value)
- `-e, --env`: Base URL environment variable name
- `-r, --routePattern`: Route pattern generation strategy, 0 means splitting each method of the service interface by slash / (after converting to snake_case), 1 means not splitting, just converting to lowercase
- `--allowGetWithReqBody`: Whether to allow GET requests with request bodies (boolean value)

#### Examples

Generate HTTP routes and client code:
```shell
go-doudou svc http -c
```

Generate HTTP routes, handlers, and OpenAPI documentation:
```shell
go-doudou svc http --handler --doc
```

### svc http client

`svc http client` is a subcommand of `svc http`, used to generate HTTP client code from an OpenAPI 3.0 specification JSON file.

#### Basic Usage

```shell
go-doudou svc http client [flags]
```

#### Common Parameters

- `-f, --file`: Path or download link to an OpenAPI 3.0 or Swagger 2.0 specification JSON file
- `-e, --env`: Base URL environment variable name
- `-p, --pkg`: Client package name (default "client")
- `-o, --omit`: Whether to add `omitempty` to JSON tags (boolean value)

#### Examples

Generate client code from an OpenAPI document:
```shell
go-doudou svc http client -f ./api-docs.json -e BASE_URL -p client
```

### svc http test

`svc http test` is a subcommand of `svc http`, used to generate integration test code from a Postman Collection file.

#### Basic Usage

```shell
go-doudou svc http test [flags]
```

#### Common Parameters

- `--collection`: Path to a Postman Collection v2.1 compatible file
- `--dotenv`: Path to a dotenv format configuration file for integration tests only

#### Examples

Generate test code from a Postman Collection:
```shell
go-doudou svc http test --collection ./postman_collection.json --dotenv ./.env.test
```

### svc grpc

The `svc grpc` command is used to generate gRPC service code.

#### Basic Usage

```shell
go-doudou svc grpc [flags]
```

#### Common Parameters

- `-o, --omitempty`: Whether to add `omitempty` to JSON tags in generated anonymous structs (boolean value)
- `--case`: protobuf message field naming strategy, supports "lowerCamel" and "snake" (default "lowerCamel")
- `--grpc_gen_cmd`: Command for generating gRPC service and message code (default uses protoc command)
- `--http2grpc`: Whether to generate RESTful API for gRPC service (boolean value)
- `--allow_get_body`: Whether to allow GET requests with request bodies (boolean value)
- `--annotated_only`: Whether to only generate gRPC API for methods with @grpc annotation (boolean value)

#### Examples

Generate basic gRPC service code:
```shell
go-doudou svc grpc
```

Generate gRPC service code and provide RESTful API proxy:
```shell
go-doudou svc grpc --http2grpc
```

Generate gRPC service code that only includes methods with @grpc annotation:
```shell
go-doudou svc grpc --annotated_only
```

### svc crud

The `svc crud` command is used to generate generic CRUD code from a database. This command is the recommended choice to replace the deprecated `ddl` command.

#### Basic Usage

```shell
go-doudou svc crud [flags]
```

#### Common Parameters

- `--db_orm`: Specify ORM, currently only supports gorm (default "gorm")
- `--db_driver`: Database driver type, options are "mysql", "postgres", "sqlite", "sqlserver", "tidb"
- `--db_dsn`: Database connection URL
- `--db_soft`: Database soft delete column name (default "deleted_at")
- `--db_service`: Generate gRPC or REST service, accepts values: grpc or rest
- `--db_gen_gen`: Whether to generate gen.go file (boolean value)
- `--db_table_prefix`: Table prefix or PostgreSQL schema name
- `--db_table_glob`: For filtering tables with glob matching
- `--db_table_exclude_glob`: For excluding tables with glob matching
- `--case`: protobuf message field and JSON tag naming convention, supports "lowerCamel" and "snake" (default "lowerCamel")
- `--db_type_mapping`: Specify custom column type to Go type mappings
- `--db_omitempty`: Whether to add `omitempty` to JSON tags in generated model fields (boolean value)
- `--grpc_gen_cmd`: Command for generating gRPC service and message code (default uses protoc command)

#### Examples

Generate CRUD code from a MySQL database:
```shell
go-doudou svc crud --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_service rest
```

Generate CRUD code from a PostgreSQL database, and specify schema:
```shell
go-doudou svc crud --db_driver postgres --db_dsn "host=localhost user=postgres password=postgres dbname=mydb port=5432 sslmode=disable" --db_table_prefix public --db_service grpc
```

Generate CRUD code for specific tables only:
```shell
go-doudou svc crud --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb" --db_table_glob "user_*" --db_service rest
```

### svc run

The `svc run` command is used to run a go-doudou service.

#### Basic Usage

```shell
go-doudou svc run [flags]
```

#### Common Parameters

- `-w, --watch`: Enable watch mode, automatically restart the service when files change (boolean value)

#### Examples

Start the service:
```shell
go-doudou svc run
```

Start the service with watch mode enabled:
```shell
go-doudou svc run -w
```

### svc push

The `svc push` command is used to build Docker images and push them to an image repository, while generating or updating K8s deployment YAML files.

#### Basic Usage

```shell
go-doudou svc push [flags]
```

#### Common Parameters

- `-r, --repo`: Private Docker image repository
- `--pre`: Image name prefix for building and pushing Docker images
- `--ver`: Docker image version

#### Examples

Build an image and push it to a private repository:
```shell
go-doudou svc push -r myregistry.com/myuser
```

Build an image with a version tag:
```shell
go-doudou svc push -r myregistry.com/myuser --ver v1.0.0
```

### svc deploy

The `svc deploy` command wraps the kubectl apply command, used to deploy a service to a Kubernetes cluster.

#### Basic Usage

```shell
go-doudou svc deploy [flags]
```

#### Common Parameters

- `-k, --k8sfile`: Kubernetes YAML file for deploying the service

#### Examples

Deploy a service with default configuration:
```shell
go-doudou svc deploy
```

Deploy a service with a specified Kubernetes configuration file:
```shell
go-doudou svc deploy -k myservice_deployment.yaml
```

### svc shutdown

The `svc shutdown` command wraps the kubectl delete command, used to shut down a deployed service.

#### Basic Usage

```shell
go-doudou svc shutdown [flags]
```

#### Common Parameters

- `-k, --k8sfile`: Kubernetes YAML file for deploying the service

#### Examples

Shut down a service deployed with default configuration:
```shell
go-doudou svc shutdown
```

Shut down a service with a specified Kubernetes configuration file:
```shell
go-doudou svc shutdown -k myservice_deployment.yaml
```

## Detailed Explanation of the name Command

The `name` command is used to bulk add or update JSON tags for struct fields.

### Basic Usage

```shell
go-doudou name [flags]
```

### Common Parameters

- `-f, --file`: Go source file path
- `-c, --case`: JSON tag naming convention, supports "lowerCamel", "snake", etc. (default "lowerCamel")
- `-s, --strategy`: Naming strategy name, currently only supports "lowerCamel" and "snake" (default "lowerCamel")
- `-o, --omitempty`: Whether to add `omitempty` marker (boolean value)
- `--form`: Whether to add form tags for [github.com/go-playground/form](https://github.com/go-playground/form)

### Examples

Add snake_case JSON tags to fields in the User struct:
```shell
go-doudou name -f ./model/user.go -c snake -o
```

Generate both JSON and form tags:
```shell
go-doudou name -f ./model/user.go -c lowerCamel -o --form
```

## Detailed Explanation of the enum Command

The `enum` command is used to generate functions implementing the `IEnum` interface for constants. This is useful for using enum types in Go.

### Basic Usage

```shell
go-doudou enum [flags]
```

### Common Parameters

- `-f, --file`: Absolute path to a Go source file

### Examples

Generate enum interface implementations for a file containing constant definitions:
```shell
go-doudou enum -f ./enum/status.go
```

Example of generated code (assuming status.go defines constants of type Status):

```go
// Original file
type Status int

const (
    StatusPending Status = iota
    StatusActive
    StatusInactive
)

// Generated functions
func (s *Status) StringSetter(value string) {
    switch value {
    case "StatusPending":
        *s = StatusPending
    case "StatusActive":
        *s = StatusActive
    case "StatusInactive":
        *s = StatusInactive
    default:
        *s = StatusPending
    }
}

func (s *Status) StringGetter() string {
    switch *s {
    case StatusPending:
        return "StatusPending"
    case StatusActive:
        return "StatusActive"
    case StatusInactive:
        return "StatusInactive"
    default:
        return "StatusPending"
    }
}
```

## Detailed Explanation of the version Command

The `version` command is used to display the version number of go-doudou and check if a new version is available.

### Basic Usage

```shell
go-doudou version
```

### Examples

```shell
go-doudou version
```

Example output:
```
go-doudou version v2.5.8
```

If an updated version is detected, you will be prompted whether to upgrade:
```
A new version is available: v2.5.9
Do you want to upgrade? [Y/n]
```

## Detailed Explanation of the work Command

The `work` command is used to build modular applications, it creates a project structure with a workspace and a main entry module.

### Basic Usage

```shell
go-doudou work [flags]
go-doudou work [command]
```

### Subcommands

- `init`: Initialize a workspace folder

### work init

The `work init` command is used to initialize a workspace folder for developing modular applications.

#### Basic Usage

```shell
go-doudou work init [dir]
```

where `[dir]` is the path to the workspace directory to initialize. If not specified, the current directory is used.

#### Workspace Structure

After executing the `work init` command, go-doudou will create the following workspace structure:

```
workspace/              # Workspace root directory
├── go.work             # Go workspace file, automatically includes main module and other components
└── main/               # Main entry module directory
    ├── go.mod          # go.mod file for the main module
    ├── .env            # Environment variable configuration file
    └── cmd/            # Command directory
        └── main.go     # Main entry file, responsible for loading and running all components
```

When adding components using `svc init --module`, go-doudou will automatically call the `go work use` command to add the new component to the workspace, and automatically update the `main/cmd/main.go` file to import the new component's plugins.

#### Examples

Initialize the current directory as a workspace:
```shell
go-doudou work init
```

Specify a directory as a workspace:
```shell
go-doudou work init ./my-workspace
```

## Practical Application Examples

### 1. Microservice Initialization and Development Process

Here is a complete microservice development process:

```shell
# Step 1: Initialize the project
go-doudou svc init myservice -m github.com/myorg/myservice

# Step 2: Edit the svc.go file to define the service interface
# Define the service interface in myservice/svc.go

# Step 3: Generate HTTP and gRPC service code
cd myservice
go-doudou svc http -c --doc
go-doudou svc grpc

# Step 4: Implement business logic
# Edit the svcimpl.go file

# Step 5: Run the service
go-doudou svc run

# Step 6: Build the image and deploy
go-doudou svc push -r myregistry.com/myuser
go-doudou svc deploy
```

### 2. Database Table-Based Microservice Generation

```shell
# Step 1: Initialize a project with database support
go-doudou svc init dbservice -m github.com/myorg/dbservice --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_grpc --db_rest

# Step 2: Run the service
cd dbservice
go-doudou svc run
```

### 3. Using the crud Command to Generate a CRUD Service from an Existing Database

```shell
# Step 1: Run the command in an existing project directory
cd myproject
go-doudou svc crud --db_driver postgres --db_dsn "host=localhost user=postgres password=postgres dbname=mydb" --db_service rest --db_soft deleted_at

# Step 2: Run the generated service
go-doudou svc run
```

### 4. Modular Application Development in a Workspace

```shell
# Step 1: Initialize the workspace
go-doudou work init my-workspace
cd my-workspace

# Step 2: Initialize modular components
# go-doudou will automatically execute "go work use" to add the component to the workspace
go-doudou svc init component-a -m my-workspace/component-a --module
go-doudou svc init component-b -m my-workspace/component-b --module

# Step 3: Define the service interface and generate code in each component
cd component-a
go-doudou svc http -c
go-doudou svc grpc

cd ../component-b
go-doudou svc http -c
go-doudou svc grpc

# Step 4: Start the main application - the main module will automatically import all components
cd ../main
go run cmd/main.go
```

How modular applications work:
- Each component generates a `plugin` package during initialization, used to register itself to the main application
- The main application (`main` module) automatically imports all component plugins and initializes them at runtime
- When calling `svc init --module`, go-doudou automatically executes `go work use` to add the new component to the workspace
- At the same time, it updates the `main/cmd/main.go` file, adding import statements for the new component's plugins

### 5. Implementing Enum Types

```shell
# Step 1: Define enum constants
# Define the following in a status.go file
type Status int

const (
    StatusPending Status = iota
    StatusActive
    StatusInactive
)

# Step 2: Generate enum interface implementation
go-doudou enum -f ./model/status.go
```

### 6. Generate Autocompletion Scripts

```shell
# Generate bash autocompletion script
go-doudou completion bash > ~/.bash_completion

# Generate zsh autocompletion script
go-doudou completion zsh > ~/.zsh_completion
```

## Advanced Usage and Tips

### 1. Using Annotations to Control Interface Permissions

In the service interface, you can add annotations using special comments, such as:

```go
// @role(ADMIN)
GetAdminData(ctx context.Context) (data string, err error)
```

Then check these annotations in middleware:

```go
annotations := httpsrv.RouteAnnotationStore.GetParams(routeName, "@role")
if !sliceutils.StringContains(annotations, userRole) {
    // Deny access
}
```

### 2. Custom protoc Command

For complex gRPC services, you can customize the protoc command:

```shell
go-doudou svc grpc --grpc_gen_cmd "protoc --proto_path=. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative --validate_out=lang=go,paths=source_relative:. transport/grpc/myservice.proto"
```

### 3. Environment Variables Affecting Service Behavior

go-doudou supports various environment variables to configure service behavior:

- `GDD_SERVICE_NAME`: Service name
- `GDD_SERVICE_GROUP`: Service group name
- `GDD_SERVICE_VERSION`: Service version
- `GDD_WEIGHT`: Service instance weight
- `GDD_REGISTER_HOST`: Service registration host
- `GDD_HTTP_PORT`: HTTP service port
- `GDD_GRPC_PORT`: gRPC service port
- `GDD_LOG_LEVEL`: Log level, optional values: "debug", "info", "warn", "error"
- `GDD_PROMETHEUS`: Whether to enable Prometheus metrics collection

Example:
```shell
export GDD_SERVICE_NAME=myservice
export GDD_HTTP_PORT=8080
export GDD_LOG_LEVEL=debug
go-doudou svc run
```

### 4. Integration Testing Tips

Using the test code generated by the `svc http test` command, you can easily implement integration tests:

```shell
# Step 1: Generate test code from a Postman Collection
go-doudou svc http test --collection ./collection.json --dotenv ./.env.test

# Step 2: Run the tests
go test -v ./test/...
```

### 5. Modular Application Development Tips

For large projects, you can easily manage modular applications using the `work` command and the `--module` flag:

```shell
# Initialize workspace
go-doudou work init my-workspace
cd my-workspace

# Add multiple modules - go-doudou will automatically call go work use
go-doudou svc init api-gateway -m my-workspace/api-gateway --module
go-doudou svc init user-service -m my-workspace/user-service --module
go-doudou svc init product-service -m my-workspace/product-service --module

# Start the application (main module automatically imports and initializes all components)
cd main
go run cmd/main.go
```

Advantages of modular applications:
- Clearer code organization, each component is maintained independently
- Can develop and test each component independently
- Shared dependencies are resolved through go.work, avoiding dependency conflicts
- The main application automatically integrates all components, no need to manually write integration code
- Suitable for the development and management of large microservice applications

## Summary

The go-doudou command-line tool provides rich functionality to help developers quickly build, deploy, and manage microservices. Through the various commands and subcommands introduced in this article, you can easily complete the entire process from service initialization and code generation to deployment.

The biggest feature of go-doudou is simplifying the microservice development process, eliminating the need to write a lot of boilerplate code, allowing you to focus on implementing business logic. It supports the generation of RESTful API and gRPC services, as well as integration with databases, making it an ideal choice for building modern Go microservices.

In addition, go-doudou also provides powerful modular application development support. Through the `work` command and the `--module` flag, you can easily manage multi-module projects. go-doudou will automatically execute `go work use` to add components to the workspace, and automatically import and initialize all components in the main application, greatly simplifying the development and maintenance work of modular applications.

::: warning Important Note
Please note that the `ddl` command has been deprecated and is no longer recommended for use. If you need to generate code from a database or synchronize Go structs to a database, please use the `svc crud` command instead.
:::

I hope this article helps you understand and use the go-doudou CLI tool. For more details, please refer to the [official documentation](https://go-doudou.github.io/) and example code repositories. 