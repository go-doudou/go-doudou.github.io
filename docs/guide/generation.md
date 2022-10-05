# Generation Behaviors

Besides understanding `go-doudou` CLI flags and subcommands usage, you should also know generation behaviors on generated files. I group them into three kind of behaviors `Incremental Generation`, `Overwritten Generation`, `Partial Modification` and `Skip Generation`.

## Incremental Generation

- `svcimpl.go`: Each time you run `go-doudou svc http`, existing code in it will not be overwritten, only new code will be appended to the end. So you can feel free to remove the generated code and write your own to fit your need. You will not lost any code, even rerun this command again and again as your will.

- `transport/httpsrv/handlerimpl.go`: Each time you run `go-doudou svc http` with `--handler` flag, existing code in it will not be overwritten, only new code will be appended to the end. So you can feel free to remove the generated code and write your own to fit your need. You will not lost any code, even rerun this command again and again as your will.

- `client/clientproxy.go`: Each time you run `go-doudou svc http` with `-c` flag, existing code in it will not be overwritten, only new code will be appended to the end. So you can feel free to remove the generated code and write your own to fit your need. You will not lost any code, even rerun this command again and again as your will.

## Overwritten Generation

- `transport/httpsrv/handler.go`: Each time you run `go-doudou svc http`, existing code in it will be overwritten. So don't edit it.

- `client/client.go`: Each time you run `go-doudou svc http` with `-c` flag, existing code in it will be overwritten. So don't edit it.

- `client/iclient.go`: Each time you run `go-doudou svc http` with `-c` flag, existing code in it will be overwritten. So don't edit it.

- `${service}_openapi3.go`: Each time you run `go-doudou svc http` with `--doc` flag, existing code in it will be overwritten. So don't edit it.

- `${service}_openapi3.json`: Each time you run `go-doudou svc http` with `--doc` flag, existing code in it will be overwritten. So don't edit it.

- `transport/grpc/${service}.pb.go`: Each time you run `go-doudou svc grpc`, existing code in it will be overwritten. So don't edit it.

- `transport/grpc/${service}.proto`: Each time you run `go-doudou svc grpc`, existing code in it will be overwritten. So don't edit it.

- `transport/grpc/${service}_grpc.pb.go`: Each time you run `go-doudou svc grpc`, existing code in it will be overwritten. So don't edit it.

## Partial Modification

- `${service}_deployment.yaml`: Each time the `go-doudou svc push` command is executed, the value of the `image` attribute will be updated, that is, the image name will be updated

- `${service}_statefulset.yaml`: Each time the `go-doudou svc push` command is executed, the value of the `image` attribute will be updated, that is, the image name will be updated

## Skip Generation

The other files will be skipped if they have been already generated.