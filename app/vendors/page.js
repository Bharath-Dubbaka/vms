//app/vendors/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
   collection,
   query,
   where,
   getDocs,
   doc,
   setDoc,
   serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUser } from "../../lib/useUser";
import { useData, countBy, pct } from "../../lib/useData";
import AppShell from "../components/AppShell";
import {
   Card,
   Badge,
   FullLoader,
   inputCls,
   btnPrimary,
} from "../components/ui";

export default function Vendors() {
   const { user, profile, loading } = useUser();
   const { reqs, cands, ready } = useData(profile);
   const [vendors, setVendors] = useState([]);
   const [open, setOpen] = useState(null);
   const [show, setShow] = useState(false);
   const [form, setForm] = useState({ name: "", domain: "" });
   const [msg, setMsg] = useState("");

   async function loadVendors() {
      const s = await getDocs(
         query(collection(db, "companies"), where("type", "==", "vendor")),
      );
      setVendors(s.docs.map((d) => ({ id: d.id, ...d.data() })));
   }
   useEffect(() => {
      if (profile) loadVendors();
   }, [profile]);

   async function addVendor(e) {
      e.preventDefault();
      setMsg("");
      const domain = form.domain.trim().toLowerCase();
      try {
         await setDoc(doc(db, "companies", domain), {
            name: form.name.trim(),
            type: "vendor",
            createdAt: serverTimestamp(),
         });
         setForm({ name: "", domain: "" });
         setShow(false);
         loadVendors();
      } catch {
         setMsg("Could not add vendor. It may already exist.");
      }
   }

   if (loading || !ready) return <FullLoader />;
   if (profile.role !== "staffing")
      return <p className="p-8">This page is only for staffing users.</p>;

   return (
      <AppShell
         user={user}
         title="Vendors"
         subtitle="Vendors, their requirements and submissions"
         actions={
            <button className={btnPrimary} onClick={() => setShow(!show)}>
               {show ? "Cancel" : "+ Add vendor"}
            </button>
         }
      >
         {show && (
            <Card className="p-5">
               <form onSubmit={addVendor} className="grid gap-3 md:grid-cols-3">
                  <input
                     className={inputCls}
                     placeholder="Vendor name"
                     required
                     value={form.name}
                     onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                     }
                  />
                  <input
                     className={inputCls}
                     placeholder="Email domain (e.g. vendorabc.com)"
                     required
                     value={form.domain}
                     onChange={(e) =>
                        setForm({ ...form, domain: e.target.value })
                     }
                  />
                  <button className={btnPrimary}>Add vendor</button>
               </form>
               {msg && <p className="mt-3 text-sm text-rose-700">{msg}</p>}
               <p className="mt-3 text-xs text-slate-500">
                  Anyone who signs up with this email domain becomes part of
                  this vendor.
               </p>
            </Card>
         )}

         <Card className="overflow-x-auto">
            <table className="w-full text-sm">
               <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                     <th className="px-5 py-3">Vendor</th>
                     <th className="text-center">Requirements</th>
                     <th className="text-center">Submitted</th>
                     <th className="text-center">Interview</th>
                     <th className="text-center">Offered</th>
                     <th className="text-center">Joined</th>
                     <th className="text-center">Join rate</th>
                  </tr>
               </thead>
               <tbody>
                  {vendors.map((v) => {
                     const vr = reqs.filter((r) =>
                        (r.vendorIds || []).includes(v.id),
                     );
                     const vc = cands.filter((c) => c.vendorId === v.id);
                     const joined = countBy(vc, "Joined");
                     return (
                        <FragmentRow key={v.id}>
                           <tr
                              className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                              onClick={() =>
                                 setOpen(open === v.id ? null : v.id)
                              }
                           >
                              <td className="px-5 py-3">
                                 <p className="font-medium">{v.name}</p>
                                 <p className="text-xs text-slate-500">
                                    {v.id}
                                 </p>
                              </td>
                              <td className="text-center">{vr.length}</td>
                              <td className="text-center">{vc.length}</td>
                              <td className="text-center">
                                 {countBy(vc, "Interview")}
                              </td>
                              <td className="text-center">
                                 {countBy(vc, "Offered")}
                              </td>
                              <td className="text-center">{joined}</td>
                              <td className="text-center">
                                 {pct(joined, vc.length)}
                              </td>
                           </tr>
                           {open === v.id && (
                              <tr className="bg-slate-50">
                                 <td
                                    colSpan={7}
                                    className="grid gap-6 px-5 py-4 md:grid-cols-2"
                                 >
                                    <div>
                                       <h3 className="mb-2 text-sm font-semibold">
                                          Assigned requirements
                                       </h3>
                                       <ul className="space-y-1">
                                          {vr.map((r) => (
                                             <li key={r.id}>
                                                <Link
                                                   href={`/requirements/${r.id}`}
                                                   className="text-indigo-600 hover:underline"
                                                >
                                                   {r.title}
                                                </Link>
                                             </li>
                                          ))}
                                          {vr.length === 0 && (
                                             <li className="text-slate-500">
                                                None assigned.
                                             </li>
                                          )}
                                       </ul>
                                    </div>
                                    <div>
                                       <h3 className="mb-2 text-sm font-semibold">
                                          Candidates submitted
                                       </h3>
                                       <ul className="space-y-1">
                                          {vc.map((c) => (
                                             <li
                                                key={c.id}
                                                className="flex items-center justify-between"
                                             >
                                                <span>{c.name}</span>
                                                <Badge>{c.status}</Badge>
                                             </li>
                                          ))}
                                          {vc.length === 0 && (
                                             <li className="text-slate-500">
                                                No submissions yet.
                                             </li>
                                          )}
                                       </ul>
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </FragmentRow>
                     );
                  })}
               </tbody>
            </table>
            {vendors.length === 0 && (
               <p className="p-8 text-center text-sm text-slate-500">
                  No vendors yet. Add your first one.
               </p>
            )}
         </Card>
      </AppShell>
   );
}

function FragmentRow({ children }) {
   return <>{children}</>;
}
