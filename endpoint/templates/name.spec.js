'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var <%= classedName %> = app.get('models').<%= classedName %>;

describe('GET <%= route %>', function() {

  <%= classedName %>
    .sync()
    .then(function() {
      return <%= classedName %>.destroy({ where: {} });
    })
    .then(function() {
      <%= classedName %>
        .create({
          title: "Title",
          info: "Info",
          active: true,
        })
        .then(function(){
          it('should respond with JSON array', function(done) {
            request(app)
              .get('<%= route %>')
              .expect(200)
              .expect('Content-Type', /json/)
              .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
              });
          });
        });
    });

});
