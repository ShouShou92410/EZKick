/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLIENT_ID: string;
	readonly VITE_REDIRECT_URI: string;
	readonly VITE_API_BASE_URL: string;
	readonly VITE_KICK_BASE_URL: string;
	readonly VITE_KICK_API_BASE_URL: string;
	readonly VITE_KICK_ID_BASE_URL: string;
	readonly VITE_KICK_FILES_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
