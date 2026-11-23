"use client";
import { useEffect, useState } from "react";
import {
   collection,
   query,
   where,
   getDocs,
   doc,
   updateDoc,
   arrayUnion,
   arrayRemove,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Card } from "../../components/ui";

export default function VendorAssign({ req, onChange }) {
   const [vendors, setVendors] = useState([]);

   useEffect(() => {
      getDocs(
         query(collection(db, "companies"), where("type", "==", "vendor")),
      ).then((s) => setVendors(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
   }, []);

   async function toggle(v, on) {
      await updateDoc(doc(db, "requirements", req.id), {
         vendorIds: on ? arrayUnion(v.id) : arrayRemove(v.id),
      });
      onChange();
   }

   return (
      <Card className="p-5">
         <h2 className="mb-3 font-semibold">Assigned vendors</h2>
         <div className="flex flex-wrap gap-4">
            {vendors.map((v) => (
               <label key={v.id} className="flex items-center gap-2 text-sm">
                  <input
                     type="checkbox"
                     checked={(req.vendorIds || []).includes(v.id)}
                     onChange={(e) => toggle(v, e.target.checked)}
                  />
                  {v.name}
               </label>
            ))}
            {vendors.length === 0 && (
               <p className="text-sm text-slate-500">
                  No vendors registered yet.
               </p>
            )}
         </div>
      </Card>
   );
}
