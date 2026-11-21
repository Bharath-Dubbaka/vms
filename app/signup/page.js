"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
   createUserWithEmailAndPassword,
   sendEmailVerification,
} from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import { inputCls, btnPrimary } from "../components/ui";

export default function Signup() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [msg, setMsg] = useState("");
   const [ok, setOk] = useState(false);
   const [busy, setBusy] = useState(false);

   async function handleSignup(e) {
      e.preventDefault();
      setMsg("");
      setBusy(true);
      try {
         const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
         );
         await sendEmailVerification(cred.user);
         setOk(true);
         setMsg("Verification link sent. Check your inbox, then log in.");
      } catch (err) {
         setMsg(err.message.replace("Firebase: ", ""));
      }
      setBusy(false);
   }

   return (
      <AuthLayout
         title="Create your account"
         subtitle="Use your corporate email. We'll send a verification link."
      >
         <form onSubmit={handleSignup} className="space-y-4">
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
               <label className="mb-1 block text-sm font-medium">
                  Password
               </label>
               <input
                  className={inputCls}
                  type="password"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <button className={`${btnPrimary} w-full`} disabled={busy}>
               {busy ? "Creating..." : "Sign up"}
            </button>
            {msg && (
               <p
                  className={`rounded-lg p-3 text-sm ${ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}
               >
                  {msg}
               </p>
            )}
         </form>
         <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
               href="/login"
               className="font-medium text-indigo-600 hover:underline"
            >
               Log in
            </Link>
         </p>
      </AuthLayout>
   );
}
