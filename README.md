# room-finder-gui

A GUI for room-finder in development.

There are 2 folders: client and server. The only thing the server does right now is write to building.json in the root folder to save your changes.

If you don't need the server, you can just run these commands:

```bash
cd client
# install dependencies
yarn
# run client and watch for changes
yarn serve
```

If you do need the server, open 2 separate terminal windows:

```bash
cd client
yarn
# build client and watch for changes
yarn build-watch
```

```bash
cd server
yarn
# run server and watch for changes in index.js
yarn dev
```
