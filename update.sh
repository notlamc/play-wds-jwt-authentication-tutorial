#!/bin/bash

rm -rf node_modules &&
npm-upgrade &&
npm i &&
npx tsc &&
npm run build