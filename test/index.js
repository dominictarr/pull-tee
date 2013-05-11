
var test = require('tape')
var pull = require('pull-stream')
var tee  = require('../')

test('tee', function (t) {
  var a, b

  pull.values([1, 2, 3, 4, 5])
  .pipe(tee(pull.collect(function (err, _a) {
    a = _a
    if(b && a) next()
  })))
  .pipe(pull.collect(function (err, _b) {
    b = _b
    if(b && a) next()
  }))

  function next () {
    t.deepEqual(a, b)
    t.end()
  }
})

function randAsync () {
  return pull.asyncMap(function (data, cb) {
    setTimeout(function () {
      cb(null, data)
    }, Math.random()*20)
  })
}

test('tee-async', function (t) {
  var a, b

  pull.values([1, 2, 3, 4, 5])
  .pipe(tee(randAsync().pipe(pull.collect(function (err, _a) {
    a = _a
    if(b && a) next()
  })))
  .pipe(randAsync())
  .pipe(pull.collect(function (err, _b) {
    b = _b
    if(b && a) next()
  })))

  function next () {
    t.deepEqual(a, b)
    t.end()
  }
})

