var reader = require("../index.js").Reader();
var writer = require("../index.js").Writer();

suite('basic', function() {
  var p;

  before(function () {
    p = writer.write({
      key: 'testkey',
      opcode: 'SET',
      value: 'value',
      extras: { expiry: 100 }
    });
  });

  bench('read', function () {
    reader.read(p);
  });

  bench('write', function () {
    writer.write({
      key: 'testkey',
      opcode: 'SET',
      value: 'value',
      extras: { expiry: 100 }
    });
  });

  bench('readwrite', function () {
    reader.read(writer.write({
      key: 'testkey',
      opcode: 'SET',
      value: 'value',
      extras: { expiry: 100 }
    }));
  });
});
