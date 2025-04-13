import { useEffect, useState } from 'react';
import { Message } from '../../type';

const useAutoMessages = () => {
	const [value, setValue] = useState<Message[]>([]);

	useEffect(() => {
		// Get auto messages from storage
		chrome.storage.local.get<{ autoMessages?: Message[] }>(
			'autoMessages',
			({ autoMessages }) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
					return;
				}

				setValue(autoMessages ?? []);
			}
		);

		// Update autoMessages when storage changes
		const handleStorageChange = (
			changes: { [key: string]: chrome.storage.StorageChange },
			areaName: chrome.storage.AreaName
		) => {
			if (areaName === 'local' && changes['autoMessages']) {
				setValue(changes['autoMessages'].newValue || []);
			}
		};
		chrome.storage.onChanged.addListener(handleStorageChange);
		return () => {
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	return value;
};

export default useAutoMessages;
