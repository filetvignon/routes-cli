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
    this.terminal.question('\nPlease enter route:', async (input) => {
      input = input.trim().toUpperCase();
      if (input === 'EXIT')
        return this.terminal.write('', {
          ctrl: true,
          name: 'c',
        });
      let [src, dest] = input.split(/\s*-\s*/);
      if (!src || !dest) console.log('Bad input, please try again\n');
      else {
        if (!this.graph.exists(src))
          console.log(`${src} is not a valid origin\n`);
        else if (!this.graph.exists(dest))
          console.log(`${dest} is not a valid destination\n`);
        else {
          try {
            const res = await this.graph.calculateBestRoute(src, dest);
            if (!res) console.log(`Route ${src}-${dest} is not available\n`);
            else
              console.log(
                `Best route: ${res.path.join(' - ')} > $${res.weight.toFixed(
                  2
                )}\n`
              );
          } catch (err) {
            console.log(`Sorry, an internal error occurred!`, err, '\n');
          }
        }
      }
      this.start();
    });
  }

  close() {
    this.terminal.close();
  }

  onInterrupt(callback) {
    this.terminal.once('SIGINT', callback);
    this.terminal.once('SIGTSTP', callback);
  }
};
