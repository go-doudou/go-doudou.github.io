# Cli and Code Generation

`go-doudou ddl` is table structure migration and dao layer code generation cli, supporting bidirection migration that is from go structs code to table structures and from table structures to go structs code.

## Features

- Create/Update table from go struct
- Create/Update go struct from table
- Generate dao layer code with basic crud operations
- Support transaction in dao layer
- Support index update
- Support foreign key

## Flags

```shell
➜  ~ go-doudou ddl -h
migration tool between database table structure and golang struct

Usage:
  go-doudou ddl [flags]

Flags:
  -d, --dao             If true, generate dao code.
      --df string       Name of dao folder. (default "dao")
      --domain string   Path of domain folder. (default "domain")
      --env string      Path of database connection config .env file (default ".env")
  -h, --help            help for ddl
      --pre string      Table name prefix. e.g.: prefix biz_ for biz_product.
  -r, --reverse         If true, generate domain code from database. If false, update or create database tables from domain code.
```

## Table Structure Migration

Command example for go structs code to table structures: `go-doudou ddl --pre=ddl_`, `--pre` flag is used to set table name prefix.

Command example for table structures to go structs code: `go-doudou ddl --reverse --pre=ddl_`, must add `--reverse` or `-r` flag.

Let's see some examples about tags.

### Example
```go
package domain

import "time"

type Base struct {
	CreateAt *time.Time `dd:"default:CURRENT_TIMESTAMP"`
	UpdateAt *time.Time `dd:"default:CURRENT_TIMESTAMP;extra:ON UPDATE CURRENT_TIMESTAMP"`
	DeleteAt *time.Time
}
```
```go
package domain

//dd:table
type Book struct {
  ID          int `dd:"pk;auto"`
  UserId      int `dd:"type:int"`
  PublisherId int	`dd:"fk:ddl_publisher,id,fk_publisher,ON DELETE CASCADE ON UPDATE NO ACTION"`

  Base
}
```
```go
package domain

//dd:table
type Publisher struct {
  ID   int `dd:"pk;auto"`
  Name string

  Base
}
```
```go
package domain

import "time"

//dd:table
type User struct {
  ID         int    `dd:"pk;auto"`
  Name       string `dd:"index:name_phone_idx,2;default:'jack'"`
  Phone      string `dd:"index:name_phone_idx,1;default:'13552053960';extra:comment '手机号'"`
  Age        int    `dd:"unsigned"`
  No         int    `dd:"type:int;unique"`
  UniqueCol  int    `dd:"type:int;unique:unique_col_idx,1"`
  UniqueCol2 int    `dd:"type:int;unique:unique_col_idx,2"`
  School     string `dd:"null;default:'harvard';extra:comment '学校'"`
  IsStudent  bool
  ArriveAt *time.Time `dd:"type:datetime;extra:comment '到货时间'"`
  Status   int8       `dd:"type:tinyint(4);extra:comment '0进行中
1完结
2取消'"`

  Base
}
```

### pk

Primary key

### auto

Autoincrement

### type

Column type. Not required. If you don't set this tag explicitly, default rule is as below table

| Go Type（including pointer type） | Column Type  |
| :----------------: | :----------: |
| int, int16, int32  |     int      |
|       int64        |    bigint    |
|      float32       |    float     |
|      float64       |    double    |
|       string       | varchar(255) |
|     bool, int8     |   tinyint    |
|     time.Time      |   datetime   |
|  decimal.Decimal   | decimal(6,2) |

### default

Default value. If value was database built-in function or expression made by built-in functions, not need single quote marks. If value was literal value, it should be quoted by single quote marks.

### extra

Extra definition. Example: "on update CURRENT_TIMESTAMP"，"comment 'cellphone number'"  
**Note：don't use ; and : in comment**

### index

- Format: "index:Name,Order,Sort" or "index"
- `Name`: index name. string. If multiple fields use the same index name, the index will be created as composite index. Not required. Default index name is column name + _idx
- `Order`:int
- `Sort`: string. Only accept `asc` and `desc`. Not required. Default is asc

### unique

Unique index. Usage is the same as index.

### null

Nullable. **Note: if the field is a pointer, null is default.**

### unsigned

Unsigned

### fk

- Format："fk:ReferenceTableName,ReferenceTablePrimaryKey,Constraint,Action"  
- ReferenceTableName: reference table name
- ReferenceTablePrimaryKey: reference table primary key such as `id`
- Constraint: foreign key constraint such as `fk_publisher`
- Action: for example: `ON DELETE CASCADE ON UPDATE NO ACTION`

## Dao layer code

You need to add `--dao` flag to generate dao layer code, for example: `go-doudou ddl --dao --pre=ddl_`

### Single Table CRUD

```go
package dao

import (
	"context"
	"github.com/unionj-cloud/go-doudou/toolkit/sqlext/query"
)

type Base interface {
	Insert(ctx context.Context, data interface{}) (int64, error)
	Upsert(ctx context.Context, data interface{}) (int64, error)
	UpsertNoneZero(ctx context.Context, data interface{}) (int64, error)
	Update(ctx context.Context, data interface{}) (int64, error)
	UpdateNoneZero(ctx context.Context, data interface{}) (int64, error)
	BeforeSaveHook(ctx context.Context, data interface{})
	AfterSaveHook(ctx context.Context, data interface{}, lastInsertID int64, affected int64)

	UpdateMany(ctx context.Context, data interface{}, where query.Q) (int64, error)
	UpdateManyNoneZero(ctx context.Context, data interface{}, where query.Q) (int64, error)
	BeforeUpdateManyHook(ctx context.Context, data interface{}, where query.Q)
	AfterUpdateManyHook(ctx context.Context, data interface{}, where query.Q, affected int64)

	DeleteMany(ctx context.Context, where query.Q) (int64, error)
	DeleteManySoft(ctx context.Context, where query.Q) (int64, error)
	BeforeDeleteManyHook(ctx context.Context, data interface{}, where query.Q)
	AfterDeleteManyHook(ctx context.Context, data interface{}, where query.Q, affected int64)

	SelectMany(ctx context.Context, where ...query.Q) (interface{}, error)
	CountMany(ctx context.Context, where ...query.Q) (int, error)
	PageMany(ctx context.Context, page query.Page, where ...query.Q) (query.PageRet, error)
	BeforeReadManyHook(ctx context.Context, page *query.Page, where ...query.Q)
	
	Get(ctx context.Context, id interface{}) (interface{}, error)
}
```

### Transaction

Example:

```go
func (receiver *StockImpl) processExcel(ctx context.Context, f multipart.File, sheet string) (err error) {
	types := []string{"food", "tool"}
	var (
		xlsx *excelize.File
		rows [][]string
		tx   ddl.Tx
	)
	xlsx, err = excelize.OpenReader(f)
	if err != nil {
		return errors.Wrap(err, "")
	}
	rows, err = xlsx.GetRows(sheet)
	if err != nil {
		return errors.Wrap(err, "")
	}
	colNum := len(rows[0])
	rows = rows[1:]
    gdddb := wrapper.NewGddDB(db, wrapper.WithLogger(logger.NewSqlLogger(log.Default())))
	// begin transaction
	tx, err = gdddb.BeginTxx(ctx, nil)
	if err != nil {
		return errors.Wrap(err, "")
	}
	defer func() {
		if r := recover(); r != nil {
			_ = tx.Rollback()
			if e, ok := r.(error); ok {
				err = errors.Wrap(e, "")
			} else {
				err = errors.New(fmt.Sprint(r))
			}
		}
	}()
	// inject tx as ddl.Querier into dao layer implementation instance
	mdao := dao.NewMaterialDao(tx)
	for _, item := range rows {
		if len(item) == 0 {
			goto END
		}
		row := make([]string, colNum)
		copy(row, item)
		name := row[0]
		price := cast.ToFloat32(row[1])
		spec := row[2]
		pieces := cast.ToInt(row[3])
		amount := cast.ToInt(row[4])
		note := row[5]
		totalMount := pieces * amount
		if _, err = mdao.Upsert(ctx, domain.Material{
			Name:        name,
			Amount:      amount,
			Price:       price,
			TotalAmount: totalMount,
			Spec:        spec,
			Pieces:      pieces,
			Type:        int8(sliceutils.IndexOf(sheet, types)),
			Note:        note,
		}); err != nil {
			// rollback if err != nil
			_ = tx.Rollback()
			return errors.Wrap(err, "")
		}
	}
END:
	// commit
	if err = tx.Commit(); err != nil {
        _ = tx.Rollback()
		return errors.Wrap(err, "")
	}
	return err
}
```

### Hooks

There are 7 hooks from generated dao layer code for you to implement business logic yourself.

```go
// for insert/upsert/update operations
BeforeSaveHook(ctx context.Context, data interface{})
AfterSaveHook(ctx context.Context, data interface{}, lastInsertID int64, affected int64)

// for update many operations
BeforeUpdateManyHook(ctx context.Context, data interface{}, where query.Q)
AfterUpdateManyHook(ctx context.Context, data interface{}, where query.Q, affected int64)

// for delete many operations
BeforeDeleteManyHook(ctx context.Context, data interface{}, where query.Q)
AfterDeleteManyHook(ctx context.Context, data interface{}, where query.Q, affected int64)

// for read many operations, such as SelectMany/CountMany/PageMany
BeforeReadManyHook(ctx context.Context, page *query.Page, where ...query.Q)
```

`query.Q` is an interface type parameter, you'd better pass pointer type concrete type paramter in order to easily modify query conditions.

Example: 

```go
// add delete_at is null condition to each read operations
func (receiver UserDaoImpl) BeforeReadManyHook(ctx context.Context, page *query.Page, where ...query.Q) {
	if len(where) > 0 {
		if criteria, ok := where[0].(*query.Criteria); ok {
			*criteria = criteria.Col("delete_at").IsNull()
		} else if w, ok := where[0].(*query.Where); ok {
			*w = w.And(query.C().Col("delete_at").IsNull())
		}
	}
}
```

### Add Dao Layer Code

In development, we must need to write some custom dao layer CRUD code. How? Let me explain it using `user` table as an example: 

- At first, we should define methods of `UserDao` interface in `dao/userdao.go` file, for example:
```go
type UserDao interface {
	Base
	FindUsersByHobby(ctx context.Context, hobby string) ([]domain.User, error)
}
```
We defined a `FindUsersByHobby` method here

- Then we should create a new file named `userdaoimplext.go` in `dao` folder. The file name can be arbitrary, but recommend to name it by table name got rid of prefix + `daoimplext.go` pattern

- We write our own implementation for `FindUsersByHobby` method in the new file
```go
func (receiver UserDaoImpl) FindUsersByHobby(ctx context.Context, hobby string) (users []domain.User, err error) {
	sqlStr := `select * from ddl_user where hobby = ? and delete_at is null`
	err = receiver.db.SelectContext(ctx, &users, receiver.db.Rebind(sqlStr), hobby)
	return
}
```
- We create a new file `userdaoimplext_test.go` to write unit tests
```go
func TestUserDaoImpl_FindUsersByHobby(t *testing.T) {
	t.Parallel()
	u := dao.NewUserDao(db)
	users, err := u.FindUsersByHobby(context.Background(), "football")
	require.NoError(t, err)
	require.NotEqual(t, 0, len(users))
}
```

## Best Practices

Below best practices are from author's experience, only for reference.

- Design all table structures by database design tools like `Navicat` or `Mysql Workbench` at the beginning of development.
- Then run `go-doudou ddl --reverse --dao` to generate initial code. Using `--reverse` flag when initialising projects only.
- At the following project iteration, after modified domain structs in `domain` folder, you should delete `sql.go` suffixed files such as `userdaosql.go` at first, then run `go-doudou ddl --dao` to sync changes to table structures and generate `sql.go` suffixed files at the same time. If you also changed table name or table name prefix, you should also delete `daoimpl.go` suffixed files such as `userdaoimpl.go` and regenerate them.
- Custom dao layer code must be written in new files, don't modify `base.go` file, `daoimpl.go` suffixed files and `daosql.go` suffixed files manually. In the whole project lifecycle, you must make sure that these files could be removed and regenerated at any time, but not produce bugs to the program.
