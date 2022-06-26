# SQL Logging

go-doudou uses `GddDB` and `GddTx` structs to wrap `*sqlx.DB` to implement SQL logging feature. There is no direct relationship between this feature and ddl tool, that means you can use `GddDB` and `GddTx` in your own custom database operation code as a drop-in replacement for `*sqlx.DB`. You can call package level static function `wrapper.NewGddDB` to create `GddDB` instance and call `BeginTxx` method to create `GddTx` instance.

go-doudou provides `ISqlLogger` interface from `toolkit/sqlext/logger` package, which developers can implement. Developers can also use an out-of-box `SqlLogger` struct. 
There is also a factory function `NewSqlLogger` for you to create `SqlLogger` instance from `toolkit/sqlext/logger`. You just need to pass the instance to `wrapper.NewGddDB` function to create `GddDB` instance, then pass it to generated dao layer factory function to create dao instance, then you can call CRUD methods from the dao instance and SQL whose parameter placeholders have been already substituted with values will be printed automatically.

```go
gdddb := wrapper.NewGddDB(db, wrapper.WithLogger(logger.NewSqlLogger(log.Default())))
u := dao.NewUserDao(gdddb)
// use u to operate database
// got, err := u.UpsertNoneZero(context.Background(), user)
```

Besides SQL statements, go-doudou will also extract request id and trace id from `context.Context` and print them at the same time.

![go-doudou输出sql查询日志](/images/logscreenshot.png)

If you use the default implementation `SqlLogger`, you should also need to set environment variable `GDD_SQL_LOG_ENABLE` to `true`.
