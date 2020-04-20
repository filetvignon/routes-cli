const path = require('path');
const { Worker } = require('worker_threads');
const os = require('os');

module.exports = class WorkerPool {
  constructor(workerPath, opts = {}) {
    let { minThreads = 1, maxThreads } = opts;

    const cpus = os.cpus().length;
    if (minThreads < 1) minThreads = 1;
    if (!maxThreads) maxThreads = cpus;

    if (maxThreads <= minThreads) this.numThreads = minThreads;
    else if (maxThreads <= cpus) this.numThreads = maxThreads;
    else this.numThreads = cpus;

    console.log(this.numThreads);

    this.workers = [];
    this.workersIdle = [];
    this.queue = [];

    for (let i = 0; i < this.numThreads; i++) {
      this.workers[i] = new Worker(path.join(__dirname, workerPath));
      this.workersIdle[i] = true;
    }

    console.log(this);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
    this.workers.length = 0;
    this.workersIdle.length = 0;
    this.queue.length = 0;
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const queueItem = {
        task,
        callback: (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        },
      };

      const availableWorkerId = this.workersIdle.indexOf(true);
      if (availableWorkerId < 0) this.queue.push(queueItem);
      else this.runWorker(availableWorkerId, queueItem);
    });
  }

  runWorker(workerId, queueItem) {
    console.log(workerId);
    const worker = this.workers[workerId];
    this.workersIdle[workerId] = false;

    worker.once('message', (result) => {
      queueItem.callback(null, result);
      worker.removeAllListeners('message');
      worker.removeAllListeners('error');
      this.workersIdle[workerId] = true;
      console.log(this.queue.length);
      if (!this.queue.length) {
        return null;
      }
      this.runWorker(workerId, this.queue.shift());
    });

    worker.once('error', (err) => {
      queueItem.callback(err);
      worker.removeAllListeners('message');
      worker.removeAllListeners('error');
      this.workersIdle[workerId] = true;
      if (!this.queue.length) {
        return null;
      }
      this.runWorker(workerId, this.queue.shift());
    });

    worker.postMessage(queueItem.task);
  }
};
