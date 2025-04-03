import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ActivePageState {
  Name: string;
  In: boolean;
}

const initialState: ActivePageState = {
  Name: "Root",
  In: true,
};

const activePageSlice = createSlice({
  name: "activePage",
  initialState,
  reducers: {
    setActivePage: <K extends keyof ActivePageState>(
      state: ActivePageState,
      action: PayloadAction<{ key: K; value: ActivePageState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setActivePage } = activePageSlice.actions;
export default activePageSlice.reducer;

