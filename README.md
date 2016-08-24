# TIM3BOT

### The manager you didn't know you wanted :)

TIM3BOT is lightweight, conversational tool for tracking goals and time estimation
across various teams here at Flux.io. It asks you to make ~3 large commitments to 
your team per week, plus how many days of effort you believe each commitment 
represents. TIM3BOT then checks in with you regularly and provides you a score so
you can see your estimation efficiency week-to-week.

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
1. Create a new bot on Slack (we call ours "tim3bot").
1. Set up your [environment](#environment)
1. Start the server: `npm run start:watch`
1. Navigate to http://localhost:4000

## Environment

* `SLACK_CLIENT_ID`: The Slack app's client ID
* `SLACK_CLIENT_SECRET`: The Slack app's client secret
* `SLACK_API_TOKEN`: The api token you get for your newly-created bot on Slack.
* `DB_NAME`: The postgres database name, e.g., `tim3bot`
* `DB_USER` *(optional, default: `postgres`)*: The postgres database user
* `DB_PASSWORD` *(optional)*: The postgres database password
* `NODE_ENV` *(optional, default: `development`): The current environment, e.g., `development` or `production`
* `PROXY_PORT` *(optional, default: `4000`): The port for the server that you will access in the browser
* `API_PORT` *(optional, default: `4001`, alias: `PORT`): The port for the main server
* `STATIC_PORT` *(optional, default: `4002`): The port for the Webpack server
