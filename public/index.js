var term = new Terminal({
  theme: {
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    cursor: "#f5e0dc",
    cursorAccent: "#11111b",
    black: "#45475a",
    red: "#f38ba8",
    green: "#a6e3a1",
    yellow: "#f9e2af",
    blue: "#89b4fa",
    magenta: "#f5c2e7",
    cyan: "#94e2d5",
    white: "#bac2de",
    brightBlack: "#585b70",
    brightRed: "#f38ba8",
    brightGreen: "#a6e3a1",
    brightYellow: "#f9e2af",
    brightBlue: "#89b4fa",
    brightMagenta: "#f5c2e7",
    brightCyan: "#94e2d5",
    brightWhite: "#a6adc8",
    selectionForeground: "#cdd6f4",
    selectionBackground: "#414356"
  },
  fontFamily: '"Iosevka Nerd Font Mono", "monospace"'
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

const webFontsInstance = new WebFontsAddon.WebFontsAddon()
term.loadAddon(webFontsInstance)

webFontsInstance.loadFonts(["Iosevka Nerd Font Mono"]).then(() => {
  term.open(document.getElementById('terminal'));
  fitAddon.fit();

  const socket = io();

  socket.emit("tty", {
    cols: term.cols,
    rows: term.rows
  })

  socket.on("data", (msg) => {
    term.write(msg)
  })

  term.onData(e => {
    socket.emit("data", e)
  })

  window.addEventListener("resize", () => {
    fitAddon.fit()
  })

  term.onResize((size) => {
    console.log(size.cols, size.rows)
    socket.emit("resize", {
      cols: size.cols,
      rows: size.rows
    })
  })
})
