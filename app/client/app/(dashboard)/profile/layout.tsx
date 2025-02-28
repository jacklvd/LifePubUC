"use client"
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfileLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    // Function to check if path is active
    const isActive = (path) => {
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
        <div className="max-w-7xl bg-white min-h-screen flex flex-col">
            {/* Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-50 border-r border-gray-200">
                    <div className="py-4 px-6 border-b border-gray-200 font-semibold text-lg">Account</div>
                    <nav className="py-2">
                        <Link
                            href="/profile"
                            className={`block py-3 px-6 cursor-pointer hover:bg-gray-100 ${isActive('/profile') && !isActive('/profile/bank') ? 'bg-white font-medium text-indigo-600 border-l-4 border-indigo-600' : ''}`}
                        >
                            <p>Contact Info</p>
                        </Link>
                        <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
                            Change Email
                        </div>
                        <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
                            Password
                        </div>
                        <Link
                            href="/profile/bank"
                            className={`block py-3 px-6 cursor-pointer hover:bg-gray-100 ${isActive('/profile/bank') ? 'bg-white font-medium text-indigo-600 border-l-4 border-indigo-600' : ''}`}
                        >
                            Credit/Debit Cards
                        </Link>
                        <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
                            Linked Accounts
                        </div>
                        <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
                            Email Preferences
                        </div>
                        <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
                            Close Account
                        </div>
                        <div className="py-3 px-6 cursor-pointer hover:bg-gray-100">
                            Personal Data
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}