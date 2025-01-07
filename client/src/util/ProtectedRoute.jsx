import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

function ProtectedRoute({ children }) {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
