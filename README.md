# NodeJS - The Complete Guide

Companion repository for the Udemy course
[NodeJS - The Complete Guide](https://)

### MongoDB

To configure MongoDB, create a database by name `nodejscomplete`:

```
use nodejscomplete
db.createCollection('nodejscomplete')
db.createUser({ "user": "nodejscomplete", "pwd": "mypass", "roles": [ { "role": "readWrite", "db": "nodejscomplete" } ] })
```

### Mail

Configure the following configuration in the /main/.env file:

```
EMAIL_HOST=<the email host>
EMAIL_PORT=<the email port>
EMAIL_USER=<the email username>
EMAIL_PASS=<the email password>
```
