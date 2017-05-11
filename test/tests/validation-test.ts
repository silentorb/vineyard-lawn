import * as assert from 'assert'
import {Server} from "../../source/server";

require('source-map-support').install()

const request_original = require('request').defaults({jar: true, json: true})

function request(options): Promise<any> {
  return new Promise(function (resolve, reject) {
    request_original(options, function (error, response, body) {
      const options2 = options
      if (error)
        reject(error)
      else if (response.statusCode != 200)
        reject(new Error(response.statusCode + " " + response.statusMessage))
      else
        resolve(body)
    })
  })
}

describe('is valid', function () {
  let server
  this.timeout(5000)

  function local_request(method, url, body?) {
    return request({
      url: "http://" + server.get_url() + '/' + url,
      method: method,
      body: body
    })
  }

  function login(username, password) {
    return local_request('post', 'user/login', {
      username: username,
      password: password
    })
  }

  before(function () {
    server = new Server()
    server.createEndpoints([
      {

      }
    ])
    return server.start()
      .then(() => {
        const db = server.get_db()
        return db.sync({force: true})
          .then(() => {
            return server.get_user_manager().create_user({username: 'froggy', password: 'test'})
          })
      })
  })

  after(function () {
    // return server.stop()
  })

  it('login_success', function () {
    return local_request('get', 'ping')
      .then(()=> login('froggy', 'test'))
      .then(function (user) {
        assert.equal('froggy', user.username)
        assert.equal(undefined, user.password)
        return server.user_manager.Session_Model.findAll()
          .then(result => {
            assert.equal(1, result.length)
            // assert.equal(1, result.dataValues.user)
          })
      })
      .then(function () {
        return request({
          url: "http://" + server.get_url() + '/user/logout',
          method: 'post'
        })
      })
      .then(function () {
        return server.user_manager.Session_Model.findOne()
          .then(result => {
            assert(result)
            assert.equal(null, result.dataValues.user)
          })
      })
  })

  it('login_bad_username', function () {
    return login('froggy2', 'test')
      .then(function (user) {
        assert(false)
      })
      .catch(function () {
        assert(true)
      })
  })

  it('login_bad_password', function () {
    return login('froggy', 'test2')
      .then(function (user) {
        assert(false)
      })
      .catch(function () {
        assert(true)
      })
  })

  it('2fa', function () {
    return local_request('get', 'user/2fa')
      .then(response => {
        console.log('response', response)
        const token = get_2fa_token_from_url(response.secret)
        return local_request('post', 'user/2fa', {token: token})
          .then(response => {
            assert(true)
          })
      })
  })

  it('register user with 2fa', function () {
    return local_request('get', 'user/2fa')
      .then(response => {
        console.log('response', response)
        const token = get_2fa_token_from_url(response.secret)

        const data = {
          username: 'wizard-thief',
          password: 'Steals Wizards',
          token: token
        }

        return local_request('post', 'user', data)
          .then(response => {
            assert(true)
          })
      })
  })
})