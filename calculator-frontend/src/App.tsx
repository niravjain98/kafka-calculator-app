import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculator from "./Components/Calculator";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Calculator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
