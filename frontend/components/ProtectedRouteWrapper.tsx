"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Plane } from "lucide-react";

export default function ProtectedRouteWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication on mount and route change
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      
      // If not authenticated and trying to access protected route
      if (!isAuth) {
        // Redirect to sign-in
        router.push("/sign-in");
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading state while checking
  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-100">
        <div className="relative">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200 mb-4"></div>
             <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-primary-200 h-5 w-5" />
        </div>
        <p className="text-light-400 text-sm animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  return <>{children}</>;
}
