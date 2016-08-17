# tim3bot

## The manager you didn't know you want.

## Development Notes

... various things still to be documented, but here's a weirdness with the DB, for now.

To get up and running, create an app on Heroku to get started. We already have one at
Flux called tim3bot. Then:
 * Set the remote in your local directory: `heroku git:remote -a tim3bot`
 * Get the postGres connection URL with `heroku pg:credentials DATABASE`
 * Use the "Connection URL" in a command of this form:
   `DATABASE_URL=<the connection url above>?ssl=true knex migrate:latest`. Don't
   forget to add the ?ssl=true at the end, there.
