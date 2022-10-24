cd ./backend
npm install
cd ../frontend
npm install
npm run build
cp -r ./build ../backend
cd ../backend
npm start