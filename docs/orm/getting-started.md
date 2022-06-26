# Getting Started

- Install go-doudou

```shell
go get -v github.com/unionj-cloud/go-doudou@v1.1.9
```

- Clone example repo, cd `ddldemo` directory

```shell
git clone git@github.com:unionj-cloud/go-doudou-tutorials.git
```

- Start mysql container

```shell
docker-compose -f docker-compose.yml up -d
```

- Update table structure and generate dao layer code

```shell
go-doudou ddl --dao --pre=ddl_
```

You can see below output from terminal:

```
➜  ddldemo git:(main) ls -la dao
total 56
drwxr-xr-x   6 wubin1989  staff   192  9  1 00:28 .
drwxr-xr-x  14 wubin1989  staff   448  9  1 00:28 ..
-rw-r--r--   1 wubin1989  staff   953  9  1 00:28 base.go
-rw-r--r--   1 wubin1989  staff    45  9  1 00:28 userdao.go
-rw-r--r--   1 wubin1989  staff  9125  9  1 00:28 userdaoimpl.go
-rw-r--r--   1 wubin1989  staff  5752  9  1 00:28 userdaosql.go
```

- Run `main` function

```shell
go run main.go   
```

You can see below output from terminal:

```
➜  ddldemo git:(master) go run main.go              
time="2022-05-23 19:14:30" level=info msg="SQL: INSERT INTO `test`.`ddl_user` ( `id`, `name`, `phone`, `age`, `no`, `school`, `is_student`, `delete_at`, `avg_score`, `hobby`) VALUES ( '0', 'jack', '13552053960', '30', '0', null,
'0', null, '97.534', '')"
time="2022-05-23 19:14:30" level=info msg="user jack's id is 11\n"
time="2022-05-23 19:14:30" level=info msg="SQL: select * from ddl_user where `age` > '27' order by `age` desc limit 0,1\tHIT: false"
time="2022-05-23 19:14:30" level=info msg="SQL: select count(1) from ddl_user where `age` > '27'\tHIT: false"
time="2022-05-23 19:14:30" level=info msg="returned user jack's id is 11\n"
time="2022-05-23 19:14:30" level=info msg="returned user jack's average score is 97.534"
time="2022-05-23 19:14:30" level=info msg="SQL: select * from ddl_user where `age` > '27' order by `age` desc limit 0,1\tHIT: true"
time="2022-05-23 19:14:30" level=info msg="SQL: select count(1) from ddl_user where `age` > '27'\tHIT: true"
time="2022-05-23 19:14:30" level=info msg="returned user jack's id is 11\n"
time="2022-05-23 19:14:30" level=info msg="returned user jack's average score is 97.534"
&{2 2}
time="2022-05-23 19:14:30" level=info msg="SQL: delete from ddl_user where `age` > '27';"
```

- Delete `domain` directory, `dao/userdaoimpl.go` and `dao/userdaosql.go` files, then run below command, we can see go code generated from table structures

```shell
go-doudou ddl --reverse --dao --pre=ddl_
```

You can see below output from terminal:

```
➜  ddldemo git:(master) go-doudou ddl --reverse --dao --pre=ddl_
WARN[2022-03-18 09:22:50] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/ddldemo/dao/base.go already exists 
WARN[2022-03-18 09:22:50] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/ddldemo/dao/userdao.go already exists 
```

- Run `main` function again

```shell
go run main.go   
```

You can see below output from terminal:

```
➜  ddldemo git:(master) ✗ go run main.go              
time="2022-05-23 19:15:25" level=info msg="SQL: INSERT INTO `test`.`ddl_user` ( `id`, `name`, `phone`, `age`, `no`, `school`, `is_student`, `delete_at`, `avg_score`, `hobby`) VALUES ( '0', 'jack', '13552053960', '30', '0', null, 
'0', null, '97.534', '')"
time="2022-05-23 19:15:25" level=info msg="user jack's id is 12\n"
time="2022-05-23 19:15:25" level=info msg="SQL: select * from ddl_user where `age` > '27' order by `age` desc limit 0,1\tHIT: false"
time="2022-05-23 19:15:25" level=info msg="SQL: select count(1) from ddl_user where `age` > '27'\tHIT: false"
time="2022-05-23 19:15:25" level=info msg="returned user jack's id is 12\n"
time="2022-05-23 19:15:25" level=info msg="returned user jack's average score is 97.534"
time="2022-05-23 19:15:25" level=info msg="SQL: select * from ddl_user where `age` > '27' order by `age` desc limit 0,1\tHIT: true" 
time="2022-05-23 19:15:25" level=info msg="SQL: select count(1) from ddl_user where `age` > '27'\tHIT: true"
time="2022-05-23 19:15:25" level=info msg="returned user jack's id is 12\n"
time="2022-05-23 19:15:25" level=info msg="returned user jack's average score is 97.534"
&{2 2}
time="2022-05-23 19:15:25" level=info msg="SQL: delete from ddl_user where `age` > '27';"
```