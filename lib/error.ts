class HTTPError extends Error {
  code: number;

  constructor(code = 500, ...params: any[]) {
    super(...params);
    this.code = code;
    this.name = 'HTTPError';
  }

}

export default HTTPError;