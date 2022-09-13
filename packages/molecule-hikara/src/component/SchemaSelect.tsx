import React from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.h5,
  padding: theme.spacing(1),
  textAlign: "center",
  marginLeft: "20%",
  marginRight: "20%",
  color: theme.palette.text.secondary,
}));

export const SchemaSelect: React.FC = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <div>
      <Label>Choose one schema to decode:</Label>
      <br></br>
      <Select
        labelId="simple-select-label"
        id="simple-select"
        value={age}
        label="Age"
        onChange={handleChange}
        style={{ display: "block", width: "60%", marginLeft: "20%" }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      <br></br>
    </div>
  );
};
