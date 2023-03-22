import express from "express";

import dotenv from "dotenv";

import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(express.json());

let refreshTokens = [];

const generateAccessToken = (user) =>
  jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });

const generateRefreshToken = (user) =>
  jsonwebtoken.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });

app.post("/login", (req, res) => {
  const username = req.body.username;

  const user = { username };

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken);

  res.json({
    accessToken,

    refreshToken,
  });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jsonwebtoken.verify(
    refreshToken,

    process.env.REFRESH_TOKEN_SECRET,

    (err, user) => {
      if (err) return res.sendStatus(403);

      const newUser = { username: user.username };

      const newAccessToken = generateAccessToken(newUser);

      const newRefreshToken = generateRefreshToken(newUser);

      refreshTokens = refreshTokens.filter(
        (existingRefreshToken) => existingRefreshToken !== refreshToken
      );

      refreshTokens.push(newRefreshToken);

      res.json({
        accessToken: newAccessToken,

        refreshToken: newRefreshToken,
      });
    }
  );
});

app.listen(
  process.env.AUTH_SERVER_PORT,

  () =>
    console.log(`Auth server running on port ${process.env.AUTH_SERVER_PORT}.`)
);
