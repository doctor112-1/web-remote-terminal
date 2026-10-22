import express from 'express'
import { createServer } from 'node:http';
import 'dotenv/config'
import { Server } from 'socket.io';
import * as pty from 'node-pty';
import { join } from "path"

const __dirname = import.meta.dirname;

const app = express()
const server = createServer(app);
const port = process.env.PORT
const io = new Server(server);
const username = process.env.USERNAME

app.use(express.static(join(__dirname, 'public')))

app.use(express.static(join(__dirname, 'node_modules/@xterm/xterm')))
app.use(express.static(join(__dirname, 'node_modules/@xterm/addon-fit')))
app.use(express.static(join(__dirname, 'node_modules/@xterm/addon-web-fonts')))

io.on('connection', (socket) => {
  let ptyProcess;
  socket.on("tty", (msg) => {
    ptyProcess = pty.spawn("su", [username], {
      name: 'xterm-256color',
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
  console.log(`Web remote terminal listening on port ${port}`)
})
