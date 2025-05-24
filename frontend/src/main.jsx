import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import AdminContext from "./context/AdminContext.jsx";
import MobileResponsiveness from "./context/MobileResponsiveness.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <MobileResponsiveness>
      <UserContext>
        <AdminContext>
          <App />
        </AdminContext>
      </UserContext>
      </MobileResponsiveness>
    </BrowserRouter>
  </StrictMode>
);
