import nearley from "nearley";
import { MolType, MolTypeMap, Parser } from "./type";
import { nonNull, toMolTypeMap } from "./utils";

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
 export const byte = "byte";

const validateParserResults = (results: MolType[]) => {
  checkDuplicateNames(results);
  checkDependencies(results);
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
  const map = toMolTypeMap(results);
  for (const entry of map) {
    const molItem = map.get(entry[0])!;
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

