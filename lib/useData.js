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
      const q = (name) =>
         query(
            collection(db, name),
            where("companyId", "==", profile.companyId),
         );
      const [r, c] = await Promise.all([
         getDocs(q("requirements")),
         getDocs(q("candidates")),
      ]);
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
