import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'

// const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')


class Server {
  constructor () {
    this.app = new Koa();
  }
  async Start () {
    config.dev = !(this.app.env === 'production')
    // Instantiate nuxt.js 
    const nuxt = await new Nuxt(config)
    // Build in development
    if (config.dev) {
      const builder = await new Builder(nuxt);
      await builder
      .build()
      .catch(e => {
        console.error(e) // eslint-disable-line no-console
        process.exit(1)
      });
      this.app.use(ctx => {
        ctx.status = 200 // koa defaults to 404 when it sees that status is unset
        return new Promise((resolve, reject) => {
          ctx.res.on('close', resolve)
          ctx.res.on('finish', resolve)
          nuxt.render(ctx.req, ctx.res, promise => {
            // nuxt.render passes a rejected promise into callback on error.
            promise.then(resolve).catch(reject)
          })
        })
      });
      this.app.listen(port, host)
      console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
    }
  }
}

const server = new Server();
server.Start();







