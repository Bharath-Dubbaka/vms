"use client";
import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export function useData(profile) {
   const [reqs, setReqs] = useState([]);
   const [cands, setCands] = useState([]);
   const [ready, setReady] = useState(false);

   const reload = useCallback(async () => {
      if (!profile) return;
      const isVendor = profile.role === "vendor";
      const reqQ = isVendor
         ? query(
              collection(db, "requirements"),
              where("vendorIds", "array-contains", profile.companyId),
           )
         : query(
              collection(db, "requirements"),
              where("companyId", "==", profile.companyId),
           );
      const candQ = isVendor
         ? query(
              collection(db, "candidates"),
              where("vendorId", "==", profile.companyId),
           )
         : query(
              collection(db, "candidates"),
              where("companyId", "==", profile.companyId),
           );
      const [r, c] = await Promise.all([getDocs(reqQ), getDocs(candQ)]);
      setReqs(r.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCands(c.docs.map((d) => ({ id: d.id, ...d.data() })));
      setReady(true);
   }, [profile]);

   useEffect(() => {
      reload();
   }, [reload]);

   return { reqs, cands, ready, reload };
}

export const countBy = (list, status) =>
   list.filter((c) => c.status === status).length;
export const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "0%");
