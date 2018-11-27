const Heap = require('heap');

/**
 * Priority queue.
 */
class HeapQueue {
    constructor() {
        this.max = 0;
        this.heap = new Heap((a, b) => {
            return a.priority - b.priority;
        });
    }
    /**
     * Check if queue is empty
     * @returns {boolean}
     */
    empty() {
        const length = this.heap.size();
        if (length > this.max) {
            this.max = length;
        }
        return this.heap.empty();
    }

    /**
     * Add to queue in priority order from lower to higher
     * @param {*} item - item to add
     * @param {number} priority - priority of item
     */
    push(item, priority) {
        this.heap.push({ priority, item });
    }

    /**
     * Get HeapQueue size
     * @returns {number} - size
     */
    size() {
        return this.heap.size();
    }

    /**
     * Get item from queue with lowest priority
     * @returns {*} - item
     */
    pop() {
        return this.heap.pop()['item'];
    }
}

module.exports = HeapQueue;
