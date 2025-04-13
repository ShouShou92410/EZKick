import { createContext, Dispatch, JSX, SetStateAction, useContext } from 'react';
import { Emote } from '../../type';

type Stream = {
	user_id: number;
	name: string;
} | null;

type StreamContext = {
	stream: Stream;
	setStream: Dispatch<SetStateAction<Stream>>;
	fetchStreamUserId: () => Promise<number | void>;
	emotes: Emote[];
	emoteParser: (value: string) => string;
	emoteRenderer: (value: string) => string | JSX.Element;
};

const streamContext = createContext<StreamContext>({
	stream: null,
	setStream: () => {},
	fetchStreamUserId: async () => {},
	emotes: [],
	emoteParser: () => '',
	emoteRenderer: () => '',
});

const useStream = () => useContext(streamContext);

export { streamContext, useStream };
export type { Stream };
