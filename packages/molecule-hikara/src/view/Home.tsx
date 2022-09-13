import React from "react";
import { DataInput } from "../component/DataInut";
import { Header } from "../component/Header";
import { Molecule } from "../component/Molecule";
import { SchemaSelect } from "../component/SchemaSelect";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export const Home: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Header />
        <Molecule />
        <SchemaSelect />
        <DataInput />
      </Stack>
    </Box>
  );
};
