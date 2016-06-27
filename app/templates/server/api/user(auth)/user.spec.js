'use strict';

var should = require('should');
var app = require('../../app');
var User = require('../').User;

var user;

var genUser = function() {
  user = User.build({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function(done) {
    genUser();
    done();
  });

  afterEach(function() {
    return User.destroy({ where: {} });
  });

  it('should begin with no users', function(done) {
    return User
      .findAll({ where: {} })
      .then(function(users) {
        console.log("------------------------------------------------------");
        users.should.have.length(0);
        done();
      })
      .catch(function(err){
        console.log(err, '-------------------------------');
      });
  });

  it('should fail when saving a duplicate user', function(done) {
    var newUser = genUser();
    newUser.save().catch(function(err){
      should.exist(err);
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save()
      .catch(function(err){
        should.exist(err);
        done();
      });
  });

  it("should authenticate user if password is valid", function(done) {
    User
      .create(user)
      .then(function(userInstance){
        var check = userInstance.authenticate('password');
        check.should.be.true; // jshint ignore:line
        done();
      });
  });

  it("should not authenticate user if password is invalid", function(done) {
    User
      .create(user)
      .then(function(userInstance){
        var check = userInstance.authenticate('blah');
        check.should.not.be.true; // jshint ignore:line
        done();
      });
  });
});
