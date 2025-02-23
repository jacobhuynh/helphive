"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { SignedNav } from "@/components/signedNav";

export function Navigation() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem("userEmail");
      setIsSignedIn(!!userEmail);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <div>
      {isSignedIn ? <SignedNav setIsSignedIn={setIsSignedIn} /> : <Nav />}
    </div>
  );
}
