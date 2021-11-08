var request = require('request');

const worker = request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
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