import { JSX, useEffect, useState } from 'react';
import { tokenContext } from './context';
import { Token } from '../../type';

const TokenProvider = ({ children }: { children: JSX.Element }) => {
	const [hasToken, setHasToken] = useState(false);

	// Init for hasToken
	useEffect(() => {
		chrome.storage.local.get<{ token?: Token }>('token', ({ token }) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return;
			}

			setHasToken(!!token);
		});
	}, []);

	// Storage change listener for token
	useEffect(() => {
		const handleStorageChange = (
			changes: { [key: string]: chrome.storage.StorageChange },
			areaName: chrome.storage.AreaName
		) => {
			if (areaName === 'local' && changes['token']) {
				setHasToken(!!changes['token'].newValue);
			}
		};

		chrome.storage.onChanged.addListener(handleStorageChange);
		return () => {
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	return (
		<tokenContext.Provider value={{ hasToken, setHasToken }}>{children}</tokenContext.Provider>
	);
};

export default TokenProvider;
