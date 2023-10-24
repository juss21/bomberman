#!/bin/bash

# to install 2 node packages
npm install --prefix="./frontend"

# to build framework files in the "frontend" directory
npm run build --prefix="./frontend"

# to launch frontend
npm start --prefix="./frontend"