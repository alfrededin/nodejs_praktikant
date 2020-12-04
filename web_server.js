const Koa = require("koa")
const Router = require("koa-router")
const axios = require("axios")
// Prometheus client
const prom = require("prom-client")
// Init default metrics collection
// const collectDefaultMetrics = prom.collectDefaultMetrics;
// collectDefaultMetrics();
// create Server instance
const app = new Koa()
const router = new Router()

const req_duration = new prom.Gauge({
  name: "request_duration",
  help: "Ammount of milliseconds the request took",
})

const req_counter = new prom.Counter({
  name: "requests_recieved",
  help: "number of requests recieved",
})

// Set up the routes
router.get("/", (ctx) => {
  req_counter.inc()
  ctx.body = `HELLO WORLD!`
})

router.get("/aw", async (ctx) => {
  req_counter.inc()
  const end = req_duration.startTimer()
  const result = await axios
    .get("http://www.academicwork.se")
    .then((x) => x.data)
    .catch((error) => console.log(error))
  console.log(result)
  end()
  ctx.body = result
})

router.get("/health", (ctx) => {
  req_counter.inc()
  ctx.body = `Im healthy ${Date.now}`
})

router.get("/metrics", (ctx) => {
  req_counter.inc()
  ctx.body = prom.register.metrics()
})

// ternary
// if true ? use_me : else_me
const port = process.env.SERVICE_PORT ? process.env.SERVICE_PORT : 3000

app.use(router.routes())
app.listen(port)
console.log(`listening on port ${port}`)
