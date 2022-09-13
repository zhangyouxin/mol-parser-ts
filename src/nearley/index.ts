import nearley from "nearley";
import { MolType, MolTypeMap, Parser } from "./type";

const grammar = require("./grammar/mol.js");

export const createParser = (): Parser => {
  return {
    parse: (data) => {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(data);
      const results = parser.results[0].filter(
        (result: MolType | null) => !!result
      ) as MolType[];
      validateParserResults(results);
      return results;
    },
  };
};
/**
 * primitive type
 */
const byte = "byte";

const validateParserResults = (results: MolType[]) => {
  checkDuplicateNames(results);
  checkDependencies(results);
};
const toResultsMap = (results: MolType[]): MolTypeMap => {
  const map = new Map<string, MolType>();
  results.forEach((result) => {
    map.set(result.name, result);
  });
  return map;
};
const checkDuplicateNames = (results: MolType[]) => {
  const names = new Set<string>();
  results.forEach((result) => {
    const currentName = result.name;
    if (names.has(currentName)) {
      throw new Error(`Duplicate name: ${currentName}`);
    }
    names.add(currentName);
    const currentType = result.type;
    // check duplicate field names in `struct` and `table`
    if (currentType === "struct" || currentType === "table") {
      const fieldNames = new Set<string>();
      result.fields.forEach((field) => {
        const currentFieldName = field.name;
        if (fieldNames.has(currentFieldName)) {
          throw new Error(`Duplicate field name: ${currentFieldName}`);
        }
        fieldNames.add(currentFieldName);
      });
    }
  });
};
const checkDependencies = (results: MolType[]) => {
  const map = toResultsMap(results);
  for (const key of map) {
    const molItem = map.get(key[0])!;
    nonNull(molItem);
    const type = molItem.type;
    switch (type) {
      case "array":
      case "struct":
        assertFixedMolType(molItem.name, map);
        break;
      case "vector":
      case "option":
        if (molItem.item !== byte) {
          nonNull(map.get(molItem.item));
        }
        break;
      case "union":
        const unionDeps = molItem.items;
        unionDeps.forEach((dep) => {
          if (dep !== byte) {
            nonNull(map.get(dep));
          }
        });
        break;
      case "table":
        const tableDeps = molItem.fields.map((field) => field.type);
        tableDeps.forEach((dep) => {
          if (dep !== byte) {
            nonNull(map.get(dep));
          }
        });
        break;
      default:
        break;
    }
  }
};

/**
 * mol type `array` and `struct` should have fixed byte length
 */
const assertFixedMolType = (name: string, map: MolTypeMap) => {
  const molItem = map.get(name)!;
  nonNull(molItem);
  const type = molItem.type;
  switch (type) {
    case "array":
      if (molItem.item !== byte) {
        assertFixedMolType(molItem.name, map);
      }
      break;
    case "struct":
      const fields = molItem.fields;
      fields.forEach((field) => {
        if (field.type !== byte) {
          assertFixedMolType(field.type, map);
        }
      });
      break;
    default:
      throw new Error(`Type ${name} should be fixed length.`);
  }
};

// TODO: assert not null/undefined
function nonNull(data: any) {
  if (!data) {
    throw new Error(`${data} does not exist.`);
  }
}
const toCodecMap = (map: MolTypeMap) => {};

// const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const parser = createParser();

const result = parser.parse(`
  /* Basic Types */

  // as a byte array in little endian.
  array Uint32 [byte; 4];
  array Uint64 [byte; 8];
  array Uint128 [byte; 16];
  array Byte32 [byte; 32];
  array Uint256 [byte; 32];

  vector Bytes <byte>;
  option BytesOpt (Bytes);

  vector BytesVec <Bytes>;
  vector Byte32Vec <Byte32>;

  /* Types for Chain */

  option ScriptOpt (Script);

  array ProposalShortId [byte; 10];

  vector UncleBlockVec <UncleBlock>;
  vector TransactionVec <Transaction>;
  vector ProposalShortIdVec <ProposalShortId>;
  vector CellDepVec <CellDep>;
  vector CellInputVec <CellInput>;
  vector CellOutputVec <CellOutput>;

  table Script {
      code_hash:      Byte32,
      hash_type:      byte,
      args:           Bytes,
  }

  struct OutPoint {
      tx_hash:        Byte32,
      index:          Uint32,
  }

  struct CellInput {
      since:           Uint64,
      previous_output: OutPoint,
  }

  table CellOutput {
      capacity:       Uint64,
      lock:           Script,
      type_:          ScriptOpt,
  }

  struct CellDep {
      out_point:      OutPoint,
      dep_type:       byte,
  }

  table RawTransaction {
      version:        Uint32,
      cell_deps:      CellDepVec,
      header_deps:    Byte32Vec,
      inputs:         CellInputVec,
      outputs:        CellOutputVec,
      outputs_data:   BytesVec,
  }

  table Transaction {
      raw:            RawTransaction,
      witnesses:      BytesVec,
  }

  struct RawHeader {
      version:                Uint32,
      compact_target:         Uint32,
      timestamp:              Uint64,
      number:                 Uint64,
      epoch:                  Uint64,
      parent_hash:            Byte32,
      transactions_root:      Byte32,
      proposals_hash:         Byte32,
      extra_hash:             Byte32,
      dao:                    Byte32,
  }

  struct Header {
      raw:                    RawHeader,
      nonce:                  Uint128,
  }

  table UncleBlock {
      header:                 Header,
      proposals:              ProposalShortIdVec,
  }

  table Block {
      header:                 Header,
      uncles:                 UncleBlockVec,
      transactions:           TransactionVec,
      proposals:              ProposalShortIdVec,
  }

  table BlockV1 {
      header:                 Header,
      uncles:                 UncleBlockVec,
      transactions:           TransactionVec,
      proposals:              ProposalShortIdVec,
      extension:              Bytes,
  }

  table CellbaseWitness {
      lock:    Script,
      message: Bytes,
  }

  table WitnessArgs {
      lock:                   BytesOpt,          // Lock args
      input_type:             BytesOpt,          // Type args for input
      output_type:            BytesOpt,          // Type args for output
  }
`);

// console.log(parser.results[0].filter((result: MolType | null) => !!result));
console.log(JSON.stringify(result));
