var fs = require('fs');
var path = require('path');

var addRoutes = (app, root, dir) => {
  let list = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < list.length; i++) {
    if (list[i].isFile() && list[i].name.toLowerCase().endsWith('.js')) {
      let file = path.join(dir, list[i].name);
      file = file.substr(root.length + 1, file.length - root.length - 4).split(path.sep).join('/');
      app.use('/' + file, require('./routes/' + file));
    } else if (list[i].isDirectory()) {
      addRoutes(app, root, path.join(dir, list[i].name));
    }
  }
};

var router = app => {
  let root = path.join(__dirname, 'routes');
  addRoutes(app, root, root);
};

module.exports = router;