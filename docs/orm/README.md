# Introduction

go-doudou provides a built-in lightweight orm based on [jmoiron/sqlx](https://github.com/jmoiron/sqlx), made up of two parts: one is table structure migration and dao layer code generation tool `go-doudou ddl`, another is sql log printing and cache module built upon `*sqlx.DB`. Only support `mysql` now, any pull requests are welcome!

