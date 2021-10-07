import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import http from "http";
import pg from "pg";
import redis from "redis";
import { promisify } from "util";

async function main() {
  // Exit on error
  process.on("uncaughtException", die);
  process.on("unhandledRejection", die);

  // Configuration
  const {
    PORT = "3000",
    PG_CONN = "postgresql://postgres:mysecretpassword@localhost:5432/postgres",
    REDIS_CONN = "redis://localhost:6379",
  } = process.env;

  // Databases
  const pgDB = new pg.Pool({ connectionString: PG_CONN });
  const redisDB = redis.createClient({ url: REDIS_CONN });

  // Repositories
  const pgRepo = await createPostgresRepository(pgDB);
  const redisRepo = await createRedisRepository(redisDB);

  // App
  const app = createApp({ pgRepo, redisRepo });

  // Server
  const server = http.createServer(app);
  await new Promise((res) => server.listen(PORT, res));
  console.log(`Server listening on: ${JSON.stringify(server.address())}`);
}

function createApp({ pgRepo, redisRepo }) {
  const app = express();
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use("/", createRouter({ pgRepo, redisRepo }));
  return app;
}

function createRouter({ pgRepo, redisRepo }) {
  function h(asyncHandler) {
    return (req, res, next) => {
      asyncHandler(req, res).then(next).catch(next);
    };
  }

  const router = express.Router();

  router.get(
    "/:id",
    h(async (req, res) => {
      const id = req.params.id;

      const c = await redisRepo.getBlob(id);
      if (c != null) {
        res.setHeader("cache-hit", "true");
        res.json(JSON.parse(c));
        return;
      }

      const r = await pgRepo.getBlob(id);
      res.setHeader("cache-hit", "false");
      res.json(r);

      await redisRepo.saveBlob(id, JSON.stringify(r));
    })
  );

  router.get(
    "/",
    h(async (req, res) => {
      const id = "list";
      const c = await redisRepo.getBlob(id);
      console.log(c);
      if (c != null) {
        res.setHeader("cache-hit", "true");
        res.json(JSON.parse(c));
        return;
      }

      const r = await pgRepo.listBlobs();
      res.setHeader("cache-hit", "false");
      res.json(r);

      await redisRepo.saveBlob(id, JSON.stringify(r));
    })
  );

  router.post(
    "/",
    h(async (req, res) => {
      const r = await pgRepo.saveBlob(req.body);
      res.json(r);
    })
  );

  return router;
}

async function createPostgresRepository(db) {
  await db.query(`
    create table if not exists kv(
      id UUID primary key default gen_random_uuid(),
      value jsonb not null
    )
  `);

  return {
    async saveBlob(val) {
      const qr = await db.query(
        `
          insert into kv(value)
          values ($1)
          returning id
        `,
        [val]
      );
      return qr.rows[0];
    },

    async getBlob(id) {
      const qr = await db.query(
        `
          select *
          from kv
          where id = $1
        `,
        [id]
      );
      return qr.rows[0] ?? "not found";
    },

    async listBlobs() {
      const qr = await db.query(
        `
          select *
          from kv
        `,
        []
      );
      return qr.rows;
    },
  };
}

async function createRedisRepository(db, cacheTimeSec = 5) {
  db.on("error", function (error) {
    console.error(error);
  });

  const get = promisify(db.get).bind(db);
  const setex = promisify(db.setex).bind(db);
  const scan = promisify(db.scan).bind(db);

  return {
    async saveBlob(id, val) {
      return await setex(id, cacheTimeSec, val);
    },

    async getBlob(id) {
      return await get(id);
    },
  };
}

function die(err) {
  console.error(err);
  process.exit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
