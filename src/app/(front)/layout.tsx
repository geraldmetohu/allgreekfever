import { type ReactNode } from "react";
import Footer from "../components/front/Footer";
import { NavBar } from "../components/front/Navbar";

export default function StoreFrontLayout({children}: {children: ReactNode}) {
    return (
        <>
            <NavBar/>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <Footer/>
        </>
    );
}