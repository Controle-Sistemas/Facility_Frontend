import React, {useContext} from "react";
import { Navigate } from "react-router";
import StoreContext from "../../Storage/Context";

const ProtectedRoute = ({ children }) => { //Route com proteção de acesso
    const { token,admin } = useContext(StoreContext); //Pega o token do usuário logado e o tipo de usuário logado (admin ou user)
    const path = window.location.pathname; //Pega o caminho atual da página
  
    if (!token) { //Se não existir token, redireciona para a página de login
      return <Navigate to="/login" replace />; 
    } else if(token && !admin && path.includes('admin')){ //Se existir token e o usuário logado não for admin, mas a página atual for admin, redireciona para a página de usuário
        return <Navigate to="/login" replace />;
    }

  
    return children; 
  };
export default ProtectedRoute;