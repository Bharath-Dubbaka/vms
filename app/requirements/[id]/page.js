"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
   collection,
   addDoc,
   doc,
   getDoc,
   serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUser } from "../../../lib/useUser";
import { useData, countBy } from "../../../lib/useData";
import { STATUSES } from "../../../lib/constants";
import AppShell from "../../components/AppShell";
import {
   Card,
   Badge,
   FullLoader,
   inputCls,
   btnPrimary,
} from "../../components/ui";
import CandidateCard from "./CandidateCard";

export default function RequirementDetail() {
   const { id } = useParams();
   const { user, profile, loading } = useUser();
   const { cands, ready, reload } = useData(profile);
   const [req, setReq] = useState(null);
   const [show, setShow] = useState(false);
   const [form, setForm] = useState({ name: "", email: "", phone: "" });

   useEffect(() => {
      if (!profile) return;
      getDoc(doc(db, "requirements", id)).then(
         (r) => r.exists() && setReq({ id: r.id, ...r.data() }),
      );
   }, [profile, id]);

   async function addCandidate(e) {
      e.preventDefault();
      const ref = await addDoc(collection(db, "candidates"), {
         ...form,
         requirementId: id,
         companyId: profile.companyId,
         status: STATUSES[0],
         createdBy: user.email,
         createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, "candidates", ref.id, "updates"), {
         from: null,
         to: STATUSES[0],
         note: "Candidate submitted",
         by: user.email,
         at: serverTimestamp(),
      });
      setForm({ name: "", email: "", phone: "" });
      setShow(false);
      reload();
   }

   if (loading || !ready || !req) return <FullLoader />;
   const rc = cands.filter((c) => c.requirementId === id);

   const stats = [
      ["Openings", req.openings],
      ["Submitted", rc.length],
      ["Shortlisted", countBy(rc, "Shortlisted")],
      ["Interview", countBy(rc, "Interview")],
      ["Offered", countBy(rc, "Offered")],
      ["Joined", countBy(rc, "Joined")],
   ];

   return (
      <AppShell
         user={user}
         title={req.title}
         subtitle={`${req.category} · ${req.location || "No location"}`}
         actions={
            <>
               <Link
                  href="/requirements"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
               >
                  ← Back
               </Link>
               <button className={btnPrimary} onClick={() => setShow(!show)}>
                  {show ? "Cancel" : "+ Submit candidate"}
               </button>
            </>
         }
      >
         <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {stats.map(([l, v]) => (
               <Card key={l} className="p-4 text-center">
                  <p className="text-2xl font-semibold">{v}</p>
                  <p className="text-xs text-slate-500">{l}</p>
               </Card>
            ))}
         </div>

         {show && (
            <Card className="p-5">
               <form
                  onSubmit={addCandidate}
                  className="grid gap-3 md:grid-cols-4"
               >
                  <input
                     className={inputCls}
                     placeholder="Full name"
                     required
                     value={form.name}
                     onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                     }
                  />
                  <input
                     className={inputCls}
                     placeholder="Email"
                     value={form.email}
                     onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                     }
                  />
                  <input
                     className={inputCls}
                     placeholder="Phone"
                     value={form.phone}
                     onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                     }
                  />
                  <button className={btnPrimary}>Submit</button>
               </form>
            </Card>
         )}

         <div className="space-y-3">
            <h2 className="font-semibold">
               Candidates <span className="text-slate-400">({rc.length})</span>
            </h2>
            {rc.map((c) => (
               <CandidateCard
                  key={c.id}
                  cand={c}
                  user={user}
                  profile={profile}
                  onChange={reload}
               />
            ))}
            {rc.length === 0 && (
               <Card className="p-8 text-center text-sm text-slate-500">
                  No candidates yet. Submit the first one.
               </Card>
            )}
         </div>
      </AppShell>
   );
}
