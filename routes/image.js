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
  var idKey = 'id:' + req.params.id
  var titleKey = idKey + ':title'
  var userKey = idKey + ':user'

  client.get(idKey, function(err, _path) {
    if(err != null)    
      console.log('error on retrieving id key: ' + err);
    
    var fixedPath = '../' + _path; // saved path is relative to app.js location
    client.get(titleKey, function(err, _title) {
      if(err != null)
        console.log('error on retrieving title key: ' + err);
      client.get(userKey, function(err, _user) {
        if(err != null)
          console.log('error on retrieving user key: ' + err);
        console.log('accessed ' + _path + ', title: ' + _title + ', user: ' + _user)
        _path = 'drawwww.com' + _path.substring(1)
        res.render('image', { id: req.params.id, path: fixedPath, title: _title, user: _user, directPath: _path });
      })
    })
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
    console.log('saving, user: ' + req.body.user + ', title: ' + req.body.title);
    // Store list of keys and set ids->file pair
    client.lpush('mylist', id);
    client.set('id:'+id, path);
    client.set('id:'+id+':user', req.body.user);
    client.set('id:'+id+':title', req.body.title);
    res.send(id.toString());
  });
}

exports.remove = function(req, res) {
  client.del('mylist');
  res.send('Deleted records');
}
