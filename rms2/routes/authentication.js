var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongo = require('mongodb');
var session = require('express-session');



router.post('/signup', userExist, function(req,res) {
    var db = req.db;
    var user = req.body.user;
    var password = req.body.pass; 
    req.body.pass= saltAndHash(password, function(hash){
            password = hash;
            
    });

    db.collection('authenticationlist').insert({user:user,pass:password}, function(err, result){
        
        if(!err)
            res.json(result);
        else
            res.json(err, 500);
    });
});


  
/*
 *authenticate username and password
 */


router.post('/login', function(req,res){
    var db = req.db;
    var user = req.body.user;
    var pass = req.body.pass;

    db.collection('authenticationlist').findOne({user:user}, function(e, o){
      if (o == null){
        res.json('user not found', 401);
      } else{
        validatePassword(pass, o.pass, function(err, result) {
          if (result){
            req.session.user = o; 
            delete o['pass'];
            res.json(o);
          }else{
              res.send(401);
          }
        });
      }
    });
});

/*
 *logout 
 */
router.get('/logout', function(req, res){
 
  req.session.user = null;
  res.json('ok');
   
});

router.get('/profile', function (req, res) {
    res.json(req.session.user);
});


/* private encryption & validation methods */

var generateSalt = function()
{
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++) {
    var p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
}

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  callback(null, hashedPass === validHash);

}


function userExist(req, res, next) {
  var db = req.db;
    db.collection('authenticationlist').count({
        user: req.body.user
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {

            res.json('User Exists',500);
            
        }
    });
}


/*/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('authenticationlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('authenticationlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('authenticationlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
