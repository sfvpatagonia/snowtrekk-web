import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser, logout } from "../redux/userSlice";
import userService from "../services/user";

const AdminRoute = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("checking"); // checking | allowed | denied

  useEffect(() => {
    let cancelled = false;

    userService.getMe().then((me) => {
      if (cancelled) return;

      if (me.ok && me.body?.role === "admin") {
        dispatch(addUser(me.body));
        setStatus("allowed");
      } else {
        dispatch(logout());
        setStatus("denied");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (status === "checking") return null;
  return status === "allowed" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
