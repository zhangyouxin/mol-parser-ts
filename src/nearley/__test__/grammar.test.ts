import { createParser } from "../";

describe("test codec", () => {
  it("should codec omnilock", async () => {
    const parser = createParser()
    const result = parser.parse(`
    // The \`UintN\` is used to store a \`N\` bits unsigned integer
    // as a byte array in little endian.
    /* das */
    /*d 
    */
    
    array Uint8 [byte; 1]; // sdfasd
    array Uint32 [byte; 4]; // sdfasd
    array Ping [byte; 4]; // sdfasd
    
    vector Bytes <byte>;
    array Byte32 [byte; 4]; // sdfasd
    
    option BytesOpt (Bytes);
    option Pong (Bytes);
    
    union PingPayload {
      Ping,  /* sdfasdadasd
      
      asdas */
      Pong,
    }
    struct OutPointStruct {
      tx_hash:        Byte32,
      index:          Uint32,
    }
    table OutPointTable {
      tx_hash:        Bytes, // sdfasd
      index:          Uint32, // sdfasd
    }
    `);
  }
}
