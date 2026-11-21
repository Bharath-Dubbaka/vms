"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
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
            await u.getIdToken(true); // refresh token so rules see email_verified
         }
         if (!u || !u.emailVerified) {
            router.replace("/login");
            return;
         }
         const ref = doc(db, "users", u.uid);
         let snap = await getDoc(ref);
         if (!snap.exists()) {
            await setDoc(ref, {
               email: u.email,
               companyId: u.email.split("@")[1].toLowerCase(),
               role: "user",
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
