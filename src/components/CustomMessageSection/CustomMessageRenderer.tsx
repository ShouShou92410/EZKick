import { postSendChat } from '../../api';
import CopyIcon from '../../icons/CopyIcon';
import SendIcon from '../../icons/SendIcon';
import TrashIcon from '../../icons/TrashIcon';
import { useStream } from '../StreamProvider/context';
import { useToken } from '../TokenProvider/context';
import { Message, MessageID } from '../../type';

type Props = Message & {
	onEdit: () => void;
};
const CustomMessageRenderer = ({ id, value, onEdit }: Props) => {
	const { stream, fetchStreamUserId, emoteParser, emoteRenderer } = useStream();
	const { hasToken } = useToken();

	const onCopy = () => {
		navigator.clipboard.writeText(value);
	};

	const canSend = hasToken && stream?.name;
	const onSend = async () => {
		const streamUserId = await fetchStreamUserId();
		if (canSend && streamUserId) {
			const parsedValue = value
				.split(' ')
				.map((x) => emoteParser(x))
				.join(' ');

			postSendChat(streamUserId, parsedValue);
		}
	};

	const onRemove = () => {
		chrome.storage.local.get<{ customMessages?: Message[] }>(
			'customMessages',
			({ customMessages }) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
					return;
				}

				const newMessages = (customMessages ?? []).filter(
					({ id: messageID }: { id: MessageID }) => messageID !== id
				);
				chrome.storage.local.set({ ['customMessages']: newMessages }, () => {
					if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
				});
			}
		);
	};

	return (
		<>
			<div className="border border-solid rounded-sm text-left px-1" onDoubleClick={onEdit}>
				{value.split(' ').map((x, i) => (
					<>
						{i > 0 && ' '}
						{emoteRenderer(x)}
					</>
				))}
			</div>
			<div className="flex justify-end gap-x-1">
				<button className="btn btn-square btn-xs btn-info" onClick={onCopy}>
					<CopyIcon width="16" height="16" />
				</button>
				{canSend && (
					<button className="btn btn-square btn-xs btn-success" onClick={onSend}>
						<SendIcon width="16" height="16" />
					</button>
				)}
				<button className="btn btn-square btn-xs btn-error" onClick={onRemove}>
					<TrashIcon width="16" height="16" />
				</button>
			</div>
		</>
	);
};

export default CustomMessageRenderer;
