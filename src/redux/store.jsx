import { configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "./sidebar/sidebarSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});
