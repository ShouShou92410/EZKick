import { useState } from 'react';

import SettingsSection from '../SettingsSection';
import AutoMessageSection from '../AutoMessageSection';
import CustomMessageSection from '../CustomMessageSection';
import ChatIcon from '../../icons/ChatIcon';
import EditIcon from '../../icons/EditIcon';
import SettingsIcon from '../../icons/SettingsIcon';

enum Tab {
	Auto = 'auto',
	Custom = 'custom',
	Settings = 'settings',
}

const Home = () => {
	const [tab, setTab] = useState<Tab>(Tab.Custom);

	return (
		<>
			{
				{
					[Tab.Custom]: <CustomMessageSection />,
					[Tab.Auto]: <AutoMessageSection />,
					[Tab.Settings]: <SettingsSection />,
				}[tab]
			}
			<div className="dock">
				<button
					className={tab === Tab.Custom ? 'dock-active' : ''}
					onClick={() => setTab(Tab.Custom)}
				>
					<EditIcon width="20" height="20" />
					<span className="dock-label">Custom</span>
				</button>
				<button
					className={tab === Tab.Auto ? 'dock-active' : ''}
					onClick={() => setTab(Tab.Auto)}
				>
					<ChatIcon width="20" height="20" />
					<span className="dock-label">Chat</span>
				</button>
				<button
					className={tab === Tab.Settings ? 'dock-active' : ''}
					onClick={() => setTab(Tab.Settings)}
				>
					<SettingsIcon width="20" height="20" />
					<span className="dock-label">Settings</span>
				</button>
			</div>
		</>
	);
};

export default Home;
