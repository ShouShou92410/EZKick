import { useEffect, useState } from 'react';
import { Message } from '../../type';

const useCustomMessages = () => {
	const [value, setValue] = useState<Message[]>([]);

	useEffect(() => {
		// Get custom messages from storage
		chrome.storage.local.get<{ customMessages?: Message[] }>(
			'customMessages',
			({ customMessages }) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
					return;
				}

				setValue(customMessages ?? []);
			}
		);

		// Update customMessages when storage changes
		const handleStorageChange = (
			changes: { [key: string]: chrome.storage.StorageChange },
			areaName: chrome.storage.AreaName
		) => {
			if (areaName === 'local' && changes['customMessages']) {
				setValue(changes['customMessages'].newValue || []);
			}
		};
		chrome.storage.onChanged.addListener(handleStorageChange);
		return () => {
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	return value;
};

export default useCustomMessages;
