import express from "express";

import { helloWorld } from "src/controllers/helloworld";

(() => {
  const app = express();
  app.get("/helloworld", helloWorld());

  app.listen(process.env.API_PORT, () => {
    console.log(`API server is running at port ${process.env.API_PORT}`);
  });
})();
