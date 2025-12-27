"use client";

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import ProtectedRouteWrapper from '@/components/ProtectedRouteWrapper'
import React, { ReactNode, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { isAuthenticated, getUser, logout } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'

const Layout = ({children}: {children: ReactNode}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, [pathname]); 

  const handleLogout = () => {
    logout();
    setUser(null);
    router.refresh();
    router.push('/sign-in');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-dark-100 bg-none font-sans selection:bg-primary-200/30">
        <nav className="border-b border-white/5 bg-dark-100/80 backdrop-blur-xl sticky top-0 z-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link href='/' className='flex items-center gap-3 group'>
                    <Logo size="md" />
                    <h2 className='text-white font-bold text-xl tracking-tight group-hover:text-primary-200 transition-colors'>Aero Prep</h2>
                </Link>

                <div className="flex items-center gap-4">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-light-400 hidden sm:inline">Pilot: <span className="text-white font-medium">{user.name}</span></span>
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer text-light-400 hover:text-white hover:bg-white/5">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Link href="/sign-in" className="text-sm font-medium text-light-400 hover:text-white transition-colors py-2">Sign In</Link>
                      <Link href="/sign-up" className="btn-primary flex items-center text-sm py-2 px-4 shadow-lg shadow-primary-200/20">Get Started</Link>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </nav>
        {children}
    </main>
  )
}

export default Layout
