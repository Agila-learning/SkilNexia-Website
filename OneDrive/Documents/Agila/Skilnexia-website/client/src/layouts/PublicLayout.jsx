import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import GlobalCursor from '../components/GlobalCursor';
import BackToTop from '../components/BackToTop';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24">
                <Outlet />
            </main>
            <Footer />
            <ChatWidget />
            <GlobalCursor />
            <BackToTop />
        </div>
    );
};

export default PublicLayout;
