await lib.init()
var term = new hterm.Terminal();
term.decorate(document.querySelector('#terminal'));

const socket = io();

socket.emit("tty", {
  cols: term.screenSize.width,
  rows: term.screenSize.height
})

socket.on("data", (msg) => {
  term.io.print(msg)
})

term.onTerminalReady = function () {
  const io = term.io.push()
  term.setBackgroundColor("#1e1e2e")
  term.prefs_.set('font-family', '"FiraCode Nerd Font", monospace');
  term.prefs_.set('user-css', 'https://cdn.jsdelivr.net/gh/mshaugh/nerdfont-webfonts@v3.3.0/build/firacode-nerd-font.css');

  io.onVTKeystroke = (str) => {
    socket.emit("data", str)
    console.log(term.screenSize.height)
    console.log(term.screenSize.width)
  };

  io.sendString = (str) => {
    socket.emit("data", str)
  };

  io.onTerminalResize = (cols, rows) => {
    socket.emit("resize", {
      cols: cols,
      rows: rows
    })
  };
}

term.installKeyboard();
