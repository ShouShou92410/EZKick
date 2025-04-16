const generateCodeVerifier = () => {
	const array = new Uint32Array(43);
	crypto.getRandomValues(array);
	return Array.from(array, (dec) => dec.toString(16).padStart(2, '0')).join('');
};

const generateCodeChallenge = async (codeVerifier: string) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
};

const authorize = async () => {
	const code_verifier = generateCodeVerifier();
	const code_challenge = await generateCodeChallenge(code_verifier);
	const authState = crypto.randomUUID();

	const url = new URL(`${import.meta.env.VITE_KICK_ID_BASE_URL}/oauth/authorize`);
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('client_id', import.meta.env.VITE_CLIENT_ID);
	url.searchParams.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI);
	url.searchParams.append('scope', 'user:read channel:read chat:write events:subscribe');
	url.searchParams.append('code_challenge', code_challenge);
	url.searchParams.append('code_challenge_method', 'S256');
	url.searchParams.append('state', authState);

	chrome.identity.launchWebAuthFlow(
		{ url: url.toString(), interactive: true },
		async (response) => {
			if (chrome.runtime.lastError) throw chrome.runtime.lastError;
			if (!response) throw new Error(`authorize. ${response}`);

			const error = new URL(response).searchParams.get('error');
			if (error) throw new Error(`authorize. ${error}`);

			const code = new URL(response).searchParams.get('code');
			if (!code) throw new Error(`authorize. code`);

			const state = new URL(response).searchParams.get('state');
			if (!state || state !== authState) throw new Error(`authorize. state`);

			const urlToken = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/token`);
			const responseToken = await fetch(urlToken, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code, codeVerifier: code_verifier }),
			});
			const data = await responseToken.json();
			if (!responseToken.ok) throw new Error(data.error);

			chrome.storage.local.set({ ['token']: data }, () => {
				if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
			});
		}
	);
};

export { authorize };
