# NodeJS - The Complete Guide

Companion repository for the Udemy course
[NodeJS - The Complete Guide](https://)

### MongoDB

To configure MongoDB, create a database by name `nodejscomplete`:

```
use nodejscomplete
db.createCollection('nodejscomplete')
db.createUser({ "user": "nodejscomplete", "pwd": "mypass", "roles": [ { "role": "readWrite", "db": "nodejscomplete" } ] })

use postapp
db.createCollection('postapp')
db.createUser({ "user": "postapp", "pwd": "mypass", "roles": [ { "role": "readWrite", "db": "postapp" } ] })

use test-postapp
db.createCollection('test-postapp')
db.createUser({ "user": "test-postapp", "pwd": "mypass", "roles": [ { "role": "readWrite", "db": "test-postapp" } ] })
```

### Mail

Configure the following configuration in the /main/.env file:

```
APP_PORT=<the application port>

DATABASE_URL=<the database URL>

EMAIL_HOST=<the email host>
EMAIL_PORT=<the email port>
EMAIL_USER=<the email username>
EMAIL_PASS=<the email password>

STRIPE_PUBLIC_KEY=<the Stripe public key>
STRIPE_PRIVATE_KEY=<the Stripe private key>
```

### Users

- test@test.com - test1
- test2@test.com - test2 (only for REST app)
