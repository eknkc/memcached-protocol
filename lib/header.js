module.exports.MAGIC = 0x80;

var statusCodes = [
  { code: 0x0000, key: "NO_ERROR", message: "No Error" },
  { code: 0x0001, key: "KEY_NOT_FOUND", message: "Key not found" },
  { code: 0x0002, key: "KEY_EXISTS", message: "Key exists" },
  { code: 0x0003, key: "VALUE_TOO_LARGE", message: "Value too large" },
  { code: 0x0004, key: "INVALID_ARGUMENTS", message: "Invalid arguments" },
  { code: 0x0005, key: "ITEM_NOT_STORED", message: "Item not stored" },
  { code: 0x0006, key: "INCR_DECR_ON_NON_NUMERIC", message: "Incr/Decr on non-numeric value" },
  { code: 0x0081, key: "UNKNOWN_COMMAND", message: "Unknown command" },
  { code: 0x0082, key: "OUT_OF_MEMORY", message: "Out of memory" },
];

var opCodes = [
  { code: 0x00, key: "GET" },
  { code: 0x01, key: "SET", extras: ['flags', 'expiry'] },
  { code: 0x02, key: "ADD", extras: ['flags', 'expiry'] },
  { code: 0x03, key: "REPLACE", extras: ['flags', 'expiry'] },
  { code: 0x04, key: "DELETE" },
  { code: 0x05, key: "INCREMENT", extras: ['delta', 'initial', 'expiry'] },
  { code: 0x06, key: "DECREMENT", extras: ['delta', 'initial', 'expiry'] },
  { code: 0x07, key: "QUIT" },
  { code: 0x08, key: "FLUSH", extras: ['expiry'] },
  { code: 0x09, key: "GETQ" },
  { code: 0x0A, key: "NOOP" },
  { code: 0x0B, key: "VERSION" },
  { code: 0x0C, key: "GETK" },
  { code: 0x0D, key: "GETKQ" },
  { code: 0x0E, key: "APPEND" },
  { code: 0x0F, key: "PREPEND" },
  { code: 0x10, key: "STAT" },
  { code: 0x11, key: "SETQ", extras: ['flags', 'expiry'] },
  { code: 0x12, key: "ADDQ", extras: ['flags', 'expiry'] },
  { code: 0x13, key: "REPLACEQ", extras: ['flags', 'expiry'] },
  { code: 0x14, key: "DELETEQ" },
  { code: 0x15, key: "INCREMENTQ", extras: ['delta', 'initial', 'expiry'] },
  { code: 0x16, key: "DECREMENTQ", extras: ['delta', 'initial', 'expiry'] },
  { code: 0x17, key: "QUITQ" },
  { code: 0x18, key: "FLUSHQ", extras: ['expiry'] },
  { code: 0x19, key: "APPENDQ" },
  { code: 0x1A, key: "PREPENDQ" },
];

module.exports.statusCodes = {};
module.exports.statusKeys = {};
module.exports.opCodes = {};
module.exports.opKeys = {};

statusCodes.forEach(function (sc) {
  module.exports.statusCodes[sc.code] = module.exports.statusKeys[sc.key] = sc;
});

opCodes.forEach(function (oc) {
  module.exports.opCodes[oc.code] = module.exports.opKeys[oc.key] = oc;
});

module.exports.op = function(inp) {
  return module.exports.opCodes[inp] || module.exports.opKeys[inp] || null;
}

module.exports.status = function(inp) {
  return module.exports.statusCodes[inp] || module.exports.statusKeys[inp] || null;
}
