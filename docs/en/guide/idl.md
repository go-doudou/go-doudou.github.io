# Define API

go-doudou provides an intuitive way to define APIs. Instead of learning interface description languages like OpenAPI or Protobuf, you can simply define Go language interfaces. go-doudou will automatically parse your interface definitions and generate the necessary code for both REST and gRPC services.

## Interface Definition

When you initialize a project with go-doudou, a `svc.go` file is generated. This file contains a placeholder interface definition like this:

```go
package service

import (
	"context"
)

//go:generate go-doudou svc http -c
//go:generate go-doudou svc grpc

type Helloworld interface {
	// Define your service methods here
}
```

To define your APIs, you add methods to this interface. Each method will be transformed into an HTTP endpoint or a gRPC service method.

## Method Signature Rules

When defining methods in your service interface, follow these rules:

1. **First parameter**: Always include a `context.Context` parameter first
2. **Input parameters**: Can be of any type, including structs, primitive types, slices, maps, etc.
3. **Return values**: Must include an `error` as the last return value, along with optional data return values

### Basic Method Examples

```go
// Simple method with string parameter and string return
func (receiver *HelloworldImpl) Greeting(ctx context.Context, greeting string) (data string, err error)

// Method with multiple parameters
func (receiver *HelloworldImpl) Calculate(ctx context.Context, a int, b int, op string) (result int, err error)

// Method with struct parameter
func (receiver *HelloworldImpl) CreateUser(ctx context.Context, user vo.User) (id int, err error)

// Method returning a struct
func (receiver *HelloworldImpl) GetUserById(ctx context.Context, id int) (user vo.User, err error)

// Method returning a slice
func (receiver *HelloworldImpl) ListUsers(ctx context.Context) (users []vo.User, err error)
```

## Parameter Mapping

go-doudou automatically maps your method parameters to HTTP/gRPC parameters based on the following rules:

### For HTTP (REST)

- Primitive types (string, int, bool, etc.) are mapped to query parameters for GET requests and form fields for POST/PUT requests
- Struct types are mapped to JSON request bodies
- Context is automatically populated with the HTTP request context

### For gRPC

- All parameters are mapped to fields in a request message
- The context is passed through the gRPC context mechanism

## HTTP Method Mapping

go-doudou follows these conventions to determine the HTTP method for each endpoint:

- Methods starting with `Get` are mapped to GET requests
- Methods starting with `List` are mapped to GET requests
- Methods starting with `Create` are mapped to POST requests
- Methods starting with `Update` are mapped to PUT requests
- Methods starting with `Delete` are mapped to DELETE requests
- All other methods are mapped to POST requests by default

## Route Path Generation

The route path for each endpoint is generated from the method name according to these rules:

- Method names are converted to snake_case
- If the name starts with a verb (Get, List, Create, Update, Delete), the verb is removed before conversion
- For example, `GetUserById` becomes `/user_by_id` and `CreateUser` becomes `/user`

You can customize the route pattern generation strategy using the `-r, --routePattern` flag:
- `0` (default): Split the method name by camel case and convert to snake_case
- `1`: Just lowercase the method name without splitting

## Annotations

go-doudou supports annotations through Go comments. These annotations provide additional metadata for method handling:

### REST Annotations

```go
// @handler(formRequest)
// Indicates the method should handle form data instead of JSON

// @handler(streamResponse)
// Indicates the method should stream the response

// @path(/custom/path/:param)
// Sets a custom path for the endpoint

// @middleware(auth)
// Applies a specific middleware to this endpoint only
```

### gRPC Annotations

```go
// @grpc
// Marks a method to be exposed as a gRPC service (when using --annotated_only flag)
```

## Example: Complete Service Interface

Here's a complete example of a service interface with various method types:

```go
package service

import (
	"context"
	"github.com/example/myservice/vo"
)

//go:generate go-doudou svc http -c
//go:generate go-doudou svc grpc

type UserService interface {
	// Get a user by ID
	// @path(/users/:id)
	GetUserById(ctx context.Context, id int) (user vo.User, err error)
	
	// List users with optional filters
	ListUsers(ctx context.Context, page int, size int, name string) (users []vo.User, total int, err error)
	
	// Create a new user
	// @middleware(validateUser)
	CreateUser(ctx context.Context, user vo.CreateUserRequest) (id int, err error)
	
	// Update a user
	// @path(/users/:id)
	UpdateUser(ctx context.Context, id int, user vo.UpdateUserRequest) (success bool, err error)
	
	// Delete a user
	// @path(/users/:id)
	DeleteUser(ctx context.Context, id int) (success bool, err error)
	
	// Upload a user avatar
	// @handler(formRequest)
	// @path(/users/:id/avatar)
	UploadAvatar(ctx context.Context, id int, file []byte) (url string, err error)
	
	// Download a report
	// @handler(streamResponse)
	// @path(/reports/:type)
	DownloadReport(ctx context.Context, reportType string) (data []byte, err error)
}
```

## Working with View Objects (VO)

The `vo` package is used to define request and response structures for your API:

```go
package vo

// User represents a user in the system
type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstName,omitempty"`
	LastName  string    `json:"lastName,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// CreateUserRequest represents the data needed to create a user
type CreateUserRequest struct {
	Username  string `json:"username" validate:"required,min=3,max=50"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
}

// UpdateUserRequest represents the data needed to update a user
type UpdateUserRequest struct {
	Email     string `json:"email,omitempty" validate:"omitempty,email"`
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
}
```

## Code Generation

After defining your service interface, run the following commands to generate the necessary code:

```shell
# Generate REST API code
go-doudou svc http -c

# Generate gRPC service code
go-doudou svc grpc
```

This will create:
- HTTP handlers and client code
- OpenAPI 3.0 documentation
- Protocol Buffers definitions
- gRPC server and client stubs
- Service implementation stubs with mock data

## Advanced Topics

### Pagination

For methods that return lists of items, you can implement pagination by including `page` and `size` parameters:

```go
// ListUsers returns a paginated list of users
func (receiver *UserServiceImpl) ListUsers(ctx context.Context, page int, size int) (users []vo.User, total int, err error)
```

### Validation

go-doudou integrates with validation libraries. You can add validation tags to your struct fields:

```go
type CreateUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}
```

### Custom Error Handling

You can define custom error types and use them in your service implementations:

```go
// Define custom error types
var (
	ErrUserNotFound = errors.New("user not found")
	ErrInvalidInput = errors.New("invalid input")
)

// Use them in implementations
func (receiver *UserServiceImpl) GetUserById(ctx context.Context, id int) (user vo.User, err error) {
	// Logic to fetch user
	if userNotFound {
		return vo.User{}, ErrUserNotFound
	}
	return user, nil
}
```

## Best Practices

1. **Method Naming**: Use consistent method names that clearly describe the action
2. **Parameter Types**: Use well-defined struct types for complex parameters instead of many primitive parameters
3. **Error Handling**: Return meaningful error types that clients can interpret
4. **Documentation**: Document your interface methods with comments
5. **Keep It Simple**: Design your API to be intuitive and easy to use

By following these guidelines and using go-doudou's API definition approach, you can quickly design and implement clean, consistent APIs for both REST and gRPC services.

# Interface Definition

`go-doudou` doesn't reinvent the wheel but adopts Go language interface types as the Interface Description Language (IDL). Users can define methods in Go language interface types, allowing go-doudou to generate corresponding interface code.

## Advantages
- Easy to learn and use for go-doudou users
- For go-doudou developers, the Go language compiler helps with syntax checking, and IDEs provide syntax highlighting, saving the work of developing IDL and IDE plugins

## Disadvantages or Limitations
Using interface methods as an interface description language has some limitations.

1. Only supports generating `GET`, `POST`, `PUT`, `DELETE` interfaces. The default is a `POST` interface. You can add the `Get`/`Post`/`Put`/`Delete` prefix to the method name to specify the http request method of the interface.
2. The first parameter in the method signature must be `context.Context`.
3. The parameters and return values in the method signature only support most common Go language [built-in types](https://golang.org/pkg/builtin/), dictionary types with strings as keys, custom struct types in the `vo` package, and their corresponding slice and pointer types.
   When generating code and the `OpenAPI 3.0` interface documentation, go-doudou will only scan structures in the `vo` package. If a struct type defined outside the `vo` package appears in the method signature, go-doudou doesn't know what fields it contains.
4. As a special case, you can use the `v3.FileModel` type as an input parameter to upload files, and the `*os.File` type as a return value to download files.
5. Alias types as struct fields are not supported.
6. Function types, channel types, and anonymous struct types as input parameters and return values in method signatures are not supported.
7. `go-doudou` treats pointer-type input parameters as optional, while non-pointer type input parameters are required.
8. For `OpenAPI 3.0` interface documentation generation:
	- Request headers, response headers, global parameters, and permission verification are not supported. You can write these contents as Go language comments above the interface declaration or above the interface method signature. These comments will be generated as the value of `description` in the interface documentation and displayed in the corresponding position on the online interface documentation page.
	- [Tag Object](https://spec.openapis.org/oas/v3.0.3#tag-object), [Callback Object](https://spec.openapis.org/oas/v3.0.3#callback-object), [Discriminator Object](https://spec.openapis.org/oas/v3.0.3#discriminator-object), [XML Object](https://spec.openapis.org/oas/v3.0.3#xml-object), [Security Scheme Object](https://spec.openapis.org/oas/v3.0.3#security-scheme-object), [OAuth Flows Object](https://spec.openapis.org/oas/v3.0.3#oauth-flows-object), [OAuth Flow Object](https://spec.openapis.org/oas/v3.0.3#oauth-flow-object), [Security Requirement Object ](https://spec.openapis.org/oas/v3.0.3#security-requirement-object) are not supported. You may not use these APIs, but I need to mention them here.
9. For Protobuf, `oneof` is not supported for now.
10. When defining stream type input and output parameters, the parameter name must have `stream` as a prefix, for example: `stream1`, `stream2`, `streamReq`, `streamResp`, etc.

## Enums

go-doudou has added support for enums since v1.0.5.

### Definition Method

1. Define an alias type of a basic type as an enum type in the `vo` package, and implement the `IEnum` interface in the `github.com/unionj-cloud/go-doudou/v2/toolkit/openapi/v3` package

```go
type IEnum interface {
	StringSetter(value string)
	StringGetter() string
	UnmarshalJSON(bytes []byte) error
	MarshalJSON() ([]byte, error)
}
```

2. Define several constants of this enum type

### Example Code

For complete demo code, please visit [go-doudou-tutorials/enumdemo](https://github.com/unionj-cloud/go-doudou-tutorials/tree/master/enumdemo)

```go
package vo

import "encoding/json"

//go:generate go-doudou name --file $GOFILE -o

type KeyboardLayout int

const (
	UNKNOWN KeyboardLayout = iota
	QWERTZ
	AZERTY
	QWERTY
)

func (k *KeyboardLayout) StringSetter(value string) {
	switch value {
	case "UNKNOWN":
		*k = UNKNOWN
	case "QWERTY":
		*k = QWERTY
	case "QWERTZ":
		*k = QWERTZ
	case "AZERTY":
		*k = AZERTY
	default:
		*k = UNKNOWN
	}
}

func (k *KeyboardLayout) StringGetter() string {
	switch *k {
	case UNKNOWN:
		return "UNKNOWN"
	case QWERTY:
		return "QWERTY"
	case QWERTZ:
		return "QWERTZ"
	case AZERTY:
		return "AZERTY"
	default:
		return "UNKNOWN"
	}
}

func (k *KeyboardLayout) UnmarshalJSON(bytes []byte) error {
	var _k string
	err := json.Unmarshal(bytes, &_k)
	if err != nil {
		return err
	}
	k.StringSetter(_k)
	return nil
}

func (k KeyboardLayout) MarshalJSON() ([]byte, error) {
	return json.Marshal(k.StringGetter())
}

type Keyboard struct {
	Layout  KeyboardLayout `json:"layout,omitempty"`
	Backlit bool            `json:"backlit,omitempty"`
}
```

## Annotations

go-doudou has added support for annotations since v1.1.7.

Developers can add custom annotations in the Go language documentation comments above the interface methods to add metadata to the interface, making it convenient to read these data when writing custom middleware to implement unified business processing.

### Definition Method

Definition format: `@AnnotationName(parameter1,parameter2,parameter3...)`.

Definition rules:
1. Annotations can be written anywhere in the Go language documentation comments, can have text descriptions before and after, and don't need spaces
2. Annotations must start with the `@` symbol, and the annotation name cannot contain any white space characters
3. The content inside the English parentheses `()` will be parsed as string slice type parameters, multiple parameters are separated by English commas `,`, you can define no parameters, but the English parentheses cannot be omitted

Examples: `@role(admin)`, `@permission(create,update,del)`, `@inner()`

### Generated Code

go-doudou parses the annotations defined by developers and generates a package-level instance `RouteAnnotationStore` of type `github.com/unionj-cloud/go-doudou/v2/framework.AnnotationStore` in the `transport/httpsrv/handler.go` file. Developers can read annotations through `httpsrv.RouteAnnotationStore` in middleware to implement custom business logic.

Below is an example of the generated code:

```go
// AnnotationStore type is actually an alias for map[string][]Annotation
// The key is the route name
var RouteAnnotationStore = framework.AnnotationStore{
	"GetUser": {
		{
			Name: "@role",
			Params: []string{
				"USER",
				"ADMIN",
			},
		},
	},
	"GetAdmin": {
		{
			Name: "@role",
			Params: []string{
				"ADMIN",
			},
		},
	},
}
```

If you are developing a gRPC service, a package-level instance `MethodAnnotationStore` of type `github.com/unionj-cloud/go-doudou/v2/framework.AnnotationStore` will be generated in the `transport/grpc/annotation.go` file. Developers can read annotations through `grpc.MethodAnnotationStore` in custom interceptors to implement custom business logic.

Below is an example of the generated code:

```go
/**
* Generated by go-doudou v2.0.8.
* Don't edit!
 */
package grpc

import (
	"github.com/unionj-cloud/go-doudou/v2/framework"
)

var MethodAnnotationStore = framework.AnnotationStore{
	"GetUserRpc": {
		{
			Name: "@role",
			Params: []string{
				"USER",
				"ADMIN",
			},
		},
	},
	"GetAdminRpc": {
		{
			Name: "@role",
			Params: []string{
				"ADMIN",
			},
		},
	},
}
```

### Usage in REST Services

Developers can get the route name through the following two lines of code in custom middleware:

```go
paramsFromCtx := httprouter.ParamsFromContext(r.Context())
routeName := paramsFromCtx.MatchedRouteName()
```

Then call the `GetParams` method of `httpsrv.RouteAnnotationStore` to get the annotation information of the current route.

Below is example code:

```go
func Auth(client authClient.IAuthClient) func(inner http.Handler) http.Handler {
	return func(inner http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			paramsFromCtx := httprouter.ParamsFromContext(r.Context())
			routeName := paramsFromCtx.MatchedRouteName()
			if !httpsrv.RouteAnnotationStore.HasAnnotation(routeName, "@role") {
				inner.ServeHTTP(w, r)
				return
			}
			authHeader := r.Header.Get("Authorization")
			baseToken := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))

			if stringutils.IsEmpty(baseToken) {
				if err := r.ParseForm(); err != nil {
					w.WriteHeader(401)
					w.Write([]byte("Unauthorised\n"))
					return
				}
				baseToken = r.FormValue("t")
			}

			if stringutils.IsEmpty(baseToken) {
				w.WriteHeader(401)
				w.Write([]byte("Unauthorised\n"))
				return
			}

			if stringutils.IsNotEmpty(baseToken) {
				var (
					err    error
					userVo vo.UserVo
				)
				if _, userVo, err = client.GetUserByToken(r.Context(), nil, baseToken); err != nil {
					w.WriteHeader(401)
					w.Write([]byte("Unauthorised\n"))
					return
				}
				role := service.USER
				if userVo.SuperAdmin {
					role = service.SUPER_ADMIN
				}
				params := httpsrv.RouteAnnotationStore.GetParams(routeName, "@role")
				if !sliceutils.StringContains(params, role.StringGetter()) {
					w.WriteHeader(403)
					w.Write([]byte("Access denied\n"))
					return
				}
				inner.ServeHTTP(w, r.WithContext(service.NewLoginUserContext(r.Context(), userVo)))
			} else {
				inner.ServeHTTP(w, r)
			}
		})
	}
}
```

### Usage in gRPC Services

First, get the method name through `method := fullMethod[strings.LastIndex(fullMethod, "/")+1:]`, then check if the method has the annotation that the interceptor cares about through `MethodAnnotationStore.HasAnnotation`. If not, let it pass, otherwise continue to execute the business logic. Later, you can get the annotation parameters through `MethodAnnotationStore.GetParams` to implement custom business logic.

```go
func (interceptor *AuthInterceptor) Authorize(ctx context.Context, fullMethod string) (context.Context, error) {
	method := fullMethod[strings.LastIndex(fullMethod, "/")+1:]
	if !MethodAnnotationStore.HasAnnotation(method, "@role") {
		return ctx, nil
	}
	token, err := grpc_auth.AuthFromMD(ctx, "Basic")
	if err != nil {
		return ctx, err
	}
	user, pass, ok := parseToken(token)
	if !ok {
		return ctx, status.Error(codes.Unauthenticated, "Provide user name and password")
	}
	role, exists := interceptor.userStore[vo.Auth{user, pass}]
	if !exists {
		return ctx, status.Error(codes.Unauthenticated, "Provide user name and password")
	}
	params := MethodAnnotationStore.GetParams(method, "@role")
	if !sliceutils.StringContains(params, role.StringGetter()) {
		return ctx, status.Error(codes.PermissionDenied, "Access denied")
	}
	return ctx, nil
}
```

## gRPC

All the rules described above apply to defining gRPC services. Additionally, there are two more points to note:

- `oneof` in `Protobuf v3` is not supported for now
- When defining stream type input and output parameters, the parameter name must have `stream` as a prefix, for example: `stream1`, `stream2`, `streamReq`, `streamResp`, etc.

## More Examples
```go
package service

import (
	"context"
	v3 "github.com/unionj-cloud/go-doudou/v2/toolkit/openapi/v3"
	"os"
	"usersvc/vo"
)

// Usersvc is a user management service
// You need to set the Authentication request header with a bearer token parameter to access protected interfaces, such as user information query interface, user pagination query interface, and avatar upload interface.
// You can add overall service documentation here
type Usersvc interface {
	// PageUsers is a user pagination query interface
	// Demonstrates how to define a post request with application/json type interface
	// @role(user)
	PageUsers(ctx context.Context,
		// pagination parameter
		query vo.PageQuery) (
		// pagination result
		data vo.PageRet,
		// error
		err error)

	// GetUser is a user detail interface
	// Demonstrates how to define a get request with query string parameters
	GetUser(ctx context.Context,
		// user id
		userId int) (
		// user detail
		data vo.UserVo,
		// error
		err error)

	// PublicSignUp is a user registration interface
	// Demonstrates how to define a post request with application/x-www-form-urlencoded type interface
	PublicSignUp(ctx context.Context,
		// username
		// @validate(gt=0,lte=60)
		username string,
		// password
		// @validate(gt=0,lte=60)
		password string,
		// image code, optional as it is pointer type
		code *string,
	) (
		// return OK if success
		data string, err error)

	// PublicLogIn is a user login interface
	// Demonstrates how to define a post request with application/x-www-form-urlencoded type interface
	PublicLogIn(ctx context.Context,
		// username
		username string,
		// password
		password string) (
		// token
		data string, err error)

	// UploadAvatar is an avatar upload interface
	// Demonstrates how to define a file upload interface
	// Note: There must be at least one input parameter of type v3.FileModel or []v3.FileModel
	UploadAvatar(ctx context.Context,
		// user avatar
		avatar v3.FileModel, id int) (
		// return OK if success
		data string, err error)

	// GetPublicDownloadAvatar is an avatar download interface
	// Demonstrates how to define a file download interface
	// Note: There must be exactly one return parameter of type *os.File
	GetPublicDownloadAvatar(ctx context.Context,
		// user id
		userId int) (
		// avatar file
		data *os.File, err error)

	// BiStream demonstrates how to define a bidirectional streaming RPC
	BiStream(ctx context.Context, stream vo.Order) (stream1 vo.Page, err error)

	// ClientStream demonstrates how to define a client streaming RPC
	ClientStream(ctx context.Context, stream vo.Order) (data vo.Page, err error)

	// ServerStream demonstrates how to define a server streaming RPC
	ServerStream(ctx context.Context, payload vo.Order) (stream vo.Page, err error)
}
``` 