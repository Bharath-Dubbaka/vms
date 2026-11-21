"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import { inputCls, btnPrimary } from "../components/ui";

export default function ForgotPassword() {
   const [email, setEmail] = useState("");
   const [msg, setMsg] = useState("");

   async function handleReset(e) {
      e.preventDefault();
      try {
         await sendPasswordResetEmail(auth, email);
      } catch {}
      setMsg("If that account exists, we've sent a reset link.");
   }

   return (
      <AuthLayout
         title="Reset your password"
         subtitle="Enter your work email and we'll send a reset link."
      >
         <form onSubmit={handleReset} className="space-y-4">
            <input
               className={inputCls}
               type="email"
               placeholder="you@company.com"
               required
               onChange={(e) => setEmail(e.target.value)}
            />
            <button className={`${btnPrimary} w-full`}>Send reset link</button>
            {msg && (
               <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                  {msg}
               </p>
            )}
         </form>
         <p className="mt-6 text-center text-sm">
            <Link href="/login" className="text-indigo-600 hover:underline">
               ← Back to login
            </Link>
         </p>
      </AuthLayout>
   );
}
