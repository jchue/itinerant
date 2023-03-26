class HTTPError extends Error {
  constructor(code = 500, ...params) {
    super(...params);
    this.code = code;
    this.name = 'HTTPError';
  }

}

export default HTTPError;