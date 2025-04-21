import { useState, ReactNode } from "react";
import { Box, Tabs, Tab } from "@mui/material";

interface TabManagerProps {
  tabs: string[];
  children: ReactNode[];
}

export default function TabManager({ tabs, children }: TabManagerProps) {
  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={handleChange}>
        {tabs.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>
      <Box p={2}>{children[tab]}</Box>
    </Box>
  );
}
