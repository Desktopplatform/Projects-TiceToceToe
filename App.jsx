import { useState } from "react";
import TiceToce from "./components/tice";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TiceToce />
    </>
  );
}

export default App;
