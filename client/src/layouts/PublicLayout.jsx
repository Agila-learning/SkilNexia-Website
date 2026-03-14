import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlobalCursor from '../components/GlobalCursor';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24">
                <Outlet />
            </main>
            <GlobalCursor />
        </div>
    );
};

export default PublicLayout;
