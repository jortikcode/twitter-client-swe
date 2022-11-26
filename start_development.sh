#/bin/bash

# ---------- START DEVELOPMENT ENVIROMENT ----------
# This script will start the development enviroment
# This is intended only for DEVELOPMENT PURPOSES, you should check the README.md if you want to start the app.
# --------------------------------------------------

# Installing backend dependencies
cd ./backend
npm install
# Installing frontend dependencies
cd ../frontend
npm install

# If you're using Windows, you'll need to open 2 different shells and cd to the root folder:
# In one shell you'll start the backend with npm start --prefix ./backend
# In the other shell you'll start the frontend with npm start --prefix ./frontend
# If you're on Linux, well you don't have to do anything, enjoy http://localhost:3000
cd ..
npm start --prefix ./frontend & 
npm start --prefix ./backend