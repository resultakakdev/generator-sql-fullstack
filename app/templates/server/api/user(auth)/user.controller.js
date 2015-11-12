'use strict';

var passport = require('passport')
  , config = require('../../config/environment')
  , jwt = require('jsonwebtoken')
  ;

var validationError = function(res, err) {
  return res.status(422).json(err);
};

function User(req){
  return req.app.get('models').User;
}
/**
 * Fetch all users available
 * @param  {Object} req - request obj
 * @param  {Object} res - response obj
 * @return {Object}     - Return fetched users
 */
exports.index = function(req, res) {
  User(req)
    .find({
      attributes: [ '_id', 'username', 'email', 'role' ]
    })
    .then(function(users) {
      res.status(200).json(users);
    })
    .catch(function(err){
      if(err) return res.status(500).send(err);
    });
};
/**
 * Creates a new user from the data provided
 * @param  {Object}   req  - req obj: User properties
 * @param  {Object}   res  - res obj
 * @param  {Function} next [description]
 * @return {Object}        - Returns the newly created user
 */
exports.create = function (req, res, next) {
  req.body.provider = 'local';
  req.body.role = 'user';

  User(req)
    .create(req.body)
    .then(function(user) {
      var token = jwt.sign({_id: user.id }, config.secrets.session, { expiresInMinutes: 60*5 });
      res.status(201).json({ token: token, user: user });
    })
    .catch(function(err){
      if (err) return validationError(res, err);
    });
};
/**
 * Fetch a user based on an id provided
 * @param  {Object}   req  - req obj: params: id
 * @param  {Object}   res  - res obj
 * @param  {Function} next [description]
 * @return {Object}        - Returns the user fetched by the id provided
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User(req)
    .findById(userId)
    .then(function(user) {
      if (!user) return res.status(401).send('Unauthorized');
      res.status(200).json(user.profile);
    })
    .catch(function(err){
      if (err) return next(err);
    });
};
/**
 * Destroys an instance of the user fetched by query
 * @param  {Object} req - req obj: query
 * @param  {Object} res - res obj
 * @return {Object}     - Returns status for deletion
 */
exports.destroy = function(req, res) {
  User(req)
    .destroy(req.query)
    .then(function(user) {
      return res.status(204).send('No Content');
    })
    .catch(function(err){
      if(err) return res.status(500).send(err);
    });
};
/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User(req).findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};
/**
 * Fetches the currently logged in user
 * @param  {Object}   req  - req obj
 * @param  {Object}   res  - res obj
 * @param  {Function} next [description]
 * @return {Object}        - Returns the fetched user in session
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User(req)
    .findOne({
      where: { _id: userId },
      attributes: [ '_id', 'username', 'email', 'role' ]
    })
    .then(function(user) {
      if(!user) { return res.status(401).end(); }
      res.status(200).json(user);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
