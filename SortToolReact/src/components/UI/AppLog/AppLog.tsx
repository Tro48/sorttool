import { RefObject, useEffect, useRef } from 'react';
import { AppLogMessage } from '../AppLogMessage/AppLogMessage';
import { calculateClass } from '../scripts/scripts';
import style from './AppLog.module.css';
type Props = {
	clickOnSettings: boolean;
};
const message = [
	{ textContent: 'test', messageError: false },
	{ textContent: 'test2', messageError: true },
	{ textContent: 'test3', messageError: false },
	{ textContent: 'test4', messageError: false },
	{ textContent: 'test5', messageError: true },
	{ textContent: 'test', messageError: false },
	{ textContent: 'test2', messageError: true },
	{ textContent: 'test3', messageError: false },
	{ textContent: 'test4', messageError: false },
	{ textContent: 'test5', messageError: true },
	{ textContent: 'test', messageError: false },
	{ textContent: 'test2', messageError: true },
	{ textContent: 'test3', messageError: false },
	{ textContent: 'test4', messageError: false },
	{ textContent: 'test5', messageError: true },
	{ textContent: 'test', messageError: false },
	{ textContent: 'test2', messageError: true },
	{ textContent: 'test3', messageError: false },
	{ textContent: 'test4', messageError: false },
	{ textContent: 'test5', messageError: true },
];
export const AppLog = ({ clickOnSettings }: Props) => {
	const listMessageRef = useRef([]);
	const addElement = (newElement: RefObject<HTMLLIElement>) => {
		listMessageRef.current.push(newElement);
	};
	useEffect(() => {
		if (listMessageRef.current.length > 0) {
			const lastMessage =
				listMessageRef.current[listMessageRef.current.length - 1];
			lastMessage.current.focus();
		}
	}, [listMessageRef]);
	return (
		<ul
			className={
				clickOnSettings
					? calculateClass([style.section, style.sectionNone])
					: style.section
			}
		>
			{message.map((item, index) => {
				return (
					<AppLogMessage
						addElement={addElement}
						key={index}
						textContent={item.textContent}
						messageError={item.messageError}
					/>
				);
			})}
		</ul>
	);
};
