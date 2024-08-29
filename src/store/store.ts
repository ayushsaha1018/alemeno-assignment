// store.ts
import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "@/store/coursesSlice";
import authReducer from "@/store/authSlice";

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
