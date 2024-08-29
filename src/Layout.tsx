import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import authService from "./services/AuthService";
import { login, logout } from "./store/authSlice";
import { fetchCourses, fetchEnrolledCourses } from "./store/coursesSlice";
import { AppDispatch, RootState } from "./store/store";

function Layout() {
  const dispatch: AppDispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        console.log(userData);
        dispatch(login(userData));
        dispatch(fetchEnrolledCourses(userData?.$id));
      } else {
        dispatch(logout());
      }
    });
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCourses());
    }
  }, [dispatch, status]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  );
}

export default Layout;
