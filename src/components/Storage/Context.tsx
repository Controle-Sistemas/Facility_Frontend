import { createContext } from 'react';

const StoreContext = createContext({ 
    token: null,
    setToken: () => {},
    admin: null,
    setAdmin: () => {},
});

export default StoreContext;
