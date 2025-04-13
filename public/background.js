(async () => {
	console.log('Background script running...');

	await chrome.storage.local.remove(['autoMessages']);

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (chrome.runtime.lastError) return;

		const kickStreamRegex = /^https:\/\/kick\.com\/[^/]+$/;
		if (!tab.url || !kickStreamRegex.test(tab.url)) {
			chrome.action.disable(tabId);
			return;
		}
		chrome.action.enable(tabId);

		if (changeInfo.status === 'complete' && tab.url) {
			chrome.tabs.sendMessage(tabId, { type: 'URL_CHANGED' });
		}
	});
})();
