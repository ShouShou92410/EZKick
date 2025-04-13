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
				Chat from <b>{stream?.name}</b>
				<br />
				(You can change it in the settings)
			</li>

			{autoMessages.length === 0 ? (
				<li className="list-row self-center">
					<span className="loading loading-spinner loading-xl"></span>
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
