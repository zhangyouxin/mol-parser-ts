import React, { useState } from "react";
import { DataInput } from "../components/DataInut";
import { Molecule } from "../components/Molecule";
import { SchemaSelect } from "../components/SchemaSelect";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { CodecMap } from "molecule-translator/lib/type";

export const Home: React.FC = () => {
  const [codecMap, setCodecMap] = useState<CodecMap>(new Map());
  const [selectedCodecName, setSelectedCodecName] = useState<string>("");
  const handleCodecMap = (codecMap: CodecMap) => {
    setCodecMap(codecMap)
  }
  const handleSelectCodec = (name: string) => {
    setSelectedCodecName(name)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Molecule updateCodecMap={handleCodecMap} />
        <SchemaSelect codecMap={codecMap} onSelectCodec={handleSelectCodec}/>
        <DataInput codec={codecMap.get(selectedCodecName)}/>
      </Stack>
    </Box>
  );
};
