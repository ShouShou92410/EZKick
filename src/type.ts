type MessageID = `${string}-${string}-${string}-${string}-${string}`;

type Message = {
	id: MessageID;
	value: string;
};

type Emote = {
	id: number;
	name: string;
};

type Token = {
	access_token: string;
	refresh_token: string;
};

export type { MessageID, Message, Emote, Token };
