import "./index.css";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/button";

const App = () => {
  return <Button>Click me</Button>;
};

createRoot(document.getElementById("app")!).render(<App />);
