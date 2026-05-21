"use client"
import React, { useContext } from 'react'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import Link from 'next/link';

function Header({ children }) {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link href='/' className='btn btn-ghost text-xl'>
                    Interior AI (by 2025810083 강민준)
                </Link>
            </div>
            <div className='flex-none gap-2'>
                <Link href="/dashboard/buy-credits" className='btn btn-ghost'>
                    Buy More Credits
                </Link>
                <button className='btn'>
                    <div className='badge badge-secondary'>
                        {userDetail?.credits}
                    </div>
                    Credits left
                </button>
            </div>
            <div className='flex-none'>
                <UserButton />
            </div>
        </div>
    );
}

export default Header;