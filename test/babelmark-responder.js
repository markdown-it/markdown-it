'use strict';


describe('babelmark responder app', function () {
  var app;

  var PORT    = 5005;
  var request = require('supertest')('http://127.0.0.1:' + PORT);

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  before(async () => {
    app = require('child_process').execFile(
      'node',
      [ '../support/babelmark-responder.js' ],
      {
        cwd: __dirname,
        env: Object.assign({}, process.env, { PORT: PORT })
      }
    );

    // Wait until app bind port
    for (let i = 0; i < 50; i++) {
      try {
        await request.get('/').expect(200);
        break;
      } catch (e) {}
      await timeout(100);
    }
  });


  it('ping root', () => {
    return request
      .get('/')
      .expect(200)
      .expect(/<!DOCTYPE html>/i);
  });


  it('do request', () => {
    return request
      .get('/?text=foo')
      .expect(200)
      .expect({
        html: '<p>foo</p>\n',
        name: 'markdown-it',
        version: require('../package.json').version
      });
  });


  after(() => {
    if (app) app.kill();
  });
});
