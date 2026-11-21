"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import {
   signInWithEmailAndPassword,
   sendEmailVerification,
} from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import { inputCls, btnPrimary } from "../components/ui";

export default function Login() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [msg, setMsg] = useState("");
   const [needsVerify, setNeedsVerify] = useState(false);
   const [busy, setBusy] = useState(false);

   async function handleLogin(e) {
      e.preventDefault();
      setMsg("");
      setNeedsVerify(false);
      setBusy(true);
      try {
         const cred = await signInWithEmailAndPassword(auth, email, password);
         await cred.user.reload();
         if (!cred.user.emailVerified) {
            setNeedsVerify(true);
            setMsg("Your email isn't verified yet. Check your inbox.");
            setBusy(false);
            return;
         }
         router.push("/dashboard");
      } catch {
         setMsg("Invalid email or password.");
         setBusy(false);
      }
   }

   async function resend() {
      try {
         await sendEmailVerification(auth.currentUser);
         setMsg("Verification link sent again. Check your inbox.");
      } catch {
         setMsg("Please wait a few minutes before requesting another email.");
      }
   }

   return (
      <AuthLayout
         title="Welcome back"
         subtitle="Log in with your work email to continue."
      >
         <form onSubmit={handleLogin} className="space-y-4">
            <div>
               <label className="mb-1 block text-sm font-medium">
                  Work email
               </label>
               <input
                  className={inputCls}
                  type="email"
                  placeholder="you@company.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div>
               <div className="mb-1 flex justify-between text-sm">
                  <label className="font-medium">Password</label>
                  <Link
                     href="/forgot-password"
                     className="text-indigo-600 hover:underline"
                  >
                     Forgot?
                  </Link>
               </div>
               <input
                  className={inputCls}
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <button className={`${btnPrimary} w-full`} disabled={busy}>
               {busy ? "Signing in..." : "Log in"}
            </button>
            {msg && (
               <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  {msg}
               </p>
            )}
            {needsVerify && (
               <button
                  type="button"
                  onClick={resend}
                  className="text-sm text-indigo-600 underline"
               >
                  Resend verification email
               </button>
            )}
         </form>
         <p className="mt-6 text-center text-sm text-slate-600">
            New here?{" "}
            <Link
               href="/signup"
               className="font-medium text-indigo-600 hover:underline"
            >
               Create an account
            </Link>
         </p>
      </AuthLayout>
   );
}
