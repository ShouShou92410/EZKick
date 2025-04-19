import AutoMessage from './AutoMessage';
import { useStream } from '../StreamProvider/context';
import useAutoMessages from './useAutoMessages';

const AutoMessageSection = () => {
	const { stream } = useStream();
	const autoMessages = useAutoMessages();

	if (!stream) return <div className="p-4">Please refresh the page</div>;

	return (
		<ul className="list w-full">
			<li className="text-left text-xs opacity-60 p-4 pb-2">
				Frequent words from <b>{stream?.name}</b> chat
			</li>

			{autoMessages.length === 0 ? (
				<li className="list-row self-center">
					Analyzing ... <span className="loading loading-spinner" />
				</li>
			) : (
				autoMessages.map(({ id, value }) => (
					<li key={id} className="list-row grid-cols-1">
						<AutoMessage id={id} value={value} />
					</li>
				))
			)}
		</ul>
	);
};

export default AutoMessageSection;
