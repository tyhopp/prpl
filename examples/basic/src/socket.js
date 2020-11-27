if ('WebSocket' in window) {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = `${protocol}${window.location.host}${window.location.pathname}/ws`;
  const socket = new WebSocket(address);
  socket.onmessage = ({ data: command }) => {
    if (command === 'reload') {
      window.location.reload();
    }
  };
}