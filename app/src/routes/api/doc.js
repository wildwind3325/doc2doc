var express = require('express');
var http = require('../../api/http');

var parseResponse = (data, list) => {
  for (let i = 0; i < data.data.node_list.length; i++) {
    let token = data.data.node_list[i];
    let node = data.data.entities.nodes[token];
    list.push({
      token: token,
      name: node.name,
      type: node.type,
      obj_token: node.obj_token
    });
  }
  return {
    has_more: data.data.has_more,
    last_label: data.data.last_label
  };
};

var router = express.Router();

router.post('/home', async function (req, res, next) {
  try {
    let response = await http.request({
      method: 'GET',
      url: 'https://kwh0jtf778.feishu.cn/space/api/explorer/folder/children/?type=0&asc=1&rank=5',
      headers: {
        'Cookie': 'session=' + req.body.session,
        'Referer': 'https://kwh0jtf778.feishu.cn/drive/me/'
      }
    });
    let data = JSON.parse(response.body);
    let list = [];
    parseResponse(data, list);
    let has_more = true;
    let last_label = '';
    while (has_more) {
      let url = 'https://kwh0jtf778.feishu.cn/space/api/explorer/my/object/list/?length=7&path_filter=true';
      if (last_label) {
        url += '&last_label=' + encodeURIComponent(last_label);
      }
      response = await http.request({
        method: 'GET',
        url: url,
        headers: {
          'Cookie': 'session=' + req.body.session,
          'Referer': 'https://kwh0jtf778.feishu.cn/drive/me/'
        }
      });
      data = JSON.parse(response.body);
      let result = parseResponse(data, list);
      has_more = result.has_more;
      last_label = result.last_label;
    }
    res.send({
      success: true,
      rows: list
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});

router.post('/folder', async function (req, res, next) {
  try {
    let list = [];
    let has_more = true;
    let last_label = '';
    while (has_more) {
      let url = 'https://kwh0jtf778.feishu.cn/space/api/explorer/folder/children/?length=34&asc=1&rank=5&token=' + req.body.token + '&need_path=1&show_no_perm=1';
      if (last_label) {
        url += '&last_label=' + encodeURIComponent(last_label);
      }
      let response = await http.request({
        method: 'GET',
        url: url,
        headers: {
          'Cookie': 'session=' + req.body.session,
          'Referer': 'https://kwh0jtf778.feishu.cn/drive/folder/' + req.body.token
        }
      });
      let data = JSON.parse(response.body);
      let result = parseResponse(data, list);
      has_more = result.has_more;
      last_label = result.last_label;
    }
    res.send({
      success: true,
      rows: list
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});

router.get('/download/file', async function (req, res, next) {
  try {
    let response = await http.request({
      method: 'GET',
      url: 'https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/' + req.query.token + '/',
      headers: {
        'Cookie': 'session=' + req.query.session,
        'Referer': 'https://kwh0jtf778.feishu.cn/'
      },
      encoding: null
    });
    res.attachment(req.query.filename).send(response.body);
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;