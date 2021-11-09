var request = require('request');

const worker = request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
  },
  followRedirect: false,
  rejectUnauthorized: false
});

var http = {
  request(options) {
    return new Promise((resolve, reject) => {
      worker(options, (error, response, body) => {
        resolve({
          error: error,
          response: response,
          body: body
        });
      });
    });
  }
};

module.exports = http;