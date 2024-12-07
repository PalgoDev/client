"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();
  const handleLogin = () => (session ? signOut() : signIn("google"));

  return (
    <div className="w-content">
      {session ? (
        <button onClick={handleLogin}>{session.user?.email ?? "User"} - Log Out</button>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-blue-700 text-white hover:bg-blue-800 w-content"
        >
          <img src="/google.png" alt="Google" className="w-4 h-4" />
          Sign in with Google
        </button>
      )}
    </div>
  );
}
