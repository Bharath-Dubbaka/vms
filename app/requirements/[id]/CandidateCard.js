"use client";
import { useState } from "react";
import {
   collection,
   addDoc,
   doc,
   updateDoc,
   getDocs,
   serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { STATUSES, DOC_TYPES } from "@/lib/constants";
import {
   Card,
   Badge,
   STATUS_STYLES,
   inputCls,
   initials,
} from "../../components/ui";

export default function CandidateCard({ cand, user, profile, onChange }) {
   const [open, setOpen] = useState(false);
   const [history, setHistory] = useState([]);
   const [docs, setDocs] = useState([]);
   const [note, setNote] = useState("");
   const [docType, setDocType] = useState(DOC_TYPES[0]);
   const [msg, setMsg] = useState("");

   async function loadDetails() {
      const h = await getDocs(collection(db, "candidates", cand.id, "updates"));
      setHistory(
         h.docs
            .map((d) => d.data())
            .sort((a, b) => (a.at?.seconds || 0) - (b.at?.seconds || 0)),
      );
      const d = await getDocs(
         collection(db, "candidates", cand.id, "documents"),
      );
      setDocs(d.docs.map((x) => x.data()));
   }

   function toggle() {
      if (!open) loadDetails();
      setOpen(!open);
   }

   async function changeStatus(to) {
      if (to === cand.status) return;
      await updateDoc(doc(db, "candidates", cand.id), { status: to });
      await addDoc(collection(db, "candidates", cand.id, "updates"), {
         from: cand.status,
         to,
         note,
         by: user.email,
         at: serverTimestamp(),
      });
      setNote("");
      onChange();
      if (open) loadDetails();
   }

   async function upload(e) {
      const file = e.target.files[0];
      if (!file) return;
      setMsg("Uploading...");
      try {
         const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
         const path = `bgv/${profile.companyId}/${cand.id}/${Date.now()}_${safeName}`;
         await uploadBytes(ref(storage, path), file);
         await addDoc(collection(db, "candidates", cand.id, "documents"), {
            docType,
            fileName: file.name,
            path,
            by: user.email,
            at: serverTimestamp(),
         });
         setMsg("Uploaded ✓");
         loadDetails();
      } catch {
         setMsg("Upload failed (PDF/images under 10 MB only).");
      }
      e.target.value = "";
   }

   async function view(path) {
      window.open(await getDownloadURL(ref(storage, path)), "_blank");
   }

   return (
      <Card className="overflow-hidden">
         <div className="flex flex-wrap items-center gap-4 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
               {initials(cand.name)}
            </span>
            <div className="min-w-0 flex-1">
               <p className="font-medium">{cand.name}</p>
               <p className="truncate text-sm text-slate-500">
                  {[cand.email, cand.phone].filter(Boolean).join(" · ") ||
                     "No contact details"}
               </p>
            </div>
            <input
               className={`${inputCls} hidden max-w-[200px] md:block`}
               placeholder="Note (optional)"
               value={note}
               onChange={(e) => setNote(e.target.value)}
            />
            <select
               value={cand.status}
               onChange={(e) => changeStatus(e.target.value)}
               className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset outline-none ${STATUS_STYLES[cand.status]}`}
            >
               {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
               ))}
            </select>
            <button
               onClick={toggle}
               className="text-sm text-indigo-600 hover:underline"
            >
               {open ? "Hide" : "Details"}
            </button>
         </div>

         {open && (
            <div className="grid gap-6 border-t border-slate-100 bg-slate-50 p-5 md:grid-cols-2">
               <div>
                  <h3 className="mb-3 text-sm font-semibold">
                     Status timeline
                  </h3>
                  <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
                     {history.map((h, i) => (
                        <li key={i} className="relative text-sm">
                           <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                           <div className="flex items-center gap-2">
                              {h.from && (
                                 <>
                                    <Badge>{h.from}</Badge>
                                    <span className="text-slate-400">→</span>
                                 </>
                              )}
                              <Badge>{h.to}</Badge>
                           </div>
                           <p className="mt-1 text-xs text-slate-500">
                              {h.by}
                              {h.at
                                 ? ` · ${new Date(h.at.seconds * 1000).toLocaleString()}`
                                 : ""}
                           </p>
                           {h.note && (
                              <p className="mt-0.5 text-xs italic text-slate-600">
                                 "{h.note}"
                              </p>
                           )}
                        </li>
                     ))}
                  </ol>
               </div>

               <div>
                  <h3 className="mb-3 text-sm font-semibold">BGV documents</h3>
                  <div className="flex gap-2">
                     <select
                        className={`${inputCls} max-w-[160px]`}
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                     >
                        {DOC_TYPES.map((t) => (
                           <option key={t}>{t}</option>
                        ))}
                     </select>
                     <label className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        Upload
                        <input
                           type="file"
                           className="hidden"
                           accept="application/pdf,image/*"
                           onChange={upload}
                        />
                     </label>
                  </div>
                  {msg && <p className="mt-2 text-xs text-slate-600">{msg}</p>}
                  <ul className="mt-3 space-y-2">
                     {docs.map((d, i) => (
                        <li
                           key={i}
                           className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                           <div className="min-w-0">
                              <p className="truncate font-medium">
                                 {d.fileName}
                              </p>
                              <p className="text-xs text-slate-500">
                                 {d.docType}
                              </p>
                           </div>
                           <button
                              onClick={() => view(d.path)}
                              className="text-indigo-600 hover:underline"
                           >
                              View
                           </button>
                        </li>
                     ))}
                     {docs.length === 0 && (
                        <li className="text-sm text-slate-500">
                           No documents uploaded yet.
                        </li>
                     )}
                  </ul>
               </div>
            </div>
         )}
      </Card>
   );
}
