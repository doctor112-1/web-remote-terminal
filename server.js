import express from 'express'
import { createServer } from 'node:http';
import 'dotenv/config'
import { Server } from 'socket.io';
import * as pty from 'node-pty';

const app = express()
const server = createServer(app);
const port = process.env.PORT
const io = new Server(server);

app.use(express.static('public'))

io.on('connection', (socket) => {
  let ptyProcess;
  socket.on("tty", (msg) => {
    ptyProcess = pty.spawn("bash", [], {
      name: 'xterm-color',
      cols: msg.cols,
      rows: msg.rows,
      cwd: process.env.HOME,
      env: process.env
    });
    ptyProcess.onData((data) => {
      socket.emit("data", data);
    });
  })
  socket.on("resize", (msg) => {
    try {
      ptyProcess.resize(msg.cols, msg.rows);
    } catch (error) {
      console.log(error)
    }
  })
  socket.on("data", (msg) => {
    try {
      ptyProcess.write(msg)
    } catch (error) {
      console.log(error)
    }
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
