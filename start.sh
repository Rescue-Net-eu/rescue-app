#!/bin/sh
# Start API and Web servers
node apps/api/dist/main.js &
npm --prefix apps/web start
