import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./tokens.css";
import "./styles.css";

const el = document.getElementById("root");
el.hasChildNodes() ? hydrateRoot(el, <App />) : createRoot(el).render(<App />);
