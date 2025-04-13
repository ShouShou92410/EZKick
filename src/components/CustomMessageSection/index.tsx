import CustomMessage from './CustomMessage';
import useCustomMessages from './useCustomMessages';
import CustomMessageCreator from './CustomMessageCreator';

const CustomMessageSection = () => {
	const customMessages = useCustomMessages();

	return (
		<ul className="list w-full">
			<li className="text-left text-xs opacity-60 p-4 pb-2">
				Manage your custom messages here
			</li>

			<li className="list-row grid-cols-1">
				<CustomMessageCreator />
			</li>

			{customMessages.map(({ id, value }) => (
				<li key={id} className="list-row grid-cols-1">
					<CustomMessage id={id} value={value} />
				</li>
			))}
		</ul>
	);
};

export default CustomMessageSection;
