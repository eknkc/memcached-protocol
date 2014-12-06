var Transform = require('stream').Transform;
var Reader = require("./reader.js");
var Writer = require("./writer.js");
var util = require('util');

util.inherits(ReaderStream, Transform);
util.inherits(WriterStream, Transform);

function ReaderStream() {
  if (!(this instanceof ReaderStream))
    return new ReaderStream();

  Transform.call(this);
  this._readableState.objectMode = true;

  this.reader = new Reader();
}

ReaderStream.prototype._transform = function(chunk, encoding, done) {
  var packs = this.reader.read(chunk);
  for (var i = 0; i < packs.length; i++) {
    this.push(packs[i]);
  };
  done();
};

function WriterStream() {
  if (!(this instanceof WriterStream))
    return new WriterStream();

  Transform.call(this);
  this._writableState.objectMode = true;

  this.writer = new Writer();
}

WriterStream.prototype._transform = function(chunk, _, done) {
  var pack = this.writer.write(chunk);
  this.push(pack);
  done();
};

module.exports.ReaderStream = ReaderStream;
module.exports.WriterStream = WriterStream;
