import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user);

  if (!user.id) return <Navigate to="/join" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
