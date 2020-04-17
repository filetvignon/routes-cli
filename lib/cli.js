const readline = require('readline');

module.exports = class Interface {
  constructor(graph, opts = {}) {
    const { historySize = 1000 } = opts;
    this.graph = graph;
    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      historySize,
    });
  }

  start() {
    this.terminal.question('Please enter the route:', (input) => {
      input = input.trim().toUpperCase();
      if (input === 'EXIT')
        return this.terminal.write('', {
          ctrl: true,
          name: 'c',
        });
      let [src, dest] = input.split(/\s*-\s*/);
      if (!src || !dest) this.terminal.write('Bad input, please try again\n');
      else {
        if (!this.graph.exists(src))
          this.terminal.write(`${src} is not a valid origin\n`);
        else if (!this.graph.exists(dest))
          this.terminal.write(`${dest} is not a valid destination\n`);
        else {
          const res = this.graph.calculateBestRoute(src, dest);
          if (!res)
            this.terminal.write(`Route ${src}-${dest} is not available\n`);
          else
            this.terminal.write(
              `Best route: ${res.path.join(' - ')} > $${res.weight}\n`
            );
        }
      }
      this.start();
    });
  }

  close() {
    this.terminal.close();
  }

  onInterrupt(callback) {
    this.terminal.on('SIGINT', callback);
    this.terminal.on('SIGTSTP', callback);
  }
};
