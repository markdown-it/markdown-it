'use strict';


describe('babelmark responder app', function () {
  var app;

  var PORT    = 5005;
  var request = require('supertest')('http://127.0.0.1:' + PORT);


  before(function (done) {
    app = require('child_process').execFile(
      'node',
      [ '../support/babelmark-responder.js' ],
      {
        cwd: __dirname,
        env: Object.assign({}, process.env, { PORT: PORT })
      }
    );

    // Wait a bit until app bind port
    setTimeout(done, 1000);
  });


  it('ping root', function () {
    return request
      .get('/')
      .expect(200)
      .expect(/<!DOCTYPE html>/i);
  });


  it('do request', function () {
    return request
      .get('/?text=foo')
      .expect(200)
      .expect({
        html: '<p>foo</p>\n',
        name: 'markdown-it',
        version: require('../package.json').version
      });
  });


  after(function () {
    if (app) app.kill();
  });
});
