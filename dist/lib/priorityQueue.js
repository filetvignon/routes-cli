module.exports = class PriorityQueue {
  constructor() {
    this.nodes_ = [];
  }

  get length() {
    return this.nodes_.length;
  }

  enqueue(priority, value) {
    const node = new Node(priority, value);
    const nodes = this.nodes_;
    nodes.push(node);
    this.moveUp_(nodes.length - 1);
  }

  dequeue() {
    const nodes = this.nodes_;
    const count = nodes.length;
    const rootNode = nodes[0];
    if (count <= 0) {
      return undefined;
    } else if (count == 1) {
      nodes.length = 0;
    } else {
      nodes[0] = nodes.pop();
      this.moveDown_(0);
    }
    return rootNode.getValue();
  }

  moveUp_(index) {
    const nodes = this.nodes_;
    const node = nodes[index];

    // While the node being moved up is not at the root.
    while (index > 0) {
      // If the parent is less than the node being moved up, move the parent down.
      const parentIndex = this.getParentIndex_(index);
      if (nodes[parentIndex].getKey() > node.getKey()) {
        nodes[index] = nodes[parentIndex];
        index = parentIndex;
      } else {
        break;
      }
    }
    nodes[index] = node;
  }

  moveDown_(index) {
    const nodes = this.nodes_;
    const count = nodes.length;

    // Save the node being moved down.
    const node = nodes[index];
    // While the current node has a child.
    while (index < count >> 1) {
      const leftChildIndex = this.getLeftChildIndex_(index);
      const rightChildIndex = this.getRightChildIndex_(index);

      // Determine the index of the smaller child.
      const smallerChildIndex =
        rightChildIndex < count &&
        nodes[rightChildIndex].getKey() < nodes[leftChildIndex].getKey()
          ? rightChildIndex
          : leftChildIndex;

      // If the node being moved down is smaller than its children, the node
      // has found the correct index it should be at.
      if (nodes[smallerChildIndex].getKey() > node.getKey()) {
        break;
      }

      // If not, then take the smaller child as the current node.
      nodes[index] = nodes[smallerChildIndex];
      index = smallerChildIndex;
    }
    nodes[index] = node;
  }

  isEmpty() {
    return this.nodes_.length === 0;
  }

  clear() {
    this.nodes_.length = 0;
  }

  getParentIndex_(index) {
    return (index - 1) >> 1;
  }

  getLeftChildIndex_(index) {
    return index * 2 + 1;
  }

  getRightChildIndex_(index) {
    return index * 2 + 2;
  }
};

class Node {
  constructor(key, value) {
    this.key_ = key;
    this.value_ = value;
  }

  getKey() {
    return this.key_;
  }

  getValue() {
    return this.value_;
  }

  clone() {
    return new Node(this.key_, this.value_);
  }
}
