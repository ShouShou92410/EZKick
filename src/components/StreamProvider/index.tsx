import { JSX, useEffect, useState } from 'react';
import { Stream, streamContext } from './context';
import { getStreamUserId } from '../../api';
import { Emote } from '../../type';

const StreamProvider = ({ children }: { children: JSX.Element }) => {
	const [stream, setStream] = useState<Stream>(null);
	const [emotes, setEmotes] = useState<Emote[]>([]);

	// Tab update listener for stream
	useEffect(() => {
		const handleStreamUpdate = () => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const kickStreamRegex = /^https:\/\/kick\.com\/[^/]+$/;

				const activeTab = tabs[0];
				if (!activeTab || !activeTab.url || !kickStreamRegex.test(activeTab.url)) return;

				const url = new URL(activeTab.url);
				const name = url.pathname.split('/').pop();
				if (name) {
					setStream({ user_id: -1, name });

					chrome.storage.local.get<{ emotes?: Emote[] }>(({ emotes }) => {
						if (chrome.runtime.lastError) {
							console.error(chrome.runtime.lastError);
							return;
						}

						if (emotes) setEmotes(emotes);
					});
				}
			});
		};

		const handleTabUpdated = (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
			if (changeInfo.url) handleStreamUpdate();
		};

		handleStreamUpdate();
		chrome.tabs.onUpdated.addListener(handleTabUpdated);
		return () => {
			chrome.tabs.onUpdated.removeListener(handleTabUpdated);
		};
	}, []);

	const fetchStreamUserId = async () => {
		if (!stream) return;

		const streamUserId = new Promise<number | void>((resolve, rejects) => {
			chrome.storage.local.get<{ stream?: Stream }>(
				'stream',
				async ({ stream: savedStream }) => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError);
						return rejects();
					}

					if (!savedStream || savedStream.name !== stream.name) {
						const broadcaster_user_id = await getStreamUserId(stream.name);
						if (!broadcaster_user_id) return resolve();

						chrome.storage.local.set(
							{ ['stream']: { user_id: broadcaster_user_id, name: stream.name } },
							() => {
								if (chrome.runtime.lastError)
									console.error(chrome.runtime.lastError);
							}
						);

						return resolve(broadcaster_user_id);
					}

					return resolve(savedStream.user_id);
				}
			);
		});

		return streamUserId;
	};

	const emoteParser = (value: string) => {
		const emote = emotes.find(({ name }) => name === value);
		if (!emote) return value;

		return `[emote:${emote.id}:${emote.name}]`;
	};

	const emoteRenderer = (value: string) => {
		const emote = emotes.find(({ name }) => name === value);
		if (!emote) return value;

		return (
			<img
				className="h-5 w-5 inline"
				src={`${import.meta.env.VITE_KICK_FILES_BASE_URL}/emotes/${emote.id}/fullsize`}
				alt={emote.name}
				draggable="false"
			/>
		);
	};

	return (
		<streamContext.Provider
			value={{ stream, setStream, fetchStreamUserId, emotes, emoteParser, emoteRenderer }}
		>
			{children}
		</streamContext.Provider>
	);
};

export default StreamProvider;
