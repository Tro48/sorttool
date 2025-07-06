import { JSX } from 'react';
import style from './Button.module.css';
type Props = {
	buttonType: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	buttonContent?: React.ReactNode;
	buttonClass?: string;
};
export const Button = <PROPS extends Props>({
	buttonType,
	onClick,
	buttonContent,
	buttonClass,
}: PROPS): JSX.Element => {
	return (
		<button
			onClick={onClick}
			type={buttonType}
			className={style.button + ' ' + buttonClass}
		>
			{buttonContent}
		</button>
	);
};
