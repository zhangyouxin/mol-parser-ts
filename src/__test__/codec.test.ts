import { toMolTypeMap } from "./../utils";
import { MolType } from "./../type";
import { createCodecMap } from "../codec";

describe("test codec", () => {
  it("should pack sample", () => {
    const ast: MolType[] = [
      { item: "byte", item_count: 1, name: "Uint8", type: "array" },
    ];
    const codecMap = createCodecMap(toMolTypeMap(ast));
    expect(codecMap.get("Uint8")!.unpack("0x01")).toEqual("0x01");
    expect(codecMap.get("Uint8")!.unpack("0xff")).toEqual("0xff");
  });
  it("should pack blockchain.mol", () => {
    // https://github.com/nervosnetwork/ckb/blob/5a7efe7a0b720de79ff3761dc6e8424b8d5b22ea/util/types/schemas/blockchain.mol
    const ast: MolType[] = [
      { type: "array", name: "Uint32", item: "byte", item_count: 4 },
      { type: "array", name: "Uint64", item: "byte", item_count: 8 },
      { type: "array", name: "Uint128", item: "byte", item_count: 16 },
      { type: "array", name: "Byte32", item: "byte", item_count: 32 },
      { type: "array", name: "Uint256", item: "byte", item_count: 32 },
      { type: "vector", name: "Bytes", item: "byte" },
      { type: "option", name: "BytesOpt", item: "Bytes" },
      { type: "vector", name: "BytesVec", item: "Bytes" },
      { type: "vector", name: "Byte32Vec", item: "Byte32" },
      { type: "array", name: "ProposalShortId", item: "byte", item_count: 10 },
      { type: "vector", name: "ProposalShortIdVec", item: "ProposalShortId" },
      {
        type: "table",
        name: "Script",
        fields: [
          { name: "code_hash", type: "Byte32" },
          { name: "hash_type", type: "byte" },
          { name: "args", type: "Bytes" },
        ],
      },
      { type: "option", name: "ScriptOpt", item: "Script" },
      {
        type: "struct",
        name: "OutPoint",
        fields: [
          { name: "tx_hash", type: "Byte32" },
          { name: "index", type: "Uint32" },
        ],
      },
      {
        type: "struct",
        name: "CellInput",
        fields: [
          { name: "since", type: "Uint64" },
          { name: "previous_output", type: "OutPoint" },
        ],
      },
      { type: "vector", name: "CellInputVec", item: "CellInput" },
      {
        type: "table",
        name: "CellOutput",
        fields: [
          { name: "capacity", type: "Uint64" },
          { name: "lock", type: "Script" },
          { name: "type_", type: "ScriptOpt" },
        ],
      },
      { type: "vector", name: "CellOutputVec", item: "CellOutput" },
      {
        type: "struct",
        name: "CellDep",
        fields: [
          { name: "out_point", type: "OutPoint" },
          { name: "dep_type", type: "byte" },
        ],
      },
      { type: "vector", name: "CellDepVec", item: "CellDep" },
      {
        type: "table",
        name: "RawTransaction",
        fields: [
          { name: "version", type: "Uint32" },
          { name: "cell_deps", type: "CellDepVec" },
          { name: "header_deps", type: "Byte32Vec" },
          { name: "inputs", type: "CellInputVec" },
          { name: "outputs", type: "CellOutputVec" },
          { name: "outputs_data", type: "BytesVec" },
        ],
      },
      {
        type: "table",
        name: "Transaction",
        fields: [
          { name: "raw", type: "RawTransaction" },
          { name: "witnesses", type: "BytesVec" },
        ],
      },
      { type: "vector", name: "TransactionVec", item: "Transaction" },
      {
        type: "struct",
        name: "RawHeader",
        fields: [
          { name: "version", type: "Uint32" },
          { name: "compact_target", type: "Uint32" },
          { name: "timestamp", type: "Uint64" },
          { name: "number", type: "Uint64" },
          { name: "epoch", type: "Uint64" },
          { name: "parent_hash", type: "Byte32" },
          { name: "transactions_root", type: "Byte32" },
          { name: "proposals_hash", type: "Byte32" },
          { name: "extra_hash", type: "Byte32" },
          { name: "dao", type: "Byte32" },
        ],
      },
      {
        type: "struct",
        name: "Header",
        fields: [
          { name: "raw", type: "RawHeader" },
          { name: "nonce", type: "Uint128" },
        ],
      },
      {
        type: "table",
        name: "UncleBlock",
        fields: [
          { name: "header", type: "Header" },
          { name: "proposals", type: "ProposalShortIdVec" },
        ],
      },
      { type: "vector", name: "UncleBlockVec", item: "UncleBlock" },
      {
        type: "table",
        name: "Block",
        fields: [
          { name: "header", type: "Header" },
          { name: "uncles", type: "UncleBlockVec" },
          { name: "transactions", type: "TransactionVec" },
          { name: "proposals", type: "ProposalShortIdVec" },
        ],
      },
      {
        type: "table",
        name: "BlockV1",
        fields: [
          { name: "header", type: "Header" },
          { name: "uncles", type: "UncleBlockVec" },
          { name: "transactions", type: "TransactionVec" },
          { name: "proposals", type: "ProposalShortIdVec" },
          { name: "extension", type: "Bytes" },
        ],
      },
      {
        type: "table",
        name: "CellbaseWitness",
        fields: [
          { name: "lock", type: "Script" },
          { name: "message", type: "Bytes" },
        ],
      },
      {
        type: "table",
        name: "WitnessArgs",
        fields: [
          { name: "lock", type: "BytesOpt" },
          { name: "input_type", type: "BytesOpt" },
          { name: "output_type", type: "BytesOpt" },
        ],
      },
    ];
    const codecMap = createCodecMap(toMolTypeMap(ast));
    expect(
      codecMap
        .get("Script")!
        .unpack(
          "0x3d0000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80108000000aabbccdd44332211"
        )
    ).toEqual({
      args: "0xaabbccdd44332211",
      code_hash:
        "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hash_type: "0x01",
    });
  });
});
