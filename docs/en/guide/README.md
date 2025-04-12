# Introduction
`go-doudou` (pronounced as "doudou", named after my son's nickname) is a microservice framework developed in Go language, supporting both REST monolithic applications and gRPC microservices.

### Why?
#### Background
After years of Go language development practice and technical framework research, we haven't found a Go language microservice framework that fully satisfies our needs.

#### Reasons
- We need a code generator to help us generate as much code as possible. The goal is: even if we know nothing about relatively low-level network principles like TCP/IP, RESTful, and RPC, or service governance topics like service registration and discovery, fault detection, and complex load balancing, and we only know how to write CRUD code, we can still develop robust programs or services before the delivery date. But we couldn't find tools or frameworks that met this goal.
- In the early days of my programming career, I was a full-time front-end development engineer. I know what kind of backend API support the front-end needs. Through research, I chose the `OpenAPI 3.0` (aka `swagger v3`) interface description specification as a bridge for front-end and back-end collaboration. I want to provide front-end members not only with online documentation but also a mock server that can generate fake data.
- Although there are quite a few learning materials about Protobuf syntax and best practices available online, we still feel the learning curve is quite steep. We need a technical solution for gRPC that both newcomers and veterans can quickly pick up and use.

#### Result
`go-doudou` was released. This project is mainly inspired by the projects listed below:
- [https://github.com/kujtimiihoxha/kit](https://github.com/kujtimiihoxha/kit): Code generator written for the `go-kit` technology stack
- [https://spec.openapis.org/oas/v3.0.3](https://spec.openapis.org/oas/v3.0.3): `OpenAPI 3.0` interface description specification

### Design Philosophy
- Design First: We recommend designing interfaces before starting to implement business requirements
- Contract Spirit: We recommend using `OpenAPI 3.0` and `Protobuf v3` interface description specifications as a bridge for communication and collaborative development between server-side and client-side development teams

### Features
- Low Code: Parse the code of Go language `interface` you define through the [`ast`](https://pkg.go.dev/go/ast) package and [`parser`](https://pkg.go.dev/go/parser) package in the Go standard library, and generate `main` functions, routing and `http handler` code, interface implementation class code containing generated fake data response logic, Go language http request client code, `json` format `OpenAPI 3.0` interface documentation, and proto files for generating gRPC code, etc.
- Support using DNS addresses for service registration and discovery
- Support both monolithic application and microservice system development
- Built-in lightweight ORM library and table structure synchronization tool
- Out-of-the-box support for client-side load balancing, circuit breaking, rate limiting, bulkheads, timeouts, and retries, and other service governance mechanisms
- Out-of-the-box support for graceful shutdown
- Out-of-the-box support for development-time hot restart based on the Go file monitoring mechanism (Mac and Linux platforms)
- Ready-to-use online interface documentation developed based on [`element-ui`](https://github.com/ElemeFE/element)
- Ready-to-use online service list developed based on [`element-ui`](https://github.com/ElemeFE/element)
- Built-in common http middleware, such as link tracking (Jaeger), request logging, request ID, and service monitoring (Prometheus), etc.
- Ready-to-use docker and k8s deployment files
- Easy to get started and simple to use 