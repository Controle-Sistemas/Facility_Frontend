import React from "react";
import Context from "./Context";
import useStorage from '../../utils/useStorage';

export default function StoreProvider ({ children }){ //Cria a rota protegida
    const [token, setToken] = useStorage('token') //Cria o token
    const [admin, setAdmin] = useStorage('admin') //Cria o admin
    const [ramo, setRamo] = useStorage('') //Cria o idCloud

    return(
        <Context.Provider value={{
            token,
            setToken,
            admin,
            setAdmin,
            ramo,
            setRamo,

        }}
        >
            {children}
        </Context.Provider>

    )
}
