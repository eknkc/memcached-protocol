var header = require("./header.js");

function Writer() {
  if (!(this instanceof Writer))
    return new Writer();
}

Writer.prototype.write = function(pack) {
  var key = packKey(pack.key)
    , value = packValue(pack.value)
    , op = header.op(pack.opcode)
    , extras = packExtras(pack.extras, op.extras || [])
    , opaque = pack.opaque || 0
    , cas = pack.cas || "0000000000000000"
    , status = pack.status || 0
    , hdr = new Buffer(24)
    , bodyLen = key.length + value.length + extras.length

  hdr.writeUInt8(header.MAGIC, 0);
  hdr.writeUInt8(op.code, 1);
  hdr.writeUInt16BE(key.length, 2);
  hdr.writeUInt8(extras.length, 4);
  hdr.writeUInt8(0, 5);
  hdr.writeUInt16BE(status, 6);
  hdr.writeUInt32BE(bodyLen, 8);
  hdr.writeUInt32BE(opaque, 12);
  hdr.write(cas, 16, 8, 'hex')

  return Buffer.concat([hdr, extras, key, value], hdr.length + bodyLen);
};

function packKey(key) {
  if (typeof key == 'undefined')
    throw new Error("key not supplied.");

  key = String(key);
  var len = Buffer.byteLength(key);

  if (len > 255)
    throw new Error("key can not be larger than 255 bytes.");

  var b = new Buffer(len);
  b.write(key, 0, len);
  return b;
}

function packValue(value) {
  if (typeof value == 'undefined')
    return new Buffer(0);

  if (Buffer.isBuffer(value))
    return value;

  return new Buffer(String(value));
}

function packExtras(value, keys) {
  if (typeof value == 'undefined')
    return new Buffer(0);

  var b = new Buffer(24)
    , index = 0

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    switch(key) {
      case 'flags': {
        b.writeUInt32BE(value.flags || 0, index);
        index += 4;
        break;
      }
      case 'expiry': {
        b.writeUInt32BE(value.expiry, index);
        index += 4;
        break;
      }
      case 'delta': {
        b.writeUInt32BE(0, index);
        b.writeUInt32BE(value.delta || 0, index + 4);
        index += 8;
        break;
      }
      case 'initial': {
        b.writeUInt32BE(0, index);
        b.writeUInt32BE(value.initial || 0, index + 4);
        break;
      }
    }
  };

  return b.slice(0, index);
}

module.exports = Writer;
