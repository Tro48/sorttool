import { useState } from 'react';
import { SectionControl } from '../SectionControl/SectionControl';
import { calculateClass } from '../scripts/scripts';
import style from './App.module.css';
export const App: React.FC = () => {
	const [clickOnSettings, setClickOnSettings] = useState(false);
	const [clickOnPlay, setClickOnPlay] = useState(false);

	return (
		<main
			className={
				clickOnSettings
					? calculateClass([style.app, style.settingsActive])
					: style.app
			}
		>
			<SectionControl
				setClickOnSettings={setClickOnSettings}
				clickOnSettings={clickOnSettings}
				clickOnPlay={clickOnPlay}
				setClickOnPlay={setClickOnPlay}
			/>
			<section className={style.settings}>
				<div className="app-settings_add-folder-section">
					<button
						type="button"
						className="button add-button app-settings_add-folder-button"
					></button>
				</div>
				<div className="app-settings_tabs">
					<nav className="app-settings_tabs-items"></nav>
				</div>
				<div className="app-settings_content-block"></div>
			</section>
		</main>
	);
};
