const Koa = require("koa");
const Router = require("koa-router");
const axios = require("axios");
// Prometheus client
const prom = require("prom-client");
const e = require("express");
const { runInContext } = require("vm");
// Init default metrics collection
// const collectDefaultMetrics = prom.collectDefaultMetrics;
// collectDefaultMetrics();
// create Server instance
const app = new Koa();
const router = new Router();
console.log(process.version);

// const req_duration = new prom.Gauge({
//     name: 'request duration',
//     help: 'Ammount of milliseconds the request took'
// })

const req_counter = new prom.Counter({
  name: "requests_recieved",
  help: "number of requests recieved",
});

// req_duration.setToCurrentTime();
// const end = req_duration.startTimer();

// Set up the routes
router.get("/", (ctx) => {
  req_counter.inc();
  ctx.body = `HELLO WORLD!`;
});

router.get("/aw", async (ctx) => {
  req_counter.inc();
  const result = await axios
    .get("http://www.academicwork.se")
    .then((x) => x.data)
    .catch((error) => console.log(error));
  console.log(result);

  ctx.body = result;
});

router.get("/metrics", (ctx) => {
  req_counter.inc()(ctx);
  ctx.body = prom.register.metrics();
});
const run = async () => {
  app.use(router.routes());
  app.listen(3000);
  console.log("listening on port 3000");
}; // Tell Koa to use the routes

run();
