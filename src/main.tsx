import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('Main.tsx loading...');
console.log('Root element:', document.getElementById("root"));

try {
  const root = createRoot(document.getElementById("root")!);
  console.log('React root created successfully');
  root.render(<App />);
  console.log('App component rendered');
} catch (error) {
  console.error('Failed to render app:', error);
  document.getElementById("root")!.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Error Loading App</h1>
      <p>There was an error loading the application.</p>
      <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
    </div>
  `;
}
