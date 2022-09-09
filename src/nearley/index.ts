const nearley = require("nearley");
const grammar = require("./test.js");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed(`array Uint8 [byte; 1];\nvector Bytes <byte>;\noption BytesOpt (Bytes);\n
union PingPayload {
  Ping,
  Pong,
}
struct OutPoint {
  tx_hash:        Byte32,
  index:          Uint32,
}
table OutPoint {
  tx_hash:        Byte32,
  index:          Uint32,
}
`);

// parser.results is an array of possible parsings.
console.log(JSON.stringify(parser.results)); // [[[[["foo"],"\n"]]]]
