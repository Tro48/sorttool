import { useState } from 'react';
import { GlobalSettings, SettingsScript } from './components/types/types';
const settingsApi = window.settings;
export const App: React.FC = () => {
	const [scriptSettings, setScriptSettings] = useState<SettingsScript | null>(
		null
	);
	const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(
		null
	);
	const fetchSettings = async () => {
		const scriptSettings = await settingsApi.getScriptSettings();
		const globalSettings = await settingsApi.getGlobalSettings();
		setScriptSettings(scriptSettings);
		setGlobalSettings(globalSettings);
	};
	fetchSettings();
	return (
		<div>
			<h1>💖 Hello World!</h1>
			<p>{scriptSettings ? JSON.stringify(scriptSettings) : 'Loading...'}</p>
			<p>{globalSettings ? JSON.stringify(globalSettings) : 'Loading...'}</p>
		</div>
	);
};
