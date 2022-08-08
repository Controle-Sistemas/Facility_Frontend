import React, {useContext} from "react";
import { Navigate } from "react-router";
import StoreContext from "../../Storage/Context";

const ProtectedRoute = ({ children }) => {
    const { token,admin } = useContext(StoreContext);
    const path = window.location.pathname;
  
    if (!token) {
      return <Navigate to="/login" replace />;
    } else if(token && !admin && path.includes('admin')){
        return <Navigate to="/login" replace />;
    }

  
    return children;
  };
export default ProtectedRoute;