import { createContext, Dispatch, SetStateAction, useContext } from 'react';

type TokenContext = {
	hasToken: boolean;
	setHasToken: Dispatch<SetStateAction<boolean>>;
};

const tokenContext = createContext<TokenContext>({
	hasToken: false,
	setHasToken: () => {},
});

const useToken = () => useContext(tokenContext);

export { tokenContext, useToken };
