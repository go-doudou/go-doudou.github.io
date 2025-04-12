---
sidebar: auto
---

# Contribution

## Code Repositories

- Github: [https://github.com/unionj-cloud/go-doudou](https://github.com/unionj-cloud/go-doudou)
- Gitee: [https://gitee.com/unionj-cloud/go-doudou](https://gitee.com/unionj-cloud/go-doudou)

## Project Structure

go-doudou consists of three packages:

- `cmd`: Responsible for the `go-doudou` command-line tool and code generators
- `framework`: Responsible for the REST/gRPC framework
- `toolkit`: Responsible for the toolkit utilities

### `cmd` Package

Please refer to the comments below for descriptions of core files and folders.

```shell
➜  cmd git:(main) tree -L 2
.
├── client.go  # go-doudou svc http client command, generates go language http request client directly from OpenAPI 3.0 json document
├── client_test.go
├── ddl.go  # go-doudou ddl command, synchronizes database table structures and structs in the domain package, generates dao layer code
├── ddl_test.go
├── deploy.go  # go-doudou svc deploy command, deploys to k8s cluster
├── deploy_test.go
├── http.go  # go-doudou svc http command, generates the full set of code needed for RESTful services, including but not limited to main function and code for handling http requests and responses
├── http_test.go
├── init.go  # go-doudou svc init command, initializes go-doudou service project structure
├── init_test.go
├── internal
│   ├── astutils  # ast utility classes, parses struct and interface type source code
│   ├── ddl  # ddl command core code
│   ├── executils  # terminal command utility for executing commands from go code
│   ├── name  # name tool core code
│   ├── openapi  # core code for parsing OpenAPI 3.0 json document and generating http request client
│   └── svc  # code generator core code for generating the full set of RESTful service code
├── mock
│   ├── mock_executils_runner.go
│   ├── mock_promptui_select_interface.go
│   └── mock_svc.go
├── name.go  # go-doudou name command, a small tool for modifying the json tags of structs, recommended to use with go generate command
├── name_test.go
├── promptui_select_interface.go
├── push.go  # go-doudou svc push command, locally packages docker image and pushes to remote image repository
├── push_test.go
├── root.go  # go-doudou root command
├── root_test.go
├── run.go  # go-doudou svc run command, can be used to start the service locally, not for online deployment
├── run_test.go
├── shutdown.go  # go-doudou svc shutdown command, used to shut down k8s pods
├── shutdown_test.go
├── svc.go  # go-doudou svc command
├── svc_test.go
├── testdata
│   ├── pushcmd
│   └── testsvc
├── version.go  # go-doudou version command, used to upgrade the go-doudou command line tool version
└── version_test.go

11 directories, 28 files
```

### `framework` Package

Please refer to the comments below for descriptions of core files and folders.

```shell
➜  framework git:(main) tree -L 2
.
├── buildinfo                              # used when building binary files to write metadata like builder, build time, and go-doudou dependency version
│   └── buildinfo.go
├── cache
│   ├── 2qcache.go
│   ├── arccache.go
│   ├── base.go
│   ├── item.go
│   └── lrucache.go
├── configmgr                              # core code for integrating apollo and nacos remote configuration centers
│   ├── apollo.go
│   ├── apollo_test.go
│   ├── mock
│   ├── nacos.go
│   ├── nacos_test.go
│   └── testdata
├── framework.go
├── grpcx                                  # gRPC service framework layer core code
│   ├── grpc_resolver_nacos
│   ├── interceptors
│   └── server.go
├── internal
│   ├── banner
│   └── config
├── logger                                 # deprecated
│   ├── configure.go
│   └── entry.go
├── ratelimit                              # rate limiter
│   ├── limit.go
│   ├── limit_test.go
│   ├── limiter.go
│   ├── memrate
│   └── redisrate
├── registry                               # service registration related code
│   ├── etcd                               # etcd related
│   ├── nacos                              # nacos related
│   ├── node.go
│   ├── node_test.go
│   └── utils
├── rest                                   # REST service framework layer core code
│   ├── bizerror.go
│   ├── bizerror_test.go
│   ├── confighandler.go
│   ├── dochandler.go
│   ├── docindex.go
│   ├── gateway.go
│   ├── httprouter
│   ├── middleware.go
│   ├── middleware_test.go
│   ├── mock
│   ├── model.go
│   ├── prometheus
│   ├── promhandler.go
│   ├── prommiddleware.go
│   ├── server.go
│   └── validate.go
├── restclient                             # REST service client related code
│   ├── restclient.go
│   └── restclient_test.go
├── testdata
│   ├── change
│   ├── checkIc2
│   ├── inputanonystruct
│   ├── nosvc
│   ├── novo
│   ├── openapi
│   ├── outputanonystruct
│   ├── svc.go
│   ├── svcp.go
│   ├── testfilesdoc1_openapi3.json
│   ├── usersvc_deployment.yaml
│   ├── usersvc_statefulset.yaml
│   └── vo
└── tracing                               # code related to integrating jaeger call chain tracking
    └── tracer.go

34 directories, 40 files
```

### `toolkit` Package

Please refer to the comments below for descriptions of core files and folders.

```shell
➜  toolkit git:(main) tree -L 2
.
├── caller  # tool for getting the caller's package name, method/function name, code file path and line number
│   ├── caller.go
│   └── caller_test.go
├── cast  # converts string type values to specified type values
│   ├── string.go
│   ├── string_test.go
│   ├── stringslice.go
│   └── stringslice_test.go
├── constants  # currently only contains constants related to date formats
│   └── constants.go
├── copier  # deep copy tool based on json serialization and deserialization mechanism
│   ├── copier.go
│   └── copier_test.go
├── dotenv  # tool for parsing dotenv configuration files
│   ├── dotenv.go
│   ├── dotenv_test.go
│   └── testdata
├── fileutils  # file operation related tools
│   ├── fileutils.go
│   └── fileutils_test.go
├── hashutils  # tools for generating password hashes and uuid strings
│   ├── hashutils.go
│   └── hashutils_test.go
├── ip  # tool for getting the server's public IP
│   ├── ip.go
│   └── ip_test.go
├── loadbalance  # client-side load balancing related tools
│   ├── subset.go  # splits multiple service instances into several subsets assigned to different clients
│   └── subset_test.go
├── maputils  # map related tools
│   ├── maputils.go  # currently only has a Diff method for finding differences between two maps
│   └── maputils_test.go
├── openapi  # code related to parsing OpenAPI 3.0 documents
│   └── v3
├── pathutils  # file path related tools
│   ├── pathutils.go
│   └── pathutils_test.go
├── random  # random number related tools
│   └── rand.go
├── reflectutils  # reflection related tools
│   └── reflectutils.go
├── sliceutils  # slice related tools
│   ├── sliceutils.go
│   └── sliceutils_test.go
├── sqlext  # sql statement builder related code
│   ├── arithsymbol
│   ├── logger
│   ├── logicsymbol
│   ├── query
│   ├── sortenum
│   ├── testdata
│   └── wrapper
├── stringutils  # string related tools
│   ├── stringutils.go
│   └── stringutils_test.go
├── templateutils  # text/template related tools
│   ├── funcs.go
│   └── templateutils.go
├── timeutils  # time related tools
│   ├── timeutils.go
│   └── timeutils_test.go
├── yaml # tool for parsing yaml configuration files
│   ├── testdata
│   ├── yaml.go
│   └── yaml_test.go
└── zlogger # logging related
    └── entry.go

31 directories, 35 files
```

## Code Quality

We place a high value on code quality. If you want to contribute code, please ensure that the unit tests can pass.

```shell
go test ./... -count=1
```

## Discussion

Feel free to discuss new features or suggest features you want in the discussions area: [https://github.com/unionj-cloud/go-doudou/discussions](https://github.com/unionj-cloud/go-doudou/discussions)

## Bugs

If you encounter a bug, please report it here: [https://github.com/unionj-cloud/go-doudou/issues](https://github.com/unionj-cloud/go-doudou/issues)

## Code Contribution

Code contributions are welcome: [https://github.com/unionj-cloud/go-doudou/pulls](https://github.com/unionj-cloud/go-doudou/pulls)

## TODO

Task board: [https://github.com/unionj-cloud/go-doudou/projects/1](https://github.com/unionj-cloud/go-doudou/projects/1) 