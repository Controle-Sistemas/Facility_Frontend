import { createContext } from 'react';

const StoreContext = createContext({ //Cria um hook para o storage do usuário
    token: null,
    setToken: () => {},
    admin: null,
    setAdmin: () => {},
    ramo: null,
    setRamo: () => {},
});

export default StoreContext;
