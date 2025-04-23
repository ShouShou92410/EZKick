import { postLogout } from '../../api';
import { useToken } from '../TokenProvider/context';
import useUser from './useUser';

const SettingsSection = () => {
	const { userName } = useUser();
	const { hasToken } = useToken();

	const authorize = () => {
		chrome.runtime.sendMessage({ type: 'START_OAUTH' });
	};

	return (
		<ul className="list grow w-80 items-center gap-y-2">
			<li className="p-4 pb-2 opacity-60">
				Hello <b>{userName}</b>
			</li>

			{!hasToken && (
				<button className="btn btn-wide btn-accent" onClick={authorize}>
					Authorize
				</button>
			)}
			{/* <button className="btn btn-wide btn-soft">Clear messages</button> */}

			{hasToken && (
				<button className="btn btn-wide btn-warning" onClick={postLogout}>
					Logout
				</button>
			)}
		</ul>
	);
};

export default SettingsSection;
