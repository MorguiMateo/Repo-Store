import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => { 
    return (
        <div className="min-h-screen bg-bg-base">
            <Navbar />
            <main className="max-w-7xl mx-auto px-16">
                <Outlet />
            </main>
        </div>
  );
};

export default Layout;