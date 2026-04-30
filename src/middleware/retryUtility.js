const defaultInitialBackoff = 1000; // 1 second
const defaultMaxBackoff = 30000; // 30 seconds
const defaultMaxRetries = 3;

/**
 * Sleep for the given milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * RetryUtility class for retrying async operations with exponential backoff and jitter
 */
class RetryUtility {
  /**
   *
   * @param {Object} options
   * @param {number} options.initialBackoff initial backoff in ms
   * @param {number} options.maxBackoff max backoff in ms
   * @param {number} options.maxRetries max retry attempts
   * @param {(error: any) => boolean} options.retryCondition function to determine if error is retryable
   * @param {(msg: string, meta?: Object) => void} options.logger logging function
   * @param {() => string} options.correlationIdProvider function to get current correlation ID
   */
  constructor({
    initialBackoff = defaultInitialBackoff,
    maxBackoff = defaultMaxBackoff,
    maxRetries = defaultMaxRetries,
    retryCondition = () => true,
    logger = console.warn,
    correlationIdProvider = () => null,
  } = {}) {
    this.initialBackoff = initialBackoff;
    this.maxBackoff = maxBackoff;
    this.maxRetries = maxRetries;
    this.retryCondition = retryCondition;
    this.logger = logger;
    this.correlationIdProvider = correlationIdProvider;
  }

  /**
   * Execute the async operation with retry logic
   * @param {() => Promise<any>} operation async function to retry
   * @returns {Promise<any>} result of the operation
   * @throws error if all retries fail or error is not retryable
   */
  async executeWithRetry(operation) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (!this.retryCondition(error)) {
          throw error;
        }
        if (attempt === this.maxRetries) {
          throw error;
        }
        const backoff = this.calculateBackoffWithJitter(attempt);
        const correlationId = this.correlationIdProvider();
        const logMessage = `Attempt ${attempt} failed. Retrying in ${backoff}ms. Error: ${error.message || error}`;
        if (correlationId) {
          this.logger(`${logMessage} CorrelationId: ${correlationId}`);
        } else {
          this.logger(logMessage);
        }
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
