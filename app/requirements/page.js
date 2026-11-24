"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import {
   collection,
   addDoc,
   query,
   where,
   getDocs,
   serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUser } from "../../lib/useUser";
import { useData, countBy } from "../../lib/useData";
import { CATEGORIES } from "../../lib/constants";
import AppShell from "../components/AppShell";
import {
   Card,
   Badge,
   FullLoader,
   inputCls,
   btnPrimary,
   btnGhost,
} from "../components/ui";

export default function Requirements() {
   const { user, profile, loading } = useUser();
   const { reqs, cands, ready, reload } = useData(profile);
   //    const params = useSearchParams();
   const [show, setShow] = useState(false);
   const [search, setSearch] = useState("");
   const [form, setForm] = useState({
      title: "",
      category: CATEGORIES[0],
      openings: 1,
      location: "",
   });
   const [vendors, setVendors] = useState([]);
   const [picked, setPicked] = useState([]);

   useEffect(() => {
      getDocs(
         query(collection(db, "companies"), where("type", "==", "vendor")),
      ).then((s) => setVendors(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
   }, []);

   function togglePick(id) {
      setPicked(
         picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id],
      );
   }

   //    useEffect(() => {
   //       if (params.get("new")) setShow(true);
   //    }, [params]);
   useEffect(() => {
      if (new URLSearchParams(window.location.search).get("new")) setShow(true);
   }, []);

   async function add(e) {
      e.preventDefault();
      if (!form.title) return;
      await addDoc(collection(db, "requirements"), {
         ...form,
         openings: Number(form.openings),
         companyId: profile.companyId,
         status: "Open",
         vendorIds: picked,

         createdBy: user.email,
         createdAt: serverTimestamp(),
      });
      setForm({ ...form, title: "", location: "" });
      setShow(false);
      setPicked([]);
      reload();
   }

   if (loading || !ready) return <FullLoader />;
   const filtered = reqs.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase()),
   );

   return (
      <AppShell
         user={user}
         title="Requirements"
         subtitle="All hiring needs for your company"
         actions={
            profile.role === "staffing" && (
               <button className={btnPrimary} onClick={() => setShow(!show)}>
                  {show ? "Cancel" : "+ New requirement"}
               </button>
            )
         }
      >
         {/* {show && profile.role === "staffing" && (
            <Card className="p-5">
               <form onSubmit={add} className="grid gap-3 md:grid-cols-6">
                  <input
                     className={`${inputCls} md:col-span-2`}
                     placeholder="Title (e.g. Senior Electrician)"
                     required
                     value={form.title}
                     onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                     }
                  />
                  <select
                     className={inputCls}
                     value={form.category}
                     onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                     }
                  >
                     {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                     ))}
                  </select>
                  <input
                     className={inputCls}
                     type="number"
                     min="1"
                     placeholder="Openings"
                     value={form.openings}
                     onChange={(e) =>
                        setForm({ ...form, openings: e.target.value })
                     }
                  />
                  <input
                     className={inputCls}
                     placeholder="Location"
                     value={form.location}
                     onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                     }
                  />
                  <button className={btnPrimary}>Create</button>
               </form>
            </Card>
         )} */}
         {show && profile.role === "staffing" && (
            <Card className="p-5">
               <form onSubmit={add} className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-5">
                     <input
                        className={`${inputCls} md:col-span-2`}
                        placeholder="Title (e.g. Senior Electrician)"
                        required
                        value={form.title}
                        onChange={(e) =>
                           setForm({ ...form, title: e.target.value })
                        }
                     />
                     <select
                        className={inputCls}
                        value={form.category}
                        onChange={(e) =>
                           setForm({ ...form, category: e.target.value })
                        }
                     >
                        {CATEGORIES.map((c) => (
                           <option key={c}>{c}</option>
                        ))}
                     </select>
                     <input
                        className={inputCls}
                        type="number"
                        min="1"
                        placeholder="Openings"
                        value={form.openings}
                        onChange={(e) =>
                           setForm({ ...form, openings: e.target.value })
                        }
                     />
                     <input
                        className={inputCls}
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) =>
                           setForm({ ...form, location: e.target.value })
                        }
                     />
                  </div>

                  <div>
                     <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Assign to vendors</p>
                        {vendors.length > 0 && (
                           <button
                              type="button"
                              className="text-sm text-indigo-600 hover:underline"
                              onClick={() =>
                                 setPicked(
                                    picked.length === vendors.length
                                       ? []
                                       : vendors.map((v) => v.id),
                                 )
                              }
                           >
                              {picked.length === vendors.length
                                 ? "Clear all"
                                 : "Select all"}
                           </button>
                        )}
                     </div>
                     <div className="flex flex-wrap gap-3">
                        {vendors.map((v) => (
                           <label
                              key={v.id}
                              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                           >
                              <input
                                 type="checkbox"
                                 checked={picked.includes(v.id)}
                                 onChange={() => togglePick(v.id)}
                              />
                              {v.name}
                           </label>
                        ))}
                        {vendors.length === 0 && (
                           <p className="text-sm text-slate-500">
                              No vendors yet. Add them in the Vendors tab.
                           </p>
                        )}
                     </div>
                     <p className="mt-2 text-xs text-slate-500">
                        Leave empty to assign later.
                     </p>
                  </div>

                  <button className={btnPrimary}>Create requirement</button>
               </form>
            </Card>
         )}
         <input
            className={`${inputCls} max-w-xs`}
            placeholder="Search requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />

         <Card className="overflow-x-auto">
            <table className="w-full text-sm">
               <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                     <th className="px-5 py-3">Requirement</th>
                     <th>Category</th>
                     <th>Location</th>
                     <th>Vendors</th>
                     <th className="text-center">Openings</th>
                     <th className="text-center">Submitted</th>
                     <th className="text-center">Joined</th>
                     <th>Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => {
                     const rc = cands.filter((c) => c.requirementId === r.id);
                     return (
                        <tr key={r.id} className="transition hover:bg-slate-50">
                           <td className="px-5 py-3">
                              <Link
                                 href={`/requirements/${r.id}`}
                                 className="font-medium text-indigo-600 hover:underline"
                              >
                                 {r.title}
                              </Link>
                           </td>
                           <td>{r.category}</td>
                           <td>{r.location || "-"}</td>
                           <td>
                              {(r.vendorIds || []).length === 0
                                 ? "-"
                                 : (r.vendorIds || [])
                                      .map(
                                         (id) =>
                                            vendors.find((v) => v.id === id)
                                               ?.name || id,
                                      )
                                      .join(", ")}
                           </td>
                           <td className="text-center">{r.openings}</td>
                           <td className="text-center">{rc.length}</td>
                           <td className="text-center">
                              {countBy(rc, "Joined")}
                           </td>
                           <td>
                              <Badge>{r.status || "Open"}</Badge>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
            {filtered.length === 0 && (
               <p className="p-8 text-center text-sm text-slate-500">
                  No requirements found.
               </p>
            )}
         </Card>
      </AppShell>
   );
}
