import { JSX } from 'react';
import styleSpinner from '../animation/Spiner.module.css';
import { AppLog } from '../AppLog/AppLog';
import { Button } from '../Button/Button';
import styleButton from './Button.module.css';
import { calculateClass } from '../scripts/scripts';
import style from './SectionControl.module.css';

type Props = {
	setClickOnSettings?: (value: boolean) => void;
	clickOnSettings?: boolean;
	setClickOnPlay?: (value: boolean) => void;
	clickOnPlay?: boolean;
};

export const SectionControl = ({
	setClickOnSettings,
	clickOnSettings,
	setClickOnPlay,
	clickOnPlay,
}: Props): JSX.Element => {
	const newClassName = (): string => {
		if (!clickOnSettings) {
			return clickOnPlay
				? calculateClass([styleButton.buttonPlay, styleSpinner.spinner])
				: styleButton.buttonPlay;
		} else {
			return clickOnPlay
				? calculateClass([
						styleButton.buttonPlay,
						styleButton.buttonPlaySettingsActive,
						styleSpinner.spinner,
					])
				: calculateClass([
						styleButton.buttonPlay,
						styleButton.buttonPlaySettingsActive,
					]);
		}
	};
	const newClass = newClassName();
	return (
		<section className={style.controlSection}>
			<Button
				buttonType="button"
				onClick={() => {
					setClickOnSettings(!clickOnSettings);
				}}
				buttonContent={
					<span className={styleButton.buttonTextBlock}>settings</span>
				}
				buttonClass={
					clickOnSettings
						? styleButton.buttonSettingsActive
						: styleButton.buttonSettings
				}
			/>
			<div className={style.buttonSection}>
				<Button
					buttonType="button"
					onClick={() => {
						setClickOnPlay(!clickOnPlay);
					}}
					buttonContent={
						<div
							className={
								clickOnPlay ? styleButton.stopIcon : styleButton.playIcon
							}
						></div>
					}
					buttonClass={newClass}
				/>
			</div>
			<AppLog clickOnSettings={clickOnSettings} />
		</section>
	);
};
