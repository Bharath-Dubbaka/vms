"use client";
import Link from "next/link";
import { useUser } from "../../lib/useUser";
import { useData, countBy, pct } from "../../lib/useData";
import { STATUSES } from "../../lib/constants";
import AppShell from "../components/AppShell";
import { Card, FullLoader, BAR_COLORS } from "../components/ui";

export default function Analytics() {
   const { user, profile, loading } = useUser();
   const { reqs, cands, ready } = useData(profile);
   if (loading || !ready) return <FullLoader />;

   const total = cands.length;
   const max = Math.max(1, ...STATUSES.map((s) => countBy(cands, s)));
   const interviewPlus = cands.filter((c) =>
      ["Interview", "Offered", "Joined"].includes(c.status),
   ).length;
   const offerPlus = cands.filter((c) =>
      ["Offered", "Joined"].includes(c.status),
   ).length;

   const kpis = [
      ["Requirements", reqs.length],
      ["Submissions", total],
      ["Interview rate", pct(interviewPlus, total)],
      ["Offer rate", pct(offerPlus, total)],
   ];

   return (
      <AppShell
         user={user}
         title="Analytics"
         subtitle="Hiring funnel and requirement performance"
      >
         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map(([l, v]) => (
               <Card key={l} className="p-5">
                  <p className="text-sm text-slate-500">{l}</p>
                  <p className="mt-2 text-3xl font-semibold">{v}</p>
               </Card>
            ))}
         </div>

         <Card className="p-6">
            <h2 className="mb-5 font-semibold">Candidates by status</h2>
            <div className="flex h-48 items-end gap-4">
               {STATUSES.map((s) => (
                  <div
                     key={s}
                     className="flex flex-1 flex-col items-center gap-2"
                  >
                     <span className="text-sm font-medium">
                        {countBy(cands, s)}
                     </span>
                     <div
                        className={`w-full max-w-[64px] rounded-t-lg ${BAR_COLORS[s]}`}
                        style={{
                           height: `${(countBy(cands, s) / max) * 100}%`,
                           minHeight: 4,
                        }}
                     />
                     <span className="text-xs text-slate-500">{s}</span>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="overflow-x-auto">
            <h2 className="p-5 pb-3 font-semibold">Per requirement</h2>
            <table className="w-full text-sm">
               <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                     <th className="px-5 py-3">Requirement</th>
                     <th className="text-center">Openings</th>
                     <th className="text-center">Submitted</th>
                     <th className="text-center">Interview</th>
                     <th className="text-center">Offered</th>
                     <th className="text-center">Joined</th>
                     <th className="text-center">Rejected</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {reqs.map((r) => {
                     const rc = cands.filter((c) => c.requirementId === r.id);
                     return (
                        <tr key={r.id} className="hover:bg-slate-50">
                           <td className="px-5 py-3">
                              <Link
                                 href={`/requirements/${r.id}`}
                                 className="font-medium text-indigo-600 hover:underline"
                              >
                                 {r.title}
                              </Link>
                           </td>
                           <td className="text-center">{r.openings}</td>
                           <td className="text-center">{rc.length}</td>
                           <td className="text-center">
                              {countBy(rc, "Interview")}
                           </td>
                           <td className="text-center">
                              {countBy(rc, "Offered")}
                           </td>
                           <td className="text-center">
                              {countBy(rc, "Joined")}
                           </td>
                           <td className="text-center">
                              {countBy(rc, "Rejected")}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </Card>
      </AppShell>
   );
}
