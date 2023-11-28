import supertest from 'supertest'
import { execFile } from 'child_process'
import { readFileSync } from 'fs'
import { setTimeout as sleep } from 'node:timers/promises'


describe('babelmark responder app', function () {
  let app

  const PORT    = 5005
  const request = supertest('http://127.0.0.1:' + PORT)

  before(async () => {
    app = execFile(
      'node',
      [ '../support/babelmark-responder.mjs' ],
      {
        cwd: new URL('.', import.meta.url),
        env: Object.assign({}, process.env, { PORT: PORT })
      }
    )

    // Wait until app bind port
    for (let i = 0; i < 50; i++) {
      try {
        await request.get('/').expect(200)
        break
      } catch (e) {}
      await sleep(100)
    }
  })


  it('ping root', () => {
    return request
      .get('/')
      .expect(200)
      .expect(/<!DOCTYPE html>/i)
  })


  it('do request', () => {
    const version = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version

    return request
      .get('/?text=foo')
      .expect(200)
      .expect({
        html: '<p>foo</p>\n',
        name: 'markdown-it',
        version
      })
  })


  after(() => {
    if (app) app.kill()
  })
})
