import config from "./config/env";
import { initDB } from "./db";
import app from "./app"

const port = config.port;

const main = () => {
  initDB()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()