import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Comments from "./pages/Comments";
import Reviews from "./pages/Reviews";
import Sidebar from "./components/Sidebar";

function App() {
  const url = "http://localhost:4000";

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="/comments" element={<Comments url={url} />} />
            <Route path="/reviews" element={<Reviews url={url} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;