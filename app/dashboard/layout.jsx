import React from "react"
import Header from './_components/Header'

function DashboardLayout({ children }) {
    return (
        <div>
            <Header />
            <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}


export default DashboardLayout;