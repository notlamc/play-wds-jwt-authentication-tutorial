import express from "express";

import dotenv from "dotenv";

import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(express.json());

const verifyJwtMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) return res.sendStatus(401);

  jsonwebtoken.verify(
    accessToken,

    process.env.ACCESS_TOKEN_SECRET,

    (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;

      next();
    }
  );
};

const posts = [
  {
    username: "craig",

    title: "Post 1",
  },

  {
    username: "jim",

    title: "Post 2",
  },
];

app.get("/posts", verifyJwtMiddleware, (req, res) =>
  res.json(posts.filter((post) => post.username === req.user.username))
);

app.listen(
  process.env.SERVER_PORT,

  () => console.log(`Posts server running on port ${process.env.SERVER_PORT}.`)
);
