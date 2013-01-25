var redis = require('redis')
  , client = redis.createClient()
  , fs = require('fs');

exports.list = function(req, res) {
  var list = []
  client.lrange('mylist', 0, 100, function(err, vals) {
    vals.forEach(function (val, i) {
      list.push(val)  
    });

    client.ltrim('mylist', 0, 100)
    res.send(list)
  })
}

exports.view = function(req, res) {
  var key = 'id:' + req.params.id
  client.get(key, function(err, val) {
    var fixedPath = '../' + val; // saved path is relative to app.js location
    res.render('image', { id: req.params.id, path: fixedPath });
  })
}

exports.create = function(req, res) {
  
  client.incr('nextid', function(err, id) {
    var path = './files/' + id + '.png';
    var base64Img = req.body.img.replace(/^data:image\/png;base64,/,"");
    fs.writeFile(path, base64Img, 'base64', function(err) {
      // success func
      if(err != null)
        console.log('Error on saving file: ' + err);
    });

    // Store list of keys and set ids->file pair
    client.lpush('mylist', id);
    client.set('id:'+id, path);
    res.send(id.toString());
  });
}

exports.remove = function(req, res) {
  client.del('mylist');
  res.send('Deleted records');
}
