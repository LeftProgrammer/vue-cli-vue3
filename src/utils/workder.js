// Build a worker from an anonymous function body
const blobURL = URL.createObjectURL(
  new Blob(
    [
      "(",
      function () {
        let intervalIds = {};

        self.onmessage = function onMsgFunc(e) {
          switch (e.data.command) {
            case "interval:start": {
              const intervalId = setInterval(function () {
                postMessage({
                  message: "interval:tick",
                  id: e.data.id,
                });
              }, e.data.interval);

              postMessage({
                message: "interval:started",
                id: e.data.id,
              });

              intervalIds[e.data.id] = intervalId;
              break;
            }
            case "interval:clear": {
              clearInterval(intervalIds[e.data.id]);

              postMessage({
                message: "interval:cleared",
                id: e.data.id,
              });

              delete intervalIds[e.data.id];
              break;
            }
            default:
              break;
          }
        };
      }.toString(),
      ")()",
    ],
    { type: "application/javascript" }
  )
);

const worker = new Worker(blobURL);

URL.revokeObjectURL(blobURL);

const workerTimer = {
  id: 0,
  callbacks: {},
  setInterval(cb, interval, context) {
    this.id += 1;
    const id = this.id;
    this.callbacks[id] = { fn: cb, context };
    worker.postMessage({
      command: "interval:start",
      interval,
      id,
    });
    return id;
  },
  onMessage(e) {
    switch (e.data.message) {
      case "interval:tick": {
        const callbackItem = this.callbacks[e.data.id];
        if (callbackItem && callbackItem.fn) {
          callbackItem.fn.apply(callbackItem.context);
        }
        break;
      }
      case "interval:cleared":
        delete this.callbacks[e.data.id];
        break;
      default:
        break;
    }
  },
  clearInterval(id) {
    worker.postMessage({ command: "interval:clear", id });
  },
};

worker.onmessage = workerTimer.onMessage.bind(workerTimer);

export default workerTimer;
