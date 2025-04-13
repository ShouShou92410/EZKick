import { useState, useEffect } from 'react';
import { getUser } from '../../api';
import { useToken } from '../TokenProvider/context';

const useUser = () => {
	const [userName, setUserName] = useState('');
	const { hasToken, setHasToken } = useToken();

	useEffect(() => {
		if (!hasToken) {
			setUserName('');
			return;
		}

		const handleGetUser = async () => {
			const user = await getUser();
			if (!user) {
				setHasToken(false);
				return;
			}

			setUserName(user.name);
		};
		handleGetUser();
	}, [hasToken, setHasToken]);

	return { userName, hasToken };
};

export default useUser;
