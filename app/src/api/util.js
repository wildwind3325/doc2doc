var crypto = require('crypto');

const aes_key = '754a5bdc7468bb1f', iv = '370284027734754a';

var util = {
  md5(str, code) {
    let md5 = crypto.createHash('md5');
    code = code || 'hex';
    return md5.update(str).digest(code);
  },
  sha1(str, code) {
    let sha1 = crypto.createHash('sha1');
    code = code || 'hex';
    return sha1.update(str).digest(code);
  },
  encrypt(str) {
    let cipher = crypto.createCipheriv('aes-128-cbc', aes_key, iv);
    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
  },
  decrypt(str) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', aes_key, iv);
    return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
  },
  wait(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve(); }, ms);
    });
  },
  getIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    if (!ip) return '';
    if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');
    return ip;
  },
  fileSize(len) {
    let range = 0;
    if (len > 0) {
      range = Math.min(4, Math.floor(Math.log10(len) / Math.log10(1024)));
    }
    let units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let temp = len;
    for (let i = 0; i < range; i++) {
      temp /= 1024;
    }
    let val = (Math.floor(temp * 100) / 100).toString();
    if (val.substr(val.length - 1) === '0') {
      val = val.substr(0, val.length - 1);
    }
    if (val.substr(val.length - 1) === '0') {
      val = val.substr(0, val.length - 1);
    }
    if (val.substr(val.length - 1) === '.') {
      val = val.substr(0, val.length - 1);
    }
    return val + ' ' + units[range];
  }
};

module.exports = util;