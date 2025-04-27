(async () => {
	console.log('Content script running...');
	let chatListenerId = null;

	const handleCleanup = () => {
		clearInterval(chatListenerId);
		chatListenerId = null;
	};

	const handleSetup = () => {
		chatListenerId = setInterval(processChat, 5000);
	};

	const isKickStream = () => {
		const kickStreamRegex = /^https:\/\/kick\.com\/[^/]+$/;
		return kickStreamRegex.test(window.location.href);
	};

	const getKickStreamName = () => {
		if (!isKickStream()) return;

		const url = new URL(window.location.href);
		const name = url.pathname.split('/').pop();
		return name;
	};

	const processChat = () => {
		if (document.visibilityState === 'hidden') return;

		const xpath = `//div[@id='chatroom-messages']//div[@data-index]/div/div[1]/span[3]`;
		// const xpath = `//div[@id='chatroom-messages']//div[@data-index]/div/div[1]/div[2]/span[3]`;

		const nodes = document.evaluate(
			xpath,
			document,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null
		);

		const words = {};
		for (let i = 0; i < nodes.snapshotLength; i++) {
			const node = nodes.snapshotItem(i);

			node.childNodes.forEach((childNode) => {
				if (childNode.nodeType === Node.TEXT_NODE) {
					const text = childNode.textContent.trim();
					if (text) {
						words[text] ??= 0;
						words[text]++;
					}
				} else if (
					childNode.nodeType === Node.ELEMENT_NODE &&
					childNode.tagName === 'SPAN'
				) {
					if (
						childNode.hasAttribute('data-emote-id') &&
						childNode.hasAttribute('data-emote-name')
					) {
						const text = childNode.getAttribute('data-emote-name');
						words[text] ??= 0;
						words[text]++;
					}
				}
			});
		}

		const topWords = Object.entries(words)
			.filter(([, v]) => v > 1)
			.sort(([, v1], [, v2]) => v2 - v1)
			.slice(0, 5)
			.map(([key]) => ({ id: crypto.randomUUID(), value: key }));
		if (topWords.length < 1) return;

		chrome.storage.local.set({ ['autoMessages']: topWords }, () => {
			if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
		});
	};

	const setupEmotes = async () => {
		const name = getKickStreamName();
		if (!name) return;

		const url = new URL(`${import.meta.env.VITE_KICK_BASE_URL}/emotes/${name}`);
		const response = await fetch(url);
		if (!response.ok) return;

		const data = await response.json();
		if (!data || !Array.isArray(data)) return;

		const emotes = data.flatMap(({ emotes }) => emotes.map(({ id, name }) => ({ id, name })));

		chrome.storage.local.set({ ['emotes']: emotes }, () => {
			if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
		});
	};

	chrome.runtime.onMessage.addListener(({ type }) => {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			return;
		}

		switch (type) {
			case 'URL_CHANGED':
				chrome.storage.local.remove(['emotes', 'autoMessages']);

				if (!isKickStream() && chatListenerId) {
					handleCleanup();
				}

				if (isKickStream()) {
					setupEmotes();

					if (!chatListenerId) {
						handleSetup();
					}
				}

				break;
			default:
				break;
		}
	});
})();
