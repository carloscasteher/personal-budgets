import { app } from './app.ts'
import { config } from './shared/infrastructure/config.ts'
import { serve } from '@hono/node-server'

serve(
  {
    fetch: app.fetch,
    port: config.listeningPort,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
