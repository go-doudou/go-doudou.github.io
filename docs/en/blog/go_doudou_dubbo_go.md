---
sidebar: auto
---

# Practical Guide: Integrating go-doudou with dubbo-go via gRPC

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3158223bb49441e695370bee3ae570a2~tplv-k3u1fbpfcp-watermark.image?)
Photo by [NEOM](https://unsplash.com/@neom?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/yUcH008GS6A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

In our practice and exchange of Go language microservices, we've learned that some companies or technology teams that previously used Java are now developing microservices with the dubbo-go framework that, together with legacy Java services, form a heterogeneous system. Some technology teams also want to use the go-doudou microservice framework for agile development and rapid service delivery. But the question arises: Can go-doudou interoperate with existing dubbo ecosystem services and join the existing microservice architecture? Since version v2.0.8, go-doudou has implemented a zookeeper-based service registration and discovery mechanism that allows services written with the dubbo framework to interoperate via the gRPC protocol. This article demonstrates how to get started with the go-doudou microservice framework and achieve interoperability with services written in dubbo-go through a simple case. Example code repository address: https://github.com/unionj-cloud/go-doudou-tutorials/tree/master/dubbodemo

## Project Structure Explanation

```shell
.
├── README.md
├── docker-compose.yml
├── dubbo
│   ├── go.mod
│   ├── go.sum
│   └── rpc
│       └── grpc
│           ├── go-client    # dubbo gRPC service consumer
│           ├── go-server    # dubbo gRPC service provider
│           ├── protobuf
│           └── service-b
├── service-a                      # go-doudou RESTful service a
└── service-b                      # go-doudou gRPC service b
```
This demo project consists of three microservices and one client program.  
The three microservices are:
1. service-a: A RESTful service using the go-doudou framework, demonstrating how go-doudou calls dubbo-go's gRPC service through its interface;
2. service-b: A gRPC service using the go-doudou framework, used to demonstrate being called by dubbo-go's client;
3. go-server: A gRPC service using the dubbo-go framework, used to demonstrate being called by go-doudou's client;  

The client program is:
1. go-client: A client program using the dubbo-go framework, used to demonstrate dubbo-go calling go-doudou's gRPC service;

## Starting Zookeeper
We first need to start a three-node zookeeper cluster through docker-compose, by executing the command `docker-compose -f docker-compose.yml up -d --remove-orphans`.
```yaml
# docker-compose.yml
version: '3.1'

services:
  zoo1:
    image: zookeeper
    restart: always
    hostname: zoo1
    ports:
      - 2181:2181
    environment:
      ZOO_MY_ID: 1
      ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181

  zoo2:
    image: zookeeper
    restart: always
    hostname: zoo2
    ports:
      - 2182:2181
    environment:
      ZOO_MY_ID: 2
      ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181

  zoo3:
    image: zookeeper
    restart: always
    hostname: zoo3
    ports:
      - 2183:2181
    environment:
      ZOO_MY_ID: 3
      ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181
```
After starting, we can connect to localhost:2181 using prettyZoo to view the nodes. Currently, no services are registered yet.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c370c3df18c439a873ec5be02a1bcf8~tplv-k3u1fbpfcp-zoom-1.image)

## Starting service-b
Go to the service-b path and execute the command `go run cmd/main.go`. When you see the three lines of log output in the red box below, it indicates that the service has started.
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d97b13b2848f422896c63e1222a07b9a~tplv-k3u1fbpfcp-watermark.image?)
Now if we look at prettyZoo again, we can see that the cloud.unionj.ServiceB_grpc service has been registered.
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e799de7c45bc454f8834eb54f343d224~tplv-k3u1fbpfcp-watermark.image?)
The node after providers, `grpc%3A%2F%2F192.168.189.126%3A50051%2Fcloud.unionj.ServiceB_grpc%3Fgroup%3Dgroup%26rootPath%3D%26version%3Dv2.2.2%26weight%3D1`, is a URL-escaped string. Before escaping, the content is `grpc://192.168.189.126:50051/cloud.unionj.ServiceB_grpc?group=group&rootPath=&version=v2.2.2&weight=1`. The content and formatting rules of this node are compatible with the dubbo ecosystem, so services can discover each other. Further explanation is as follows:

1. `grpc://`: Indicates the communication protocol, which is the gRPC protocol here. go-doudou currently only supports http and gRPC;
2. `192.168.189.126`: Indicates the service registration host, by default taking the host's private IP. This can be customized through the environment variable `GDD_REGISTER_HOST`;
3. `50051`: Indicates the gRPC service port number, default 50051. This can be customized through the environment variable `GDD_GRPC_PORT`;
4. `cloud.unionj.ServiceB_grpc`: Indicates the service name, formed by the user-configured service name + underscore + communication protocol. Since the go-doudou framework supports starting the same set of code to provide both http protocol RESTful services and gRPC protocol RPC services, the underscore + communication protocol is needed for distinction. In this example, the service name configured by the user through the environment variable `GDD_SERVICE_NAME` is cloud.unionj.ServiceB, and go-doudou added `_grpc`;
5. `group`: Indicates the service group name, which can be customized through the environment variable `GDD_SERVICE_GROUP`;
6. `version`: Indicates the service version, which can be customized through the environment variable `GDD_SERVICE_VERSION`. The service name + service group name + service version together uniquely identify a service, and if any one does not match, the service cannot be called;
7. `rootPath`: Indicates the interface path prefix, only valid under the http protocol;
8. `weight`: Indicates the weight of the service instance, used for client load balancing, default 1. This can be customized through the environment variable `GDD_WEIGHT`;

Let's look at the RPC interface provided by ServiceB.
```go
// svc.go
package service

import (
   "context"
   "service-b/dto"
)

//go:generate go-doudou svc http -c
//go:generate go-doudou svc grpc

type ServiceB interface {
   GetDeptById(ctx context.Context, deptId int) (dept dto.DeptDto, err error)
}
```
From the svc.go file, we can see that ServiceB service defines only one RPC interface, with the department ID as input and the department DTO and error as output. Let's see how the interface is implemented.
```go
// svcimpl.go
func (receiver *ServiceBImpl) GetDeptByIdRpc(ctx context.Context, request *pb.GetDeptByIdRpcRequest) (*pb.DeptDto, error) {
   return &pb.DeptDto{
      Id:         request.DeptId,
      Name:       "Test Department",
      StaffTotal: 10,
   }, nil
}
```
The implementation logic is very simple, the returned department name is always "Test Department", and the department ID takes the value passed in.

## Starting go-server
Go to the `dubbo/rpc/grpc/go-server` path and execute the command `go run cmd/server.go`.

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0a61f846978418bba1ac5a4e78f7bc0~tplv-k3u1fbpfcp-watermark.image?)
The log output when dubbo-go service starts is quite long, but seeing the log output in the screenshot above indicates that the service has started and registered successfully.

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/218d6c3cc4974509b17be921d3fe7643~tplv-k3u1fbpfcp-watermark.image?)
We can also see the nodes registered by dubbo-go through prettyZoo.  
Regarding the usage of dubbo-go, colleagues who have used or are using dubbo-go do not need to be introduced, and it is not the focus of this article.
Open the server.go file, let's look at the interface implementation provided by go-server.
```go
type GreeterProvider struct {
   pb.GreeterProviderBase
}

func (g *GreeterProvider) SayHello(ctx context.Context, req *pb.HelloRequest) (reply *pb.HelloReply, err error) {
   fmt.Printf("req: %v", req)
   return &pb.HelloReply{Message: "this is message from reply"}, nil
}
```
Very simple, just an RPC interface called SayHello.

## Starting service-a
Go to service-a and execute the command `go run cmd/main.go`.

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bec098bca54e4667a5d428217075ccad~tplv-k3u1fbpfcp-watermark.image?)
When you see the log output as shown in the figure above, it indicates that the service has started successfully. Let's look at the service registration node through prettyZoo again.

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74b27985feae4846a119cbb00aed66d2~tplv-k3u1fbpfcp-watermark.image?)
cloud.unionj.ServiceA_rest is the node that service-a registers to zookeeper.

Let's look at the RESTful interface provided by service-a.
```go
package service

import (
   "context"
   "service-a/dto"
)

//go:generate go-doudou svc http -c
//go:generate go-doudou svc grpc

type ServiceA interface {
   GetUserById(ctx context.Context, userId int) (user dto.UserDto, err error)
   GetRpcUserById(ctx context.Context, userId int) (user dto.UserDto, err error)
   GetRpcSayHello(ctx context.Context, name string) (reply string, err error)
}
```
Let's focus on the two interfaces with the `GetRpc` prefix, which are interfaces used as clients to call gRPC services. `GetRpcUserById` calls the service-b service, and `GetRpcSayHello` calls the go-server service. Let's continue to look at the interface implementation code of ServiceA.  

```go
var _ ServiceA = (*ServiceAImpl)(nil)

type ServiceAImpl struct {
   conf          *config.Config
   bClient       client.IServiceBClient
   grpcClient    pb.ServiceBServiceClient
   greeterClient protobuf.GreeterClient
}
```
The ServiceA interface implementation structure ServiceAImpl has two gRPC client member variables:
1. grpcClient: service-b's gRPC client
2. greeterClient: go-server's gRPC client

These two clients are injected in the main.go file:
```go
// Establish a gRPC connection to ServiceB based on zk, with built-in smooth weighted load balancing
grpcConn := zk.NewSWRRGrpcClientConn(zk.ServiceConfig{
   Name:    "cloud.unionj.ServiceB_grpc",
   Group:   "group",
   Version: "v2.2.2",
}, dialOptions...)
defer grpcConn.Close()

// Connect to ServiceB's gRPC server using the gRPC connection
grpcClient := pb.NewServiceBServiceClient(grpcConn)

// Similarly, establish a gRPC connection to go-server based on zk, with built-in smooth weighted load balancing
dubbo := zk.NewSWRRGrpcClientConn(zk.ServiceConfig{
   Name:    "org.apache.dubbo.sample.GreeterProvider",
   Group:   "group",
   Version: "v2.2.2",
}, dialOptions...)
defer dubbo.Close()

// Connect to go-server's gRPC server using the gRPC connection
greeterClient := protobuf.NewGreeterClient(dubbo)
```

So far, the go-doudou service client has successfully connected to both the go-doudou gRPC service and the dubbo-go gRPC service. Let's look at the implementation code for `GetRpcUserById` and `GetRpcSayHello`:

```go
func (receiver *ServiceAImpl) GetRpcUserById(ctx context.Context, userId int) (user dto.UserDto, err error) {
   // Use the gRPC client to call service-b through the gRPC protocol
   output, err := receiver.grpcClient.GetDeptByIdRpc(ctx, &pb.GetDeptByIdRpcRequest{
      DeptId: int32(userId),
   })
   if err != nil {
      return
   }
   user = dto.UserDto{
      Id:       int(output.Id),
      Name:     "test",
      DeptId:   int(output.Id),
      DeptName: output.Name,
   }
   return
}

func (receiver *ServiceAImpl) GetRpcSayHello(ctx context.Context, name string) (reply string, err error) {
   // Use the gRPC client to call go-server through the gRPC protocol
   output, err := receiver.greeterClient.SayHello(ctx, &protobuf.HelloRequest{
      Name: name,
   })
   if err != nil {
      return
   }
   reply = output.Message
   return
}
```

Testing service-a's implementation call to service-b:

```shell
curl -X 'GET' \
  'http://localhost:6060/v1/rpcdept?userId=1' \
  -H 'accept: application/json'
```

And we get the response:

```json
{
  "id": 1,
  "name": "test",
  "deptId": 1,
  "deptName": "Test Department"
}
```

Now, let's test service-a's implementation call to go-server:

```shell
curl -X 'GET' \
  'http://localhost:6060/v1/rpchello?name=yongchang' \
  -H 'accept: application/json'
```

And we get the response:

```json
"this is message from reply"
```

## Starting go-client

Go to the `dubbo/rpc/grpc/go-client` path and execute the command `go run cmd/client.go`:

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51e69e37b8e041a6b4e4a7cb10dd9e75~tplv-k3u1fbpfcp-watermark.image?)

When you see the log output as shown in the figure above, it indicates that the client has started successfully, successfully called service-b, and got the return value `{Id:1 Name:Test Department StaffTotal:10}`.

Let's look at the code implementation of go-client:

```go
import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"dubbo.apache.org/dubbo-go/v3/common/constant"
	"dubbo.apache.org/dubbo-go/v3/common/logger"
	"dubbo.apache.org/dubbo-go/v3/config"
	_ "dubbo.apache.org/dubbo-go/v3/imports"

	_ "github.com/dubbogo/gost/log/logrus"

	"github.com/unionj-cloud/go-doudou-tutorials/dubbodemo/dubbo/rpc/grpc/service-b"
)

type Client struct {
	ServiceBClientImpl service_b.ServiceBClientImpl
}

func main() {
	config.SetConsumerService(&Client{})
	if err := config.Load(); err != nil {
		panic(err)
	}

	logger.Info("start to test dubbo")
	client := &Client{}
	for i := 0; i < 10; i++ {
		deptDto, err := client.ServiceBClientImpl.GetDeptById(context.TODO(), 1)
		if err != nil {
			fmt.Printf("error: %v", err)
			return
		}
		fmt.Printf("response result: %v\n", deptDto)
		time.Sleep(1 * time.Second)
	}

	initSignal()
}

func initSignal() {
	signals := make(chan os.Signal, 1)
	// It is not possible to block SIGKILL or syscall.SIGSTOP
	signal.Notify(signals, os.Interrupt, syscall.SIGHUP, syscall.SIGQUIT, syscall.SIGTERM)
	for {
		sig := <-signals
		logger.Infof("get signal %s", sig.String())
		switch sig {
		case syscall.SIGHUP:
			// reload()
		default:
			time.AfterFunc(time.Duration(int(3e9)), func() {
				logger.Warnf("app exit now")
				os.Exit(0)
			})

			// The program exits normally or timeout forcibly exits.
			fmt.Println("provider app exit now")
			return
		}
	}
}
```

Looking at the ServiceBClientImpl interface definition and the Dubbo configuration file, we can understand how a Dubbo client calls a go-doudou service:

```go
// dubbo/rpc/grpc/service-b/service.go
type ServiceBClientImpl struct {
	GetDeptById func(ctx context.Context, id int32) (*DeptDto, error) `dubbo:"GetDeptByIdRpc"`
}

func (u *ServiceBClientImpl) Reference() string {
	return "ServiceBClientImpl"
}
```

```yaml
# dubbo/rpc/grpc/go-client/conf/dubbogo.yml
dubbo:
  registries:
    demoZK:
      protocol: zookeeper
      address: localhost:2181,localhost:2182,localhost:2183
  consumer:
    references:
      ServiceBClientImpl:
        protocol: grpc
        interface: cloud.unionj.ServiceB_grpc
        group: group
        version: v2.2.2
        retries: 3
        cluster: failover
```

From these configuration files, we can see that dubbo-go is configured to call the cloud.unionj.ServiceB_grpc service registered in ZooKeeper, with group name "group" and version "v2.2.2". The reference field in the ServiceBClientImpl interface corresponds to the RPC service name, and the `dubbo:"GetDeptByIdRpc"` annotation maps the local method name GetDeptById to the remote RPC method name GetDeptByIdRpc.

## Summary

From the demo we've analyzed, we can see:

1. go-doudou can call dubbo-go services through gRPC.
2. dubbo-go can also call go-doudou services through gRPC.
3. The implementation is very simple, and the interoperability based on ZooKeeper is complete, using the gRPC protocol as a bridge.

This case verifies that go-doudou, as a new-generation Go microservice framework, can seamlessly integrate with the traditional dubbo ecosystem, supporting hybrid deployments and gradual migrations.

For more detailed information, please refer to the example code repository: [go-doudou-tutorials/dubbodemo](https://github.com/unionj-cloud/go-doudou-tutorials/tree/master/dubbodemo)