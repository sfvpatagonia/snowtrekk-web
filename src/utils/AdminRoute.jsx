import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyTokenRequest } from "../api/auth";
import { addUser, logout } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";
const AdminRoute = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.log("No token found");
      dispatch(logout());
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decoded.exp < currentTime) {
        console.log("Token has expired");
        dispatch(logout());
        return;
      }

      verifyTokenRequest(token).then((data) => {
        if (data.email) {
          dispatch(
            addUser({
              id: data.id,
              email: data.email,
              name: data.name,
              isAdmin: data.isAdmin,
              isSuperAdmin: data.isSuperAdmin,
              role: data.role,
              token,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      dispatch(logout());
    }
  }, [dispatch, token]);

  return user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
