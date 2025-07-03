import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
declare global {
	interface Window {
		[key: string]: any
	}
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
