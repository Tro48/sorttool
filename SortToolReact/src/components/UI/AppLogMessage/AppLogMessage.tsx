import { RefObject, useEffect, useRef } from 'react';
import style from './AppLogMessage.module.css';
type Props = {
	textContent?: string;
	messageError?: boolean;
	addElement?: (messageRef: RefObject<HTMLLIElement>) => void;
};
export const AppLogMessage = ({
	textContent,
	messageError,
	addElement,
}: Props) => {
	const messageRef = useRef<HTMLLIElement>(null);
	const styleMessage = messageError ? style.error : style.ok;
	const tyme = new Date().toLocaleTimeString('ru-RU');
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		messageRef.current ? addElement(messageRef) : null;
	}, [addElement, messageRef]);
	return (
		<li ref={messageRef} className={style.message} tabIndex={0}>
			<p className={styleMessage}>
				<span className={style.notification}>{tyme}</span>
				{textContent}
			</p>
		</li>
	);
};
