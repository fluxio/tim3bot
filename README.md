# tim3bot

### The manager you didn't know you want.

## Installation

1. Install and start [Redis](http://redis.io/topics/quickstart)
  * On OSX, we recommend using Homebrew and automatically starting the server on login:
  ```bash
  $ brew update
  $ brew install redis
  $ brew services start redis
  ```
1. Install and start [Postgres](https://www.postgresql.org/download/)
  * On OSX, we recommend using Homebrew and automatically starting the server on login:
  ```bash
  $ brew update
  $ brew install postgres
  $ brew services start postgresql
  ```
1. Create a Postgres database and, if necessary, superuser, e.g.:
  ```bash
  $ createuser -s postgres
  $ createdb tim3bot
  ```
1. Clone the repo and install the Node dependencies: `npm install`
1. Set up your [environment](#environment)
1. Start the server: `npm run start:watch`
1. Navigate to http://localhost:4000

## Environment

* `SLACK_CLIENT_ID`: The Slack app's client ID
* `SLACK_CLIENT_SECRET`: The Slack app's client secret
* `DB_NAME`: The postgres database name, e.g., `tim3bot`
* `DB_USER` *(optional, default: `postgres`)*: The postgres database user
* `DB_PASSWORD` *(optional)*: The postgres database password
* `NODE_ENV` *(optional, default: `development`): The current environment, e.g., `development` or `production`
* `PROXY_PORT` *(optional, default: `4000`): The port for the server that you will access in the browser
* `API_PORT` *(optional, default: `4001`, alias: `PORT`): The port for the main server
* `STATIC_PORT` *(optional, default: `4002`): The port for the Webpack server

## Development Notes

... various things still to be documented, but here's a weirdness with the DB, for now.

To get up and running, create an app on Heroku to get started. We already have one at
Flux called tim3bot. Then:
 * Set the remote in your local directory: `heroku git:remote -a tim3bot`
 * Get the postGres connection URL with `heroku pg:credentials DATABASE`
 * Use the "Connection URL" in a command of this form:
   `DATABASE_URL=<the connection url above>?ssl=true knex migrate:latest`. Don't
   forget to add the ?ssl=true at the end, there.
