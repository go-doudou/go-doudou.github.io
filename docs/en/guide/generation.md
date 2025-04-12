# Code Generation Rules

In addition to understanding the usage of the `go-doudou` command-line tool, you also need to understand the code generation rules. I have divided the rules into four categories: "Incremental Generation", "Overwrite Generation", "Partial Modification", and "Skip".

## Incremental Generation

- `svcimpl.go`: Each time you execute the `go-doudou svc http` command, existing code will not be overwritten, new code will only be added at the end of the file, so you can freely modify the generated code to suit your business needs. Repeated execution of this command will not cause you to lose any manually written code.

- `transport/httpsrv/handlerimpl.go`: Each time you execute the `go-doudou svc http` command with the `--handler` parameter, existing code will not be overwritten, new code will only be added at the end of the file, so you can freely modify the generated code to suit your business needs. Repeated execution of this command will not cause you to lose any manually written code.

- `client/clientproxy.go`: Each time you execute the `go-doudou svc http` command with the `-c` parameter, existing code will not be overwritten, new code will only be added at the end of the file, so you can freely modify the generated code to suit your business needs. Repeated execution of this command will not cause you to lose any manually written code.

## Overwrite Generation

- `transport/httpsrv/handler.go`: Each time you execute the `go-doudou svc http` command, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `client/client.go`: Each time you execute the `go-doudou svc http` command with the `-c` parameter, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `client/iclient.go`: Each time you execute the `go-doudou svc http` command with the `-c` parameter, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `${service}_openapi3.go`: Each time you execute the `go-doudou svc http` command with the `--doc` parameter, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `${service}_openapi3.json`: Each time you execute the `go-doudou svc http` command with the `--doc` parameter, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `transport/grpc/${service}.pb.go`: Each time you execute the `go-doudou svc grpc` command, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `transport/grpc/${service}.proto`: Each time you execute the `go-doudou svc grpc` command, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `transport/grpc/${service}_grpc.pb.go`: Each time you execute the `go-doudou svc grpc` command, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

- `transport/grpc/annotation.go`: Each time you execute the `go-doudou svc grpc` command, the code will be regenerated, so please do not manually modify this file, all manually modified or written code will be lost.

## Partial Modification

- `${service}_deployment.yaml`: Each time you execute the `go-doudou svc push` command, the value of the `image` attribute will be updated, i.e., updating the image name

- `${service}_statefulset.yaml`: Each time you execute the `go-doudou svc push` command, the value of the `image` attribute will be updated, i.e., updating the image name

## Skip

Other files, if they already exist, will be skipped. 