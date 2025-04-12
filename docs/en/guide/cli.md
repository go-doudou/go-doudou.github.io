# CLI Commands

`go-doudou` comes with a built-in command-line code generator. `go-doudou` is the root command with two parameters:

- `-v` Prints the version of the currently installed go-doudou command-line tool

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou -v     
go-doudou version v2.5.8
```

- `-h` Prints the help information. All the subcommands introduced below have this parameter, so we won't mention it again.

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou -h
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

Use "go-doudou [command] --help" for more information about a command.
```

::: warning Note
Although you may still see the `ddl` command in the help information in some versions, this command has been deprecated and is not recommended for use in new projects. Please use the `svc crud` command instead.
:::

`go-doudou` also provides several subcommands to accelerate the entire development process. Let's look at them one by one.

## version

`go-doudou version` is mainly used to upgrade the `go-doudou` command-line tool. It not only prints information about the currently installed version but also prints information about the latest released version and asks if you want to upgrade.

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou version
go-doudou version v2.5.8

A new version is available: v2.5.9
Do you want to upgrade? [Y/n]
```

## completion

The `completion` command is used to generate shell autocompletion scripts for a specified shell, improving the efficiency of using the go-doudou command line.

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

Generate a bash autocompletion script:
```shell
go-doudou completion bash > ~/.bash_completion
```

Generate a zsh autocompletion script:
```shell
go-doudou completion zsh > ~/.zsh_completion
```

## help

`go-doudou help` is the same as `go-doudou -h`.

## svc

`go-doudou svc` is the most important and frequently used command, used to generate or update service-related code.

### init

`go-doudou svc init` is used to initialize a go-doudou application. You can either execute this command in an existing folder or specify the folder path to be initialized after `init`. If the folder doesn't exist, `go-doudou` will create it and generate some files to help you get started with development, and will also execute the `git init` command. If the specified folder already exists and is not empty, `go-doudou` will skip existing files and only generate non-existent files, ensuring that existing code is not overwritten.

```shell
➜  go-doudou-tutorials git:(master) go-doudou svc init helloworld
WARN[2022-02-17 18:14:53] file .gitignore already exists               
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/go.mod already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/.env already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/vo/vo.go already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/svc.go already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/Dockerfile already exists 
```

#### Common Parameters

- `-m, --mod`: Module name, used to specify the Go module path
- `--module`: Whether to initialize as a component of a modular application (boolean). When set to `true`, go-doudou will automatically call `go work use` to add the component to the workspace.
- `-f, --file`: OpenAPI 3.0 or Swagger 2.0 specification JSON file path or download link
- `--case`: Naming rules for protobuf message fields and JSON tags, supports "lowerCamel" and "snake" (default "lowerCamel")
- `-t, --type`: Specify the project type, value can be "grpc" or "rest" (default "grpc")
- `--db_driver`: Database driver type, options include "mysql", "postgres", "sqlite", "sqlserver", "tidb"
- `--db_dsn`: Database connection URL
- `--grpc_gen_cmd`: Command used to generate gRPC service and message code (default uses protoc command)

#### Examples

Basic initialization:
```shell
go-doudou svc init helloworld -m github.com/unionj-cloud/helloworld
```

Initialize with MySQL database and generate gRPC code:
```shell
go-doudou svc init myservice --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_grpc
```

Initialize as a component of a modular application:
```shell
go-doudou svc init component-c -m my-workspace/component-c --module
```

### http

`go-doudou svc http` is used to generate HTTP routes and handler code for RESTful interfaces.

```shell
go-doudou svc http -c
```

#### Common Parameters

- `--handler`: Whether to generate default handler implementation (boolean)
- `-c, --client`: `bool` type. Used to set whether to generate HTTP request client code that wraps [go-resty](https://github.com/go-resty/resty).
- `-e, --env`: `string` type. Used to set the environment variable name for the server baseUrl written into the HTTP request client code. If not specified, the capitalized service interface name in the `svc.go` file is used by default.
- `--case`: `string` type. In the default `http.Handler` interface implementation code generated, there are some anonymous structures as response bodies. You may need to set this parameter to specify the naming rules for field names during JSON serialization. Accepts two values: `lowerCamel` and `snake`. Default value is `lowerCamel`.
- `-o, --omitempty`: `bool` type. If this parameter is set, `,omitempty` will be added to the JSON tag values of anonymous structure fields in the default `http.Handler` interface implementation code.
- `-r, --routePattern`: `int` type. This parameter is used to set the generation rule for HTTP routes. If the value is `0`, `go-doudou` will first convert the method name of the service interface from camel case to snake case, then replace the underscore `_` with a backslash `/`, and the result is used as the API path. If the value is `1`, `go-doudou` will convert the service interface name to lowercase, convert the method name to lowercase as well, and then concatenate them with a backslash `/`. The result is used as the API path. Default value is `0`.
- `--doc`: Whether to generate OpenAPI 3.0 JSON documentation (boolean)
- `--allowGetWithReqBody`: Whether to allow GET requests with a request body (boolean)

Using the `-e` parameter example:

```shell
go-doudou svc http -c -e godoudou_helloworld
```

The generated code will use the specified environment variable:

```go
func NewHelloworldClient(opts ...ddhttp.DdClientOption) *HelloworldClient {
	defaultProvider := ddhttp.NewServiceProvider("godoudou_helloworld")
	defaultClient := ddhttp.NewClient()

	...

    return svcClient
}
```

### svc http client

`svc http client` is used to generate Go language HTTP request client code from a JSON format `OpenAPI 3.0` API document.

#### Common Parameters

- `-e, --env`: `string` type. Used to set the environment variable name for the server baseUrl written into the HTTP request client code.
- `-f, --file`: `string` type. Used to set the local path or download link of the API document.
- `-o, --omit`: `bool` type. If this parameter is set, `,omitempty` will be added after the field name in the JSON tag.
- `-p, --pkg`: `string` type. Used to set the package name, default value is `client`.

#### Examples

```shell
go-doudou svc http client -o -e GRAPHHOPPER -f https://docs.graphhopper.com/openapi.json --pkg graphhopper
```

::: tip
Each API needs to have a response body with a `200` status code, otherwise code for that API will not be generated, and an error message will be output in the command line terminal.

```shell
➜  go-doudou-tutorials git:(master) ✗ go-doudou svc http client -o -e PETSTORE -f https://petstore3.swagger.io/api/v3/openapi.json --pkg petstore
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Get /user/logout 
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Put /user/{username} 
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Delete /user/{username} 
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Post /user 
ERRO[2022-02-18 11:56:09] 200 response definition not found in api Post /pet/{petId} 
ERRO[2022-02-18 11:56:09] 200 response definition not found in api Delete /pet/{petId} 
ERRO[2022-02-18 11:56:09] 200 response definition not found in api Delete /store/order/{orderId} 
```
:::

### svc http test

`svc http test` is a subcommand of `svc http`, used to generate integration test code from Postman Collection files.

#### Basic Usage

```shell
go-doudou svc http test [flags]
```

#### Common Parameters

- `--collection`: Postman Collection v2.1 compatible file path
- `--dotenv`: dotenv format configuration file path for integration tests only

#### Examples

Generate test code from Postman Collection:
```shell
go-doudou svc http test --collection ./postman_collection.json --dotenv ./.env.test
```

### grpc

`go-doudou svc grpc` is used to generate `.proto` suffix files with `Protobuf v3` syntax, gRPC server and client stub code, etc. in the `transport/grpc` path. If the `svcimpl.go` file does not exist, it will also generate this file. If it already exists, it will incrementally update it. If there is no `main.go` file in the `cmd` path, it will generate this file. If it already exists, it will be skipped. The generated `main.go` file already has the relevant code to start the gRPC service.

```shell
...
├── svc.go
├── svcimpl.go
├── transport
│   ├── grpc
│   │   ├── helloworld.pb.go
│   │   ├── helloworld.proto
│   │   └── helloworld_grpc.pb.go
│   └── httpsrv
│       ├── handler.go
│       ├── handlerimpl.go
│       └── middleware.go
└── vo
    └── vo.go
```

#### Common Parameters

- `-o, --omitempty`: Whether to add `omitempty` to JSON tags in generated anonymous structures (boolean)
- `--case`: Protobuf message field naming strategy, supports "lowerCamel" and "snake" (default "lowerCamel")
- `--grpc_gen_cmd`: Command used to generate gRPC service and message code (default uses protoc command)
- `--http2grpc`: Whether to generate RESTful API for gRPC service (boolean)
- `--allow_get_body`: Whether to allow GET requests with a request body (boolean)
- `--annotated_only`: Whether to only generate gRPC API for methods with @grpc annotation (boolean)

#### Examples

Generate basic gRPC service code:
```shell
go-doudou svc grpc
```

Generate gRPC service code and provide RESTful API proxy:
```shell
go-doudou svc grpc --http2grpc
```

### crud

The `svc crud` command is used to generate generic CRUD code from a database. This command is the recommended replacement for the deprecated `ddl` command.

#### Basic Usage

```shell
go-doudou svc crud [flags]
```

#### Common Parameters

- `--db_orm`: Specify ORM, currently only supports gorm (default "gorm")
- `--db_driver`: Database driver type, options include "mysql", "postgres", "sqlite", "sqlserver", "tidb"
- `--db_dsn`: Database connection URL
- `--db_soft`: Database soft delete column name (default "deleted_at")
- `--db_service`: Generate gRPC or REST service, accepts values: grpc or rest
- `--db_gen_gen`: Whether to generate gen.go file (boolean)
- `--db_table_prefix`: Table prefix or PostgreSQL schema name
- `--db_table_glob`: Used to filter glob-matched tables
- `--db_table_exclude_glob`: Used to exclude glob-matched tables
- `--case`: Naming rules for protobuf message fields and JSON tags, supports "lowerCamel" and "snake" (default "lowerCamel")
- `--db_type_mapping`: Specify custom column type to Go type mappings
- `--db_omitempty`: Whether to add `omitempty` to JSON tags in generated model fields (boolean)
- `--grpc_gen_cmd`: Command used to generate gRPC service and message code (default uses protoc command)

#### Examples

Generate CRUD code from MySQL database:
```shell
go-doudou svc crud --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_service rest
```

Generate CRUD code from PostgreSQL database, and specify schema:
```shell
go-doudou svc crud --db_driver postgres --db_dsn "host=localhost user=postgres password=postgres dbname=mydb port=5432 sslmode=disable" --db_table_prefix public --db_service grpc
```

### run

`go-doudou svc run` is used to start the service.

#### Common Parameters

- `-w, --watch`: `bool` type. Used to enable `watch` mode, i.e., hot reload. Not supported on the Windows platform. Although this feature has been implemented, it is not recommended for use.

#### Examples

Start the service:
```shell
go-doudou svc run
```

Start the service with watch mode enabled:
```shell
go-doudou svc run -w
```

### push

`go-doudou svc push` is used to generate a docker image, push it to a remote image repository, and generate k8s deployment files. It actually executes the commands `go mod vendor`, `docker build`, `docker tag`, `docker push` in sequence.

#### Common Parameters

- `--pre`: `string` type. Used to set the image file name prefix.
- `-r, --repo`: `string` type. Used to set the remote image repository address.
- `--ver`: Docker image version

#### Examples

```shell
go-doudou svc push --pre godoudou_ -r wubin1989
```

After the command is executed, you will get two files:

- `${service}_deployment.yaml`: Stateless k8s application deployment file, recommended for monolithic application architecture.
- `${service}_statefulset.yaml`: Stateful k8s application deployment file, recommended for microservice architecture.

### deploy

`go-doudou svc deploy` is used to deploy the service to k8s. It actually executes the `kubectl apply -f` command.

#### Common Parameters

- `-k, --k8sfile`: `string` type. Used to set the local path of the k8s deployment file. Default value is `${service}_statefulset.yaml`.

#### Examples

```shell
go-doudou svc deploy -k helloworld_deployment.yaml
```

### shutdown

`go-doudou svc shutdown` is used to take the service offline from k8s, executing the `kubectl delete -f` command.

#### Common Parameters

- `-k, --k8sfile`: `string` type. Used to set the local path of the k8s deployment file. Default value is `${service}_statefulset.yaml`.

#### Examples

```shell
go-doudou svc shutdown -k helloworld_deployment.yaml
```

## name

The `name` command is used to batch add or update JSON tags for structure fields. It generates `json` tags for structure fields according to the specified naming rule. The default generation strategy is **lowercase camel case naming strategy**, and it also supports snake case naming. Unexported fields are skipped, and only JSON tags of exported fields are modified. It supports `omitempty`.

### Common Parameters

- `-f, --file`: Go source file path
- `-c, --case`: JSON tag naming rule, supports "lowerCamel", "snake", etc. (default "lowerCamel")
- `-s, --strategy`: Name of strategy, currently only supports "lowerCamel" and "snake" (default "lowerCamel")
- `-o, --omitempty`: Whether to add `omitempty` mark (boolean)
- `--form`: Whether to add form tags for [github.com/go-playground/form](https://github.com/go-playground/form)

### Usage

- Write `//go:generate go-doudou name --file $GOFILE` in the go file, no position restriction, but it's best to write it at the top. The current implementation affects all structs in the entire file.

```go
//go:generate go-doudou name --file $GOFILE

type Event struct {
	Name      string
	EventType int
}

type TestName struct {
	Age    age
	School []struct {
		Name string
		Addr struct {
			Zip   string
			Block string
			Full  string
		}
	}
	EventChan chan Event
	SigChan   chan int
	Callback  func(string) bool
	CallbackN func(param string) bool
}
```

- Execute the command `go generate ./...` in the project root path

```go
type Event struct {
	Name      string `json:"name"`
	EventType int    `json:"eventType"`
}

type TestName struct {
	Age    age `json:"age"`
	School []struct {
		Name string `json:"name"`
		Addr struct {
			Zip   string `json:"zip"`
			Block string `json:"block"`
			Full  string `json:"full"`
		} `json:"addr"`
	} `json:"school"`
	EventChan chan Event              `json:"eventChan"`
	SigChan   chan int                `json:"sigChan"`
	Callback  func(string) bool       `json:"callback"`
	CallbackN func(param string) bool `json:"callbackN"`
}
```

### Examples

Add snake_case JSON tags to User structure fields:
```shell
go-doudou name -f ./model/user.go -c snake -o
```

Generate both JSON and form tags:
```shell
go-doudou name -f ./model/user.go -c lowerCamel -o --form
```

## enum

The `enum` command is used to generate functions that implement the `IEnum` interface for constants. This is very useful for using enum types in Go.

### Basic Usage

```shell
go-doudou enum [flags]
```

### Common Parameters

- `-f, --file`: Absolute path of the Go source file

### Examples

Generate enum interface implementation for a file containing constant definitions:
```shell
go-doudou enum -f ./enum/status.go
```

Generated code example (assuming status.go defines constants of type Status):

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

## work

The `work` command is used to build modular applications. It creates a project structure with a workspace and a main entry module.

### Basic Usage

```shell
go-doudou work [flags]
go-doudou work [command]
```

### Subcommands

- `init`: Initialize workspace folder

### work init

The `work init` command is used to initialize a workspace folder for developing modular applications.

#### Basic Usage

```shell
go-doudou work init [dir]
```

Where `[dir]` is the workspace directory path to be initialized. If not specified, the current directory is used.

#### Workspace Structure

After executing the `work init` command, go-doudou will create the following workspace structure:

```
workspace/              # Workspace root directory
├── go.work             # Go workspace file, automatically includes the main module and other components
└── main/               # Main entry module directory
    ├── go.mod          # go.mod file for the main module
    ├── .env            # Environment variables configuration file
    └── cmd/            # Command directory
        └── main.go     # Main entry file, responsible for loading and running all components
```

When using `svc init --module` to add components, go-doudou will automatically call the `go work use` command to add the new component to the workspace, and automatically update the `main/cmd/main.go` file to import the new component's plugin.

#### Examples

Initialize the current directory as a workspace:
```shell
go-doudou work init
```

Initialize a specified directory as a workspace:
```shell
go-doudou work init ./my-workspace
```

## Advanced Usage and Tips

### 1. Control Interface Permissions with Annotations

In the service interface, you can use special comments to add annotations, such as:

```go
// @role(ADMIN)
GetAdminData(ctx context.Context) (data string, err error)
```

Then check these annotations in middleware:

```go
annotations := httpsrv.RouteAnnotationStore.GetParams(routeName, "@role")
if !sliceutils.StringContains(annotations, userRole) {
    // Reject access
}
```

### 2. Customize protoc Command

For complex gRPC services, you can customize the protoc command:

```shell
go-doudou svc grpc --grpc_gen_cmd "protoc --proto_path=. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative --validate_out=lang=go,paths=source_relative:. transport/grpc/myservice.proto"
```

### 3. Configure Environment Variables to Affect Service Behavior

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