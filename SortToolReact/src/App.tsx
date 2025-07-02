import React from "react";
import { SettingsScript } from "./components/types/types";
let settings:SettingsScript
window.preload.getSettingsScript().then((res: SettingsScript) => settings = res)
export const App: React.FC = () => {
  console.log(settings)
  return (
    <div>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
    </div>
  );
}