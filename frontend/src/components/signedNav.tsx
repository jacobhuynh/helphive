"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignedNav({
  setIsSignedIn,
}: {
  setIsSignedIn: (state: boolean) => void;
}) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    setIsSignedIn(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-16">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <span className="text-black font-bold text-lg">HelpHive</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link
                href="/dashboard"
                className="text-gray-900 hover:text-green-500 transition-colors"
              >
                Dashboard
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
            <div className="relative group">
              <Link
                href="/tracker"
                className="text-black hover:text-green-500 transition-colors"
              >
                Tracker
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
            <div className="relative group">
              <Link
                href="/leaderboard"
                className="text-black hover:text-green-500 transition-colors"
              >
                Leaderboard
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-transform transform hover:bg-green-600 hover:scale-105"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
