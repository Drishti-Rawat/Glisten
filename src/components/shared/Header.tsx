'use client'
import React from 'react'
import { Satisfy } from "next/font/google";
import Link from 'next/link';
import { Search, ShoppingBag} from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
const rugeBoogie = Satisfy({
    subsets: ["latin"],
    weight: "400",
  });

const Header = () => {
  return (
    <header className=" bg-white sticky top-0 z-20">
    <div className="wrapper flex justify-between items-center ">
      
     
      <nav className='  flex gap-20 justify-around items-center'>
      <Link href="/" className={`${rugeBoogie.className}  text-primary-600 h1-bold`}>
        Glisten
      </Link>
        <ul className='flex gap-4 space-x-9'>
            <li>Men</li>
            <li>Women</li>
            <li>Kid</li>
        </ul>
      </nav>

      <nav className='flex gap-6'>
        <Search/>
        <ShoppingBag/>
        <SignedIn>
                <UserButton afterSwitchSessionUrl="/" />

            </SignedIn>
            <SignedOut>
            <Link href="/sign-in">Sign In</Link>
            </SignedOut>
      </nav>
      </div>
    </header>
  )
}

export default Header