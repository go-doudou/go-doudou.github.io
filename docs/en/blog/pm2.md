---
sidebar: auto
---

# How to Deploy go-doudou Services with PM2 (Monolithic Edition)

In the early stages of my career, I worked as a full-time Node.js full-stack engineer for several years. At that time, PM2 was commonly used to deploy Node.js backend services. PM2 was the most well-known and widely used process management tool in the Node.js ecosystem before Docker became popular. In fact, PM2 can be used for programs written in any programming language, whether they are backend services providing interfaces for frontend engineers, web crawlers, or scheduled background tasks. It can replace tools like `nohup` and `screen` that are more familiar to Linux operations engineers, allowing developers to handle deployments themselves. Two years ago, I published an article on Jianshu about deploying Java services using PM2. The link is here: [https://www.jianshu.com/p/9062ba95f9df](https://www.jianshu.com/p/9062ba95f9df). Java programmers among the readers may find it useful as a reference. Even in today's era where Docker and Kubernetes are widely popular, I believe PM2 still has significant application value in small and medium-sized enterprises.

This article will demonstrate the specific usage through a monolithic service `usersvc` developed with the go-doudou microservice framework. I have already published a tutorial on JueJin explaining how to develop this service: [Quick Start: Developing Monolithic RESTful Services with go-doudou](https://juejin.cn/post/7046936284438200333). Interested readers can read that first and then come back to this article.

## Main Features of PM2

PM2 is a process management tool specifically designed for Node.js applications, with rich functionality. Here I want to summarize the main features that can be used when managing non-Node.js applications with PM2:

- Support for fully automated deployment process initiation and completion after pushing the latest code to a remote repository
- Support for password-free server login through SSH public-private key authentication
- Support for simultaneous deployment to multiple servers
- Support for deploying multiple replicas on a single server (not suitable for public-facing service programs due to port conflict errors)
- Support for configuring multiple sets of environment-specific configurations and specifying which environment to use when starting the program
- Support for configuring various hook functions for convenient execution of custom scripts or commands before and after deployment
- Support for easily viewing the program's running status, such as restart count, runtime duration, CPU and memory usage, etc.
- Support for easily viewing the program's basic information, such as startup parameters, log paths, creation time, git commit hash, etc.
- Support for easily viewing program logs, with options to manage logs through plugins like `pm2-logrotate`
- Support for easily configuring startup on system boot
- Support for limiting program memory usage and restarting when the maximum value is reached

## Advantages and Disadvantages of PM2 Compared to Docker

The following comparison is merely from a software developer's perspective, based on the goal of deploying programs online and updating them after code modifications. These are some immature experience summaries for readers' reference.

### Advantages

- Very lightweight with minimal overhead on server resources
- Support for automated deployment relying solely on PM2's mechanisms
- Support for deploying to multiple servers with a single command
- Easy to learn and developer-friendly

### Disadvantages

- Unable to limit CPU usage, with virtually no resource isolation
- Ecosystem obviously not as powerful as Docker's

## Server Preparation

You need a server with CentOS operating system or install CentOS through a virtual machine on your local computer.

## Server Configuration

### Installing Go

```shell
# Download Go installation package
wget https://dl.google.com/go/go1.17.8.linux-amd64.tar.gz
# Extract
tar -zxvf go1.17.8.linux-amd64.tar.gz
# Move the extracted go folder to /usr/local path
mv go /usr/local
```

Configure `/usr/local/go/bin` in the `PATH` environment variable. You can add the following configuration code to your `~/.zshrc` or `~/.bashrc` file:

```shell
export PATH=$PATH:/usr/local/go/bin
```

Create a symbolic link (non-root users need to add `sudo` prefix):

```
ln -s /usr/local/go/bin/go /usr/bin/go
```

### Installing PM2

First, install Node.js:

```shell
yum update && yum install -y nodejs
```

Then install PM2 (non-root users need to add `sudo` prefix):

```shell
npm install -g pm2 --registry=https://registry.npm.taobao.org
```

Finally, create symbolic links (non-root users need to add `sudo` prefix):

```shell
➜  ~ which node
/root/.nvm/versions/node/v14.19.1/bin/node
➜  ~ ln -s /root/.nvm/versions/node/v14.19.1/bin/node /usr/bin/node
➜  ~ which pm2
/root/.nvm/versions/node/v14.19.1/bin/pm2
➜  ~ ln -s /root/.nvm/versions/node/v14.19.1/bin/pm2 /usr/bin/pm2
```

### Installing MySQL

The practical case demonstrated in this article uses MySQL database for data persistence. Readers can choose to skip this section based on their actual needs.

Add MySQL repository address:

```shell
yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
```

Find the latest GPG public key from the MySQL official website [https://dev.mysql.com/doc/refman/5.7/en/checking-gpg-signature.html](https://dev.mysql.com/doc/refman/5.7/en/checking-gpg-signature.html), and use the vi command to copy and paste it into the `~/mysql5.7_pubkey.asc` file:

```shell
vi mysql5.7_pubkey.asc
```

Import the public key to MySQL and RPM:

```shell
gpg --import mysql5.7_pubkey.asc
rpm --import mysql5.7_pubkey.asc
```

Install MySQL 5.7:

```shell
yum install -y mysql-community-server
```

For demonstration purposes, we'll change the MySQL root user's password to 1234. In a production environment, never set such a simple password. First, modify the `/etc/my.cnf` file using the vi command, adding the line `validate_password = OFF` at the end to disable password rule validation.

```shell
vi /etc/my.cnf
```

Then, start the MySQL service instance:

```shell
systemctl start mysqld 
```

Check the status of the MySQL service to ensure it has started successfully:

```shell
➜  ~ systemctl status mysqld 
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2022-05-05 09:09:41 CST; 33min ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 1156 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=0/SUCCESS)
  Process: 1132 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 1159 (mysqld)
    Tasks: 28
   Memory: 185.1M
   CGroup: /system.slice/mysqld.service
           └─1159 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid

May 05 09:09:40 VM-0-17-centos systemd[1]: Starting MySQL Server...
May 05 09:09:41 VM-0-17-centos systemd[1]: Started MySQL Server.
```

MySQL initializes a temporary root password during installation. We can find it with the following command:

```shell
grep 'password' /var/log/mysqld.log
```

The temporary password is at the end of the first line of log output in the terminal:

```shell
➜  ~ grep 'password' /var/log/mysqld.log
2022-05-05T00:55:13.552165Z 1 [Note] A temporary password is generated for root@localhost: .B<UYdtda3rG
2022-05-05T00:55:17.373732Z 0 [Note] Shutting down plugin 'validate_password'
2022-05-05T00:55:18.983662Z 0 [Note] Shutting down plugin 'sha256_password'
```

After copying the temporary password, execute the following command:

```shell
mysql_secure_installation
```

Following the prompts, change the root password to 1234. For subsequent yes or no input prompts, enter no for all to make no further changes.

```shell
The existing password for the user account root has expired. Please set a new password.
New password:
Re-enter new password:
```

Test if the password was changed successfully, then create a database named `tutorial`:

```shell
➜  ~ mysql -uroot -p1234
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 20
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> CREATE SCHEMA `tutorial` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;
Query OK, 1 row affected (0.00 sec)

mysql> 
```

Finally, we need to grant the root user remote access permission from any IP. This is for demonstration convenience; it's not recommended for production environments.

```shell
CREATE USER 'root'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

With this, the server configuration work is completed.

## Practical Case

Below we'll use a case to explain and demonstrate how to use PM2.

### Clone the Code

After cloning the code, please navigate to the `usersvc` directory.

```shell
git clone git@github.com:unionj-cloud/go-doudou-tutorials.git
```

### Create Table Structure

Since there are no tables in the `tutorial` database of the server's MySQL instance, we need to create the table structure using the `go-doudou ddl` command. Before executing the command, we need to create a configuration file `.env.test.local` locally with the following configuration:

```shell
# Local development needs to connect to the server's public IP address
DB_HOST=162.14.116.92
DB_PORT=3306
DB_USER=root
DB_PASSWD=1234
```

This way, we can directly update the remote MySQL service instance's table structure by executing go-doudou commands locally. Additionally, we need to add this local configuration file to the `.gitignore` file to prevent it from being uploaded to the git repository and to prevent the online service from loading this configuration file at startup. Now we can execute the command:

```shell
➜  usersvc git:(master) ✗ go-doudou ddl --env=test --pre=t_   
INFO[2022-05-05 10:11:40] Type: name=User                              
CREATE TABLE `t_user` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`username` varchar(45) NOT NULL comment 'username',
`password` varchar(60) NOT NULL comment 'password',
`name` varchar(45) NOT NULL comment 'real name',
`phone` varchar(45) NOT NULL comment 'phone number',
`dept` varchar(45) NOT NULL comment 'department',
`avatar` varchar(255) NOT NULL comment 'user avatar',
`create_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
`update_at` datetime NULL DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
`delete_at` datetime NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `username_idx` (`username` asc))
```

You can connect to MySQL to check if the table structure was created successfully:

```shell
➜  usersvc git:(master) ✗ mysql -h 162.14.116.92 -P 3306 -uroot -p1234
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 22
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use tutorial;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+--------------------+
| Tables_in_tutorial |
+--------------------+
| t_user             |
+--------------------+
1 row in set (0.00 sec)

mysql> describe t_user;
+-----------+--------------+------+-----+-------------------+-----------------------------+
| Field     | Type         | Null | Key | Default           | Extra                       |
+-----------+--------------+------+-----+-------------------+-----------------------------+
| id        | int(11)      | NO   | PRI | NULL              | auto_increment              |
| username  | varchar(45)  | NO   | UNI | NULL              |                             |
| password  | varchar(60)  | NO   |     | NULL              |                             |
| name      | varchar(45)  | NO   |     | NULL              |                             |
| phone     | varchar(45)  | NO   |     | NULL              |                             |
| dept      | varchar(45)  | NO   |     | NULL              |                             |
| avatar    | varchar(255) | NO   |     | NULL              |                             |
| create_at | datetime     | YES  |     | CURRENT_TIMESTAMP |                             |
| update_at | datetime     | YES  |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
| delete_at | datetime     | YES  |     | NULL              |                             |
+-----------+--------------+------+-----+-------------------+-----------------------------+
10 rows in set (0.02 sec)

mysql> 
```

### PM2 Deploy Command

When deploying services, we mainly use PM2's `deploy` command. For specific usage, see the instructions in the code block below.

```
> pm2 deploy <config_file> <environment> <command>

  Command list:
    setup                Run remote setup commands
    update               Deploy latest version
    revert [n]           Revert to [n]th last deployment or 1
    curr[ent]            Output current release commit
    prev[ious]           Output previous release commit
    exec|run <cmd>       Execute the given <cmd>
    list                 List previous deploy commits
    [ref]                Deploy to [ref], the "ref" setting, or latest tag
```

In my personal practice, I use the `setup` and `update` commands more frequently.

#### PM2 Initialization

Before deploying and updating online services with PM2, we need to execute PM2's initialization command. The PM2 configuration file `ecosystem.config.js` is already in the code, which we'll explain later.

```shell
pm2 deploy ecosystem.config.js test setup
```

If you see `--> Success` on the last line of the command line terminal output, it indicates that the initialization was successful.

```shell
➜  usersvc git:(master) pm2 deploy ecosystem.config.js test setup
--> Deploying to test environment
--> on host 162.14.116.92
  ○ hook pre-setup
  ○ running setup
  ○ cloning git@github.com:unionj-cloud/go-doudou-tutorials.git
  ○ full fetch
Cloning into '/root/deploy/go-doudou-tutorials/source'...
  ○ hook post-setup
  ○ setup complete
--> Success
```

#### PM2 Deployment

First, let's look at the command:

```shell
pm2 deploy ecosystem.config.js test update
```

If you see `--> Success` on the last line of the command line terminal output, it indicates that the deployment was successful.

```shell
➜  usersvc git:(master) pm2 deploy ecosystem.config.js test update
--> Deploying to test environment
--> on host 162.14.116.92
  ○ deploying origin/master
  ○ executing pre-deploy-local
  ○ hook pre-deploy
  ○ fast forward master
Already on 'master'
From github.com:unionj-cloud/go-doudou-tutorials
 * branch            master     -> FETCH_HEAD
Already up-to-date.
  ○ executing post-deploy `cd usersvc && sh deploy.sh test`
[PM2][WARN] Applications usersvc not running, starting...
[PM2] App [usersvc] launched (1 instances)
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ usersvc    │ default     │ N/A     │ fork    │ 10737    │ 0s     │ 0    │ online    │ 0%       │ 9.6mb    │ root     │ disabled │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
  ○ hook test
  ○ successfully deployed origin/master
--> Success
```

### PM2 Deployment Configuration File

As mentioned above, the `ecosystem.config.js` file is the configuration file read by the PM2 deployment command. Let's take a look at this file; explanations have already been written as comments on the code.

```javascript
// Environment variables configuration needed by the program in different deployment environments
const ENV = {
  // Development environment
  "env_dev": {
    // GDD_ENV environment variable is equivalent to the spring.profiles.active configuration in the Spring Boot framework of the Java ecosystem
    "GDD_ENV": "dev"
  },
  // Production environment
  "env_prod": {
    "GDD_ENV": "prod"
  },
  // Test environment
  "env_test": {
    "GDD_ENV": "test"
  }
};

module.exports = {
  // Multiple applications can be configured in the apps property
  "apps": [
    {
      // Application name
      "name": "usersvc",  
      // Startup file, here it's the binary executable compiled by go build, can be a relative or absolute path
      "script": "./api",  
      // Working directory, since go-doudou-tutorials is a monorepo repository, this configuration is needed,
      // the default working directory is /root/deploy/go-doudou-tutorials/current/usersvc
      "cwd": "/root/deploy/go-doudou-tutorials/current/usersvc",  
      // Runtime environment, default is node for Node.js. Since we're deploying a binary executable, we don't need a compiler
      "exec_interpreter": "",
      // Running mode, PM2 supports cluster and fork modes.
      // In cluster mode, PM2 can do load balancing, but it only supports Node.js applications,
      // so for non-Node.js applications, this can only be configured as fork
      "exec_mode": "fork",
      // JavaScript destructuring syntax, equivalent to embedding the ENV object into this object
      ...ENV
    },
  ],
  deploy: {
    // Test environment deployment configuration, you can configure any number of environments with any name,
    // such as uat, beta, release, production, etc.
    test: {
      // Multiple IP addresses can be configured for simultaneous deployment to multiple test servers
      host: ['162.14.116.92'],
      // Server username
      user: 'root',
      // SSH-related configuration
      ssh_options: "StrictHostKeyChecking=no",
      // Code branch to deploy
      ref: 'origin/master',
      // Git repository address for the git clone command
      repo: "git@github.com:unionj-cloud/go-doudou-tutorials.git",
      // Server disk path for the code
      path: "/root/deploy/go-doudou-tutorials",
      // Post-deploy callback command
      // The command configured here means to change to the usersvc directory, then execute the deploy.sh script with the parameter test
      "post-deploy": "cd usersvc && sh deploy.sh test",
    }
  }
};
```

### deploy.sh Script

The role of the `deploy.sh` script is to compile Go code, generate a binary executable file, set the timezone environment variable, and finally execute the `pm2 restart` command to start or restart the service. Please refer to the comments below to help understand.

```shell
#!/bin/bash

# Set environment variables required for compiling the program
# Enable go module
export GO111MODULE=on
# Set goproxy to speed up dependency downloads
export GOPROXY=https://goproxy.cn,direct
# Compile the program to generate an executable file
go build -v -o api cmd/main.go

# Since the code in this case uses the standard library time package, where time.Local static variable takes its value from the TZ environment variable,
# if this environment variable is not configured, it defaults to UTC timezone, which usually doesn't meet our requirements
export TZ="Asia/Shanghai"

# Start the service process through PM2, --only means only deploy the usersvc application, --env means which one of env_dev, env_prod, env_test in the ENV attribute of the configuration file to read, note that the env_ prefix is not added when passing parameters
# The pm2 restart command is executed on the server, which is fundamentally different from the pm2 deploy command
pm2 restart ecosystem.config.js --only usersvc --env $1
```

## Conclusion

In this article, we first introduced the main features of the PM2 process management tool and its advantages and disadvantages compared to Docker. Then we described the preliminary work needed to prepare the server for deploying applications written in Go. Finally, we demonstrated the deployment process through a practical case and explained the PM2-related configuration files and deployment scripts. I believe that all Gophers have now mastered the method of deploying go-doudou services using PM2. In the next article, I will demonstrate how to use PM2 to deploy microservices using a case involving a service written with the Spring Boot framework from the Java ecosystem and a service written with go-doudou.

## Reference Links

- PM2 official configuration file documentation: [https://pm2.keymetrics.io/docs/usage/application-declaration/](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- PM2 official deployment documentation: [https://pm2.keymetrics.io/docs/usage/deployment/](https://pm2.keymetrics.io/docs/usage/deployment/) 