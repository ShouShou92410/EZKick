import { useState } from 'react';
import { Message } from '../../type';
import CheckIcon from '../../icons/CheckIcon';
import CrossIcon from '../../icons/CrossIcon';

type Props = Message & {
	onCompleted: () => void;
};
const CustomMessageEditor = ({ id, value: defaultValue, onCompleted }: Props) => {
	const [value, setValue] = useState(defaultValue);

	const onSave = () => {
		onCompleted();
		if (value.length < 1) return;

		chrome.storage.local.get<{ customMessages?: Message[] }>(
			['customMessages'],
			({ customMessages }) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
					return;
				}

				const customMessage = (customMessages ?? []).find(
					(customMessage) => customMessage.id === id
				);
				if (customMessage && value.length > 0) customMessage.value = value;

				chrome.storage.local.set({ ['customMessages']: customMessages }, () => {
					if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
				});
			}
		);
	};

	const onCancel = () => {
		onCompleted();
	};

	return (
		<>
			<textarea
				className="textarea"
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
			<div className="flex flex-col gap-y-1">
				<div className="tooltip" data-tip="Save">
					<button className="btn btn-square btn-xs btn-success" onClick={onSave}>
						<CheckIcon />
					</button>
				</div>

				<div className="tooltip" data-tip="Cancel">
					<button className="btn btn-square btn-xs btn-error" onClick={onCancel}>
						<CrossIcon />
					</button>
				</div>
			</div>
		</>
	);
};

export default CustomMessageEditor;
