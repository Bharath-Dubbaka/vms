"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export function useUser() {
   const router = useRouter();
   const [state, setState] = useState({
      user: null,
      profile: null,
      loading: true,
   });

   useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (u) => {
         if (u) {
            await u.reload();
            await u.getIdToken(true);
         }
         if (!u || !u.emailVerified) {
            router.replace("/login");
            return;
         }
         const ref = doc(db, "users", u.uid);
         let snap = await getDoc(ref);
         if (!snap.exists()) {
            const domain = u.email.split("@")[1].toLowerCase();
            const co = await getDoc(doc(db, "companies", domain));
            if (!co.exists()) {
               await signOut(auth);
               router.replace("/login");
               return;
            }
            await setDoc(ref, {
               email: u.email,
               companyId: domain,
               role: co.data().type, // "staffing" or "vendor"
               createdAt: serverTimestamp(),
            });
            snap = await getDoc(ref);
         }
         setState({ user: u, profile: snap.data(), loading: false });
      });
      return () => unsub();
   }, [router]);

   return state;
}
