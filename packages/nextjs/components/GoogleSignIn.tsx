"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  const handleLogin = () => {
    session ? signOut() : signIn();
  };

  return (
    <button
      className={`border border-transparent rounded px-4 py-2 transition-colors ${
        session
          ? "bg-transparent hover:bg-gray-300 text-black border rounded-md border-gray-300 border-1"
          : "bg-blue-500 hover:bg-blue-700 text-white"
      }`}
      onClick={handleLogin}
    >
      {session ? `${session.user?.email ?? "User"} - Log Out` : "Google Log In"}
    </button>
  );
}
