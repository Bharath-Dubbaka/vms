"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function RedirectIfAuthed() {
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      await u.reload();
      if (u.emailVerified) router.replace("/dashboard");
    });
    return () => unsub();
  }, [router]);
  return null;
}