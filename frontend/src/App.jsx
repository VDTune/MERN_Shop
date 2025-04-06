import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Home from "./pages/Home";
import Order from "./components/Order";
import Verify from "./pages/Verify";
import MyOrders from "./pages/MyOrders";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup";

export default function App() {

  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/> : <> </>}
        <Header setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/product" element={<Product/>}>
            <Route path =":productId" element={<Product/>} />
          </Route>
          <Route path="/cart" element={<Cart/>} />
          <Route path="/order" element={<Order/>} />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/myorders" element={<MyOrders/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}