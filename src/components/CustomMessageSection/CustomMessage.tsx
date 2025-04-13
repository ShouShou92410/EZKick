import { useState } from 'react';
import { Message } from '../../type';
import CustomMessageRenderer from './CustomMessageRenderer';
import CustomMessageEditor from './CustomMessageEditor';

enum Mode {
	Render = 'render',
	Edit = 'edit',
}

type Props = Message;
const CustomMessage = ({ id, value }: Props) => {
	const [mode, setMode] = useState(Mode.Render);

	return {
		[Mode.Render]: (
			<CustomMessageRenderer id={id} value={value} onEdit={() => setMode(Mode.Edit)} />
		),
		[Mode.Edit]: (
			<CustomMessageEditor id={id} value={value} onCompleted={() => setMode(Mode.Render)} />
		),
	}[mode];
};

export default CustomMessage;
