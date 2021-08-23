import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import { resolve } from 'path'

const fastify = Fastify({ logger: true })
const dir = resolve('webtest')


fastify
  .register(FastifyStatic, { root: resolve('.'), prefix: '/' })
  .get('/', (req, reply) => { reply.sendFile('webtest.html', dir) })
  .get('/compatible', (req, reply) => { reply.sendFile('compatible.html', dir) })
  .get('/compatible-min', (req, reply) => { reply.sendFile('compatible-min.html', dir) })
  .get('/core', (req, reply) => { reply.sendFile('core.html', dir) })
  .get('/core-min', (req, reply) => { reply.sendFile('core-min.html', dir) })
  .listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })
