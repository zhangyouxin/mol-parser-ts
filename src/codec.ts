import { FixedBytesCodec, createBytesCodec, BytesLike, BytesCodec } from '@ckb-lumos/codec/lib/base';
import { array, byteVecOf, option, struct, table, union, vector } from '@ckb-lumos/codec/lib/molecule';
import { createFixedHexBytesCodec } from '@ckb-lumos/codec/lib/blockchain';
import { byte, CodecMap, MolType, MolTypeMap } from "./type";
import { nonNull } from './utils';
import { bytes } from '@ckb-lumos/codec';

function createHexBytesCodec(): BytesCodec<string, BytesLike> {
  return createBytesCodec({
    pack: (hex) => bytes.bytify(hex),
    unpack: (buf) => bytes.hexify(buf),
  });
}

export const createCodecMap = (molTypeMap: MolTypeMap): CodecMap => {
  const result = new Map<string, BytesCodec>();
  for (const entry of molTypeMap) {
    const molType: MolType = entry[1]
    let codec = null
    switch (molType.type) {
      case "array":
        if(molType.item === byte) {
          codec = createFixedHexBytesCodec(molType.item_count)
        } else {
          const itemMolType = result.get(molType.item)!
          nonNull(itemMolType)
          codec = array(itemMolType as FixedBytesCodec, molType.item_count)        
        }
        break;
      case "vector":
        if(molType.item === byte) {
          codec = byteVecOf(createHexBytesCodec())
        } else {
          const itemMolType = result.get(molType.item)!
          nonNull(itemMolType)
          codec = vector(itemMolType)        
        }
        break;
      case "option":
        if(molType.item === byte) {
          codec = option(createFixedHexBytesCodec(1))
        } else {
          
          const itemMolType = result.get(molType.item)!
          nonNull(itemMolType)
          codec = option(itemMolType)        
        }
        break;
      case "union":
        const itemMolTypes = molType.items
        const unionCodecs: Record<string, BytesCodec> = {}
        itemMolTypes.forEach(itemMolTypeName => {
          if(itemMolTypeName === byte) {
            unionCodecs[itemMolTypeName] = createFixedHexBytesCodec(1)
          } else {
            const itemMolType = result.get(itemMolTypeName)!
            nonNull(itemMolType)
            unionCodecs[itemMolTypeName] = itemMolType
          }
        })
        codec = union(unionCodecs, Object.keys(unionCodecs))
        break;
      case "table":
        const tableFields = molType.fields
        const tableCodecs: Record<string, BytesCodec> = {}
        tableFields.forEach(field => {
          if(field.type === byte) {
            tableCodecs[field.name] = createFixedHexBytesCodec(1)
          } else {
            const itemMolType = result.get(field.type)!
            nonNull(itemMolType)
            tableCodecs[field.name] = itemMolType
          }
        })
        codec = table(tableCodecs, tableFields.map(field => field.name))
        break;
      case "struct":
        const structFields = molType.fields
        const structCodecs: Record<string, FixedBytesCodec> = {}
        structFields.forEach(field => {
          if(field.type === byte) {
            structCodecs[field.name] = createFixedHexBytesCodec(1)
          } else {
            const itemMolType = result.get(field.type)!
            nonNull(itemMolType)
            structCodecs[field.name] = itemMolType as FixedBytesCodec
          }
        })
        codec = struct(structCodecs, structFields.map(field => field.name))
        break;
      default:
        throw new Error(`Not supportted molecule type ${molType}.`);
    }
    nonNull(codec)
    result.set(entry[0], codec)
  }
  return result;
}