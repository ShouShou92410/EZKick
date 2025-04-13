import { useState } from 'react';
import PlusIcon from '../../icons/PlusIcon';
import { Message } from '../../type';

const CustomMessageCreator = () => {
	const [value, setValue] = useState('');

	const onAdd = () => {
		if (value.length < 1) return;

		chrome.storage.local.get<{ customMessages?: Message[] }>(
			['customMessages'],
			({ customMessages }) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
					return;
				}

				const newMessages = [...(customMessages ?? []), { id: crypto.randomUUID(), value }];
				chrome.storage.local.set({ ['customMessages']: newMessages }, () => {
					if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
				});
			}
		);
	};

	return (
		<>
			<textarea
				className="textarea"
				onChange={(e) => setValue(e.target.value)}
				placeholder="Enter custom message"
				value={value}
			/>
			<button className="btn btn-square btn-xs btn-success" onClick={onAdd}>
				<PlusIcon width="16" height="16" />
			</button>
		</>
	);
};

export default CustomMessageCreator;
