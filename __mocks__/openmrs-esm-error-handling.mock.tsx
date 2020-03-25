export function createErrorHandler() {
  return function errorHandler(err) {
    // eslint-disable-next-line no-console
    console.log(`Received error ${err}`);
  };
}
