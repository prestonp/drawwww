
/*
 * GET home page.
 */

var redis = require('redis')
  , db = redis.createClient();

exports.index = function(req, res){
  db.set('test', 'bloopzoop');
  res.render('index', { title: 'Express' });
};
