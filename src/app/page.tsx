"use client";

import RoleSelection from "@/components/auth/RoleSelection";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // If the user is logged in and has a role, redirect to /ticket
    if (session && session.role) {
      router.push("/ticket");
    }
  }, [session, router]); // Trigger this effect when session changes

  // If user is not logged in
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-6">
            Please sign in with your Microsoft account to continue.
          </p>
          <button
            onClick={() => signIn("azure-ad")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 focus:outline-none"
          >
            Sign in with Microsoft
          </button>
        </div>
      </div>
    );
  }

  // If user is logged in but doesn't have a role
  if (!session.role) {
    return <RoleSelection />;
  }

  // Optionally, you can show a loading state while the redirection happens
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the ticket page.</p>
      </div>
    </div>
  );
}
