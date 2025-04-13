import { Token } from './type';

const getToken = async (forceRefresh: boolean = false) => {
	const token = new Promise<string | void>((resolve, rejects) =>
		chrome.storage.local.get<{ token?: Token }>('token', async ({ token }) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return rejects();
			}

			if (!token) return resolve();

			// Verify token with token introspect
			const accessToken = token['access_token'];
			const urlTokenIntrospect = new URL(
				`${import.meta.env.VITE_KICK_API_BASE_URL}/public/v1/token/introspect`
			);
			const responseTokenIntrospect = await fetch(urlTokenIntrospect, {
				method: 'POST',
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			if (!responseTokenIntrospect.ok && responseTokenIntrospect.status !== 401)
				return resolve();
			const { data: dataTokenIntrospect } = await responseTokenIntrospect.json();

			// If needed, refresh token
			if (!dataTokenIntrospect?.active || forceRefresh) {
				const refreshToken = token['refresh_token'];
				const urlRefreshToken = new URL(
					`${import.meta.env.VITE_API_BASE_URL}/api/refreshToken`
				);
				const responseRefreshToken = await fetch(urlRefreshToken, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refreshToken }),
				});
				if (!responseRefreshToken.ok) return resolve();
				const dataRefreshToken = await responseRefreshToken.json();

				chrome.storage.local.set({ ['token']: dataRefreshToken }, () => {
					if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
				});

				return resolve(dataRefreshToken['access_token']);
			}

			return resolve(accessToken);
		})
	);

	return token;
};

// Helper to check postRefreshToken logic, not used
const postRefreshToken = async () => {
	const token = new Promise<string | void>((resolve, rejects) =>
		chrome.storage.local.get<{ token?: Token }>('token', async ({ token }) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return rejects();
			}

			if (!token) return resolve();

			const refreshToken = token['refresh_token'];
			const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/refreshToken`);
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken }),
			});
			if (!response.ok) return resolve();
			const data = await response.json();

			chrome.storage.local.set({ ['token']: data }, () => {
				if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
			});

			return resolve(data['access_token']);
		})
	);

	return token;
};

const getUser = async () => {
	const accessToken = await getToken();
	if (!accessToken) return;

	const url = new URL(`${import.meta.env.VITE_KICK_API_BASE_URL}/public/v1/users`);
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) return;
	const { data } = await response.json();

	return data[0];
};

const postLogout = () => {
	chrome.storage.local.remove('token');
};

const getStreamUserId = async (name: string) => {
	const accessToken = await getToken();
	if (!accessToken) return;

	const url = new URL(`${import.meta.env.VITE_KICK_API_BASE_URL}/public/v1/channels`);
	url.searchParams.append('slug', name);
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) return;

	const { data } = await response.json();
	if (!data || !data[0]) return;

	const { broadcaster_user_id } = data[0];
	return broadcaster_user_id;
};

const postSendChat = async (broadcaster_user_id: number, content: string) => {
	const accessToken = await getToken();
	if (!accessToken) return;

	const url = new URL(`${import.meta.env.VITE_KICK_API_BASE_URL}/public/v1/chat`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			broadcaster_user_id,
			type: 'user',
			content,
		}),
	});
	if (!response.ok) return;

	const { data } = await response.json();

	return data.is_sent;
};

export { getToken, postRefreshToken, postSendChat, getUser, postLogout, getStreamUserId };
