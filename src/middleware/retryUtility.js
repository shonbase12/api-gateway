const defaultInitialBackoff = 1000; // 1 second
const defaultMaxBackoff = 30000; // 30 seconds
const defaultMaxRetries = 3;
const defaultTimeout = 60000; // 60 seconds overall timeout

/**
 * Sleep for the given milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Promise that rejects after the given timeout
 * @param {number} ms
 * @returns {Promise<never>}
 */
function timeoutReject(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), ms));
}

/**
 * RetryUtility class for retrying async operations with exponential backoff and jitter with timeout
 */
class RetryUtility {
  /**
   *
   * @param {Object} options
   * @param {number} options.initialBackoff initial backoff in ms
   * @param {number} options.maxBackoff max backoff in ms
   * @param {number} options.maxRetries max retry attempts
   * @param {number} options.timeout max total time in ms before giving up
   * @param {(error: any) => boolean} options.retryCondition function to determine if error is retryable
   */
  constructor({
    initialBackoff = defaultInitialBackoff,
    maxBackoff = defaultMaxBackoff,
    maxRetries = defaultMaxRetries,
    timeout = defaultTimeout,
    retryCondition = () => true,
  } = {}) {
    this.initialBackoff = initialBackoff;
    this.maxBackoff = maxBackoff;
    this.maxRetries = maxRetries;
    this.timeout = timeout;
    this.retryCondition = retryCondition;
  }

  /**
   * Execute the async operation with retry logic and timeout
   * @param {() => Promise<any>} operation async function to retry
   * @returns {Promise<any>} result of the operation
   * @throws error if all retries fail or error is not retryable or timeout expires
   */
  async executeWithRetry(operation) {
    const startTime = Date.now();
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > this.timeout) {
        throw new Error('Operation timed out');
      }
      try {
        return await Promise.race([operation(), timeoutReject(this.timeout - elapsedTime)]);
      } catch (error) {
        if (!this.retryCondition(error)) {
          throw error;
        }
        if (attempt === this.maxRetries) {
          throw error;
        }
        const backoff = this.calculateBackoffWithJitter(attempt);
        console.warn(`Attempt ${attempt} failed. Retrying in ${backoff}ms. Error: ${error.message || error}`);
        await sleep(backoff);
      }
    }
  }

  calculateBackoffWithJitter(attempt) {
    const expBackoff = this.initialBackoff * Math.pow(2, attempt - 1);
    const cappedBackoff = Math.min(expBackoff, this.maxBackoff);
    return Math.random() * cappedBackoff;
  }
}

module.exports = RetryUtility;
