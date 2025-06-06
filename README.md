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
