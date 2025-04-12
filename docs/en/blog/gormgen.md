---
sidebar: auto
---

# A Powerful Go Backend Tool: One-Click Generation of RESTful and gRPC Microservices from Databases

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f500ce4a07c64f59900b5c25d783a486~tplv-k3u1fbpfcp-watermark.image?)
Photo by [NEOM](https://unsplash.com/@neom?utm_source=unsplash\&utm_medium=referral\&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/0SUho_B0nus?utm_source=unsplash\&utm_medium=referral\&utm_content=creditCopyText)

In most backend development careers, daily work primarily revolves around writing database CRUD interfaces for business needs. Based on our practical business development experience, we've added a new feature to go-doudou v2.1.4: generating RESTful and gRPC services directly from databases using gorm. This helps Go developers implement requirements faster and better, enabling quick launches. This feature currently supports the following 6 types of interfaces:

```go
Post{{.ModelStructName}}(ctx context.Context, body dto.{{.ModelStructName}}) (data {{.PriKeyType}}, err error)

Post{{.ModelStructName}}s(ctx context.Context, body []dto.{{.ModelStructName}}) (data []{{.PriKeyType}}, err error)

Get{{.ModelStructName}}_Id(ctx context.Context, id {{.PriKeyType}}) (data dto.{{.ModelStructName}}, err error)

Put{{.ModelStructName}}(ctx context.Context, body dto.{{.ModelStructName}}) error

Delete{{.ModelStructName}}_Id(ctx context.Context, id {{.PriKeyType}}) error

Get{{.ModelStructName}}s(ctx context.Context, parameter dto.Parameter) (data dto.Page, err error)
```

* `PostXXX`: Single data addition interface
* `PostXXXs`: Batch data addition interface
* `GetXXX_Id`: Query single data by primary key ID interface
* `PutXXX`: Update single data by primary key ID interface
* `DeleteXXX_Id`: Delete single data by primary key ID interface
* `GetXXXs`: Pagination query interface

More common interfaces will be added based on actual needs in the future. Below is an example of code generation command and an explanation of the command line parameters:

```shell
go-doudou svc init myproject --db_driver mysql --db_dsn "root:1234@tcp(127.0.0.1:3306)/tutorial?charset=utf8mb4&parseTime=True&loc=Local" --db_soft delete_at --db_grpc
```

* `go-doudou svc init myproject`: This command initializes or incrementally updates the myproject project. If the myproject folder doesn't exist, it will be created automatically. If there's no folder path or project name after `go-doudou svc init`, it will default to generating code in the current folder. This command serves dual purposes: it can initialize and generate a full set of code, or it can be used for incremental code generation during subsequent project iterations.
* `--db_driver`: Sets the database driver, supporting parameters include mysql, postgres, sqlite, sqlserver, and tidb.
* `--db_dsn`: Sets the database connection address, note that double quotes are needed before and after.
* `--db_soft`: Sets the field that indicates soft deletion, the default value is `deleted_at`. The gorm soft deletion mechanism will be used only if the database table structure has the field specified by `--db_soft`.
* `--db_grpc`: Sets whether to generate a full set of gRPC service code, the default value is `false`.
* There's another parameter `--db_table_prefix`, mainly used for PostgreSQL to specify the schema name.

The `go-doudou svc init` command has other features and command line parameters. If interested, you can execute the command `go-doudou svc init --help` to view them.

Our typical workflow for using this feature is to first create models through database GUI tools like Navicat, then execute the go-doudou command to generate a full set of code. As requirements increase and the project continues to iterate with new tables, we execute the go-doudou command again for incremental code generation. This feature will not modify or overwrite any manually customized interfaces and code - it's completely incremental generation, so you can use it with confidence! Let's try it out below!

We'll use PostgreSQL as an example. First, create a database called testpg with `create database testpg;`, then import the following DDL statements:

```sql
-- Create "address" table
CREATE TABLE "address" ("id" bigserial NOT NULL, "uid" bigint NULL DEFAULT 0, "phone" character varying(30) NULL DEFAULT '', "name" character varying(30) NULL DEFAULT '', "zipcode" character varying(20) NULL DEFAULT '', "address" character varying(250) NULL DEFAULT '', "default_address" bigint NULL DEFAULT 0, "add_time" bigint NULL DEFAULT 0, PRIMARY KEY ("id"));
-- Set comment to table: "address"
COMMENT ON TABLE "address" IS '地址信息';
-- Set comment to column: "id" on table: "address"
COMMENT ON COLUMN "address" ."id" IS '主键';
-- Set comment to column: "uid" on table: "address"
COMMENT ON COLUMN "address" ."uid" IS '用户编号';
-- Set comment to column: "phone" on table: "address"
COMMENT ON COLUMN "address" ."phone" IS '用户手机';
-- Set comment to column: "name" on table: "address"
COMMENT ON COLUMN "address" ."name" IS '用户名字';
-- Set comment to column: "zipcode" on table: "address"
COMMENT ON COLUMN "address" ."zipcode" IS '邮政编码';
-- Set comment to column: "address" on table: "address"
COMMENT ON COLUMN "address" ."address" IS '地址';
-- Set comment to column: "default_address" on table: "address"
COMMENT ON COLUMN "address" ."default_address" IS '默认地址';
-- Set comment to column: "add_time" on table: "address"
COMMENT ON COLUMN "address" ."add_time" IS '添加时间';
```

[Note: The original SQL contains many more tables. For brevity, we've only shown a portion here.]

Then we can execute the go-doudou command to generate code:

```shell
go-doudou svc init testpg --db_driver postgres --db_dsn "host=localhost user=corteza password=corteza dbname=testpg port=5432 sslmode=disable TimeZone=Asia/Shanghai" --db_soft deleted_at --db_grpc
```

Run `go run cmd/main.go` to start the service. The code includes an OpenAPI 3.0 interface description file testpg_openapi3.json, which can be directly imported into Postman for API testing.

## Pagination Query Interface

It's important to explain the pagination query interfaces in detail. Taking the `GetUsers(ctx context.Context, parameter dto.Parameter) (data dto.Page, err error)` interface method as an example, it will generate a "get /users" pagination query interface. After importing into Postman, we will see the following interface:

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e518d99d2f934e229029613551baa937~tplv-k3u1fbpfcp-watermark.image?)

The default query parameter names filled in there are incorrect. You need to modify them according to the following table to make the API work:

| Default Postman Parameter Name | Correct Parameter Name | Parameter Description |
| --- | --- | --- |
| page | parameter[page] | Page number, pass 0 for the first page | 
| size | parameter[size] | Number of items per page | 
| sort | parameter[sort] | Sorting, multiple sort conditions concatenated with English commas, single sort condition is ascending by default, if the first character is "-", it's descending | 
| order | parameter[order] | Ascending/descending, ascending by default, can be omitted. If "DESC" is passed, it's descending. Usually just using the sort parameter is sufficient | 
| fields | parameter[fields] | Specify which fields to return, note that you need to pass the field names in the database, multiple fields concatenated with English commas | 
| filters | parameter[filters] | Filter conditions, supports multi-dimensional arrays for nested filtering, explained in detail below | 

The effect of calling the pagination query interface is shown below:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/686d8ca28ced41028cb5ea2ed2d76569~tplv-k3u1fbpfcp-watermark.image?)

For convenient debugging, here's the curl command:

```shell
curl --location --globoff 'http://localhost:6060/users?parameter[page]=0&parameter[size]=10&parameter[sort]=-phone%2Cid&parameter[fields]=id%2Cphone%2Cemail&parameter[filters][0]=email&parameter[filters][1]=like&parameter[filters][2]=com' \
--header 'Accept: application/json'
```

The filter conditions need to be passed as a one-dimensional or multi-dimensional array. An array can contain at most three elements: the first is the database field name, the second is the operator, and the third is the condition value, which can be an array.

```js
// Syntax:
["column_name", "operator", "values"]

// Example:
["age", "=", 20]
// Shorthand:
["age", 20]

// Generated SQL:
// WHERE age = 20
```

An array containing only one element represents a logical operator:

```js
// Example
[["age", "=", 20],["or"],["age", "=", 25]]

// Generated SQL:
// WHERE age = 20 OR age = 25
```

The condition value can be an array:

```js
["age", "between", [20, 30] ]
// Generated SQL:
// WHERE age BETWEEN 20 AND 30

["age", "not in", [20, 21, 22, 23, 24, 25, 26, 26] ]
// Generated SQL:
// WHERE age NOT IN(20, 21, 22, 23, 24, 25, 26, 26)
```

Nested filter conditions are supported:

```js
[
    [
        ["age", ">", 20],
        ["and"]
        ["age", "<", 30]
    ],
    ["and"],
    ["name", "like", "john"],
    ["and"],
    ["name", "like", "doe"]
]
// Generated SQL:
// WHERE ( (age > 20 AND age < 20) and name like '%john%' and name like '%doe%' )
```

If you need to pass a `null` value, you can pass `"null"` or lowercase `null`:

```js
// Incorrect
[ "age", "is", NULL ]
[ "age", "is", Null ]
[ "age", "is not", NULL ]
[ "age", "is not", Null ]

// Correct
[ "age", "is", "NULL" ]
[ "age", "is", "Null" ]
[ "age", "is", "null" ]
[ "age", "is", null ]
[ "age", null ]
[ "age", "is not", "NULL" ]
[ "age", "is not", "Null" ]
[ "age", "is not", "null" ]
[ "age", "is not", null ]
```

## Table Relationships

We should also explain table relationship situations. This feature currently doesn't support generating code for table relationships, but we provide transaction support based on gorm. Developers can manually implement related logic, such as inserting parent-child table data in a database transaction. In the generated svcimpl.go file, the interface implementation structure has a `clone` method:

```go
func (receiver XXXImpl) clone(q *query.Query) *TestpgImpl {
   receiver.q = q
   return &receiver
}
```

You can pass a `*query.Query` parameter that encapsulates `*sql.Tx` to clone an interface implementation structure instance for database transaction operations:

```go
func (receiver *XXXImpl) TAuthorPosts(ctx context.Context, body dto.SaveAuthorReqDTO) (err error) {
   return errors.WithStack(receiver.q.Transaction(func(tx *query.Query) error {
      instance := receiver.clone(tx)
      _, err1 := instance.PostTAuthor(ctx, body.TAuthor)
      if err1 != nil {
         return err1
      }
      _, err1 = instance.PostTPosts(ctx, body.Posts)
      if err1 != nil {
         return err1
      }
      return nil
   }))
}
```

## Other Optimizations

This feature is based on the gorm/gen library with several optimizations:
1. For PostgreSQL, support for passing `--db_table_prefix` parameter to specify the schema
2. For PostgreSQL, solving the issue of default values with `::character varying` strings
3. Support for passing `--db_soft` parameter to customize the soft delete field name in the database

This is an introduction to the functionality of go-doudou for generating complete service code from a database with one click. 