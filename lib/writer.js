var header = require("./header.js");

function Writer() {
  if (!(this instanceof Writer))
    return new Writer();

  this.keyBuffer = new Buffer(255);
  this.extrasBuffer = new Buffer(24);
}

Writer.prototype.write = function(pack) {
  var key = packKey(this.keyBuffer, pack.key)
    , value = packValue(pack.value)
    , op = header.op(pack.opcode)
    , extras = packExtras(this.extrasBuffer, pack.extras, op.extras || [])
    , opaque = pack.opaque || 0
    , cas = pack.cas || 0
    , status = pack.status || 0
    , hdr = new Buffer(24 + key + extras + value.length)
    , bodyLen = key + value.length + extras

  hdr.writeUInt8(header.MAGIC, 0);
  hdr.writeUInt8(op.code, 1);
  hdr.writeUInt16BE(key, 2);
  hdr.writeUInt8(extras, 4);
  hdr.writeUInt8(0, 5);
  hdr.writeUInt16BE(status, 6);
  hdr.writeUInt32BE(bodyLen, 8);
  hdr.writeUInt32BE(opaque, 12);

  if (cas)
    hdr.write(cas, 16, 8, 'hex')
  else
    hdr.fill("\0", 16, 24);

  this.extrasBuffer.copy(hdr, 24, 0, extras);
  this.keyBuffer.copy(hdr, 24 + extras, 0, key);
  value.copy(hdr, 24 + extras + key, 0);

  return hdr;
};

function packKey(b, key) {
  if (typeof key == 'undefined')
    throw new Error("key not supplied.");

  key = String(key);
  var len = Buffer.byteLength(key);

  if (len > 255)
    throw new Error("key can not be larger than 255 bytes.");

  b.write(key, 0, len);
  return len;
}

function packValue(value) {
  if (typeof value == 'undefined')
    return new Buffer(0);

  if (Buffer.isBuffer(value))
    return value;

  return new Buffer(String(value));
}

function packExtras(b, value, keys) {
  if (typeof value == 'undefined')
    return 0;

  var index = 0

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
        index += 8;
        break;
      }
    }
  };

  return index;
}

module.exports = Writer;
