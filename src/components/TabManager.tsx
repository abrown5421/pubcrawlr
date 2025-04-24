import { useState, ReactNode } from "react";
import { Box, Tabs, Tab, Badge } from "@mui/material";
import { useAppSelector } from "../store/hooks";

interface TabManagerProps {
  tabs: string[];
  children: ReactNode[];
}

export default function TabManager({ tabs, children }: TabManagerProps) {
  const request = useAppSelector((state) => state.requests);
  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={handleChange}>
        {tabs.map((label, i) => {
          const showBadge = label === "Requests" && request.open && request.requests;

          return (
            <Tab
              key={i}
              label={
                showBadge ? (
                  <Badge
                    color="error"
                    badgeContent={request.requests}
                    invisible={!request.open || !request.requests}
                  >
                    {label}
                  </Badge>
                ) : (
                  label
                )
              }
            />
          );
        })}
      </Tabs>
      <Box p={2}>{children[tab]}</Box>
    </Box>
  );
}
