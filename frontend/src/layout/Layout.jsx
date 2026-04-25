import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../pages/Chatbot";
import ScrollToHash from "./ScrollToHash";   // 👈 add this

function Layout() {
  return (
    <>
      <Header />
      <ScrollToHash />   {/* 👈 add this line */}
      <main style={{ marginTop: "50px", minHeight: "50vh" }}>
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </>
  );
}

export default Layout;