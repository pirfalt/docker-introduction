import express from "express";
import morgan from "morgan";
import http from "http";

const PORT = 3000;

async function main() {
  const app = express();

  app.use(morgan("dev"));

  app.get("/", (req, res) => {
    const name = req.query.name ?? "World";
    console.log(`Received request for ${name}`);

    res.send(`Hello ${name}!\n`);
  });

  const server = http.createServer(app);
  await new Promise((res) => server.listen(PORT, res));

  console.log(`Server listening on: ${JSON.stringify(server.address())}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
