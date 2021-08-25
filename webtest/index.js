import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import { resolve } from 'path'

const fastify = Fastify({ logger: true })
const dir = resolve('webtest')


fastify
  .register(FastifyStatic, { root: resolve('.'), prefix: '/' })
  .get('/', (req, reply) => { reply.sendFile('webtest.html', dir) })
  .listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })
