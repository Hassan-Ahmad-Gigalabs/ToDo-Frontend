import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../../services/tasks/types";

export interface DashboardState {
  modalOpen: boolean;
  selectedTask: Task | null;
  selectedTab: number;
}

const initialState: DashboardState = {
  modalOpen: false,
  selectedTask: null,
  selectedTab: 1,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setModalState: (state, action) => {
      const { payload } = action;
      state.selectedTab = 1;
      state.modalOpen = payload;
    },
    setTask: (state, action) => {
      const { payload } = action;
      state.selectedTask = payload;
    },
    setTab: (state, action) => {
      const { payload } = action;
      state.selectedTab = payload;
    },
  },
});

export const { setModalState, setTask, setTab } = dashboardSlice.actions;

export default dashboardSlice.reducer;
