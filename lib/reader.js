var header = require("./header.js");

function Reader() {
  if (!(this instanceof Reader))
    return new Reader();

  this.buffers = [];
  this.length = 0;
}

Reader.prototype.read = function(buffer) {
  if (!Buffer.isBuffer(buffer))
    throw new Error("supply buffer instances to Reader.read method");

  if (!buffer.length)
    return [];

  this.buffers.push(buffer);
  this.length += buffer.length;

  var packets = [];
  while(true) {
    var p = this._read();

    if (p)
      packets.push(p);
    else
      break;
  }
  return packets;
};

Reader.prototype.reset = function() {
  this.buffers = [];
  this.length = 0;
  this._parsedHeader = null;
};

Reader.prototype._read = function() {
  if (!this._parsedHeader) {
    var buffer = this._consume(24);

    if (!buffer)
      return;

    this._parsedHeader = {
      magic: buffer.readUInt8(0),
      opCode: buffer.readUInt8(1),
      key: buffer.readUInt16BE(2),
      extras: buffer.readUInt8(4),
      datatype: buffer.readUInt8(5),
      statusCode: buffer.readUInt16BE(6),
      body: buffer.readUInt32BE(8),
      opaque: buffer.readUInt32BE(12),
      cas: buffer.toString('hex', 16, 24)
    };
  }

  var hdr = this._parsedHeader;
  var body = this._consume(hdr.body);

  if (!body)
    return;

  this._parsedHeader = null;

  return {
    key: body.slice(hdr.extras, hdr.extras + hdr.key).toString('utf8'),
    extras: this._readExtras(body.slice(0, hdr.extras)),
    value: body.slice(hdr.extras + hdr.key),
    opcode: hdr.opCode,
    op: header.op(hdr.opCode),
    statuscode: hdr.statusCode,
    status: header.status(hdr.statusCode),
    opaque: hdr.opaque,
    cas: hdr.cas
  }
};

Reader.prototype._readExtras = function(buffer) {
  if (buffer.length < 4)
    return {};

  return {
    flags: buffer.readUInt32BE(0)
  };
};

Reader.prototype._getbuffer = function() {
  if (!this.buffers.length)
    return new Buffer(0);

  if (this.buffers.length > 1)
    this.buffers = [Buffer.concat(this.buffers, this.length)];

  return this.buffers[0];
};

Reader.prototype._consume = function(n) {
  if (n > this.length)
    return null;

  var buffer = this._getbuffer();

  if (n == buffer.length) {
    this.length = 0;
    this.buffers = [];
    return buffer;
  }

  var targbuffer = new Buffer(buffer.length - n);
  buffer.copy(targbuffer, 0, n);
  this.buffers = [targbuffer];
  this.length = targbuffer.length;
  return buffer.slice(0, n);
};

module.exports = Reader;
