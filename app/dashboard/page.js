"use client";
import Link from "next/link";
import { useUser } from "../../lib/useUser";
import { useData, countBy, pct } from "../../lib/useData";
import { STATUSES } from "../../lib/constants";
import AppShell from "../components/AppShell";
import {
   Card,
   Badge,
   FullLoader,
   BAR_COLORS,
   btnPrimary,
} from "../components/ui";

export default function Dashboard() {
   const { user, profile, loading } = useUser();
   const { reqs, cands, ready } = useData(profile);
   if (loading || !ready) return <FullLoader />;

   const total = cands.length;
   const interviews = countBy(cands, "Interview");
   const offers = countBy(cands, "Offered") + countBy(cands, "Joined");
   const max = Math.max(1, ...STATUSES.map((s) => countBy(cands, s)));
   const company = profile.companyId;

   const kpis = [
      {
         label: "Open requirements",
         value: reqs.length,
         href: "/requirements",
         color: "text-indigo-600",
      },
      {
         label: "Total submissions",
         value: total,
         href: "/analytics",
         color: "text-slate-900",
      },
      {
         label: "In interview",
         value: interviews,
         href: "/analytics",
         color: "text-amber-600",
      },
      {
         label: "Offers & joined",
         value: offers,
         href: "/analytics",
         color: "text-emerald-600",
      },
   ];

   return (
      <AppShell
         user={user}
         title={`Welcome, ${user.email.split("@")[0]}`}
         subtitle={`${company} · Hiring overview`}
         actions={
            <Link href="/requirements?new=1" className={btnPrimary}>
               + New requirement
            </Link>
         }
      >
         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((k) => (
               <Link key={k.label} href={k.href}>
                  <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                     <p className="text-sm text-slate-500">{k.label}</p>
                     <p className={`mt-2 text-3xl font-semibold ${k.color}`}>
                        {k.value}
                     </p>
                  </Card>
               </Link>
            ))}
         </div>

         <div className="grid gap-6 lg:grid-cols-5">
            {/* Analytics */}
            <Card className="p-5 lg:col-span-2">
               <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Pipeline</h2>
                  <Link
                     href="/analytics"
                     className="text-sm text-indigo-600 hover:underline"
                  >
                     Full analytics →
                  </Link>
               </div>
               <div className="space-y-3">
                  {STATUSES.map((s) => (
                     <Link key={s} href="/analytics" className="block">
                        <div className="mb-1 flex justify-between text-sm">
                           <span className="text-slate-600">{s}</span>
                           <span className="font-medium">
                              {countBy(cands, s)}
                           </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100">
                           <div
                              className={`h-2.5 rounded-full ${BAR_COLORS[s]}`}
                              style={{
                                 width: `${(countBy(cands, s) / max) * 100}%`,
                              }}
                           />
                        </div>
                     </Link>
                  ))}
               </div>
               <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-center">
                  <div>
                     <p className="text-2xl font-semibold">
                        {pct(interviews + offers, total)}
                     </p>
                     <p className="text-xs text-slate-500">Interview rate</p>
                  </div>
                  <div>
                     <p className="text-2xl font-semibold">
                        {pct(offers, total)}
                     </p>
                     <p className="text-xs text-slate-500">Offer rate</p>
                  </div>
               </div>
            </Card>

            {/* Requirements */}
            <Card className="lg:col-span-3">
               <div className="flex items-center justify-between p-5 pb-3">
                  <h2 className="font-semibold">Requirements</h2>
                  <Link
                     href="/requirements"
                     className="text-sm text-indigo-600 hover:underline"
                  >
                     View all →
                  </Link>
               </div>
               <div className="divide-y divide-slate-100">
                  {reqs.slice(0, 6).map((r) => {
                     const rc = cands.filter((c) => c.requirementId === r.id);
                     const joined = countBy(rc, "Joined");
                     const progress = Math.min(
                        100,
                        (joined / (r.openings || 1)) * 100,
                     );
                     return (
                        <Link
                           key={r.id}
                           href={`/requirements/${r.id}`}
                           className="block px-5 py-4 transition hover:bg-slate-50"
                        >
                           <div className="flex items-start justify-between gap-3">
                              <div>
                                 <p className="font-medium">{r.title}</p>
                                 <p className="text-sm text-slate-500">
                                    {r.category} · {r.location || "No location"}
                                 </p>
                              </div>
                              <Badge>{r.status || "Open"}</Badge>
                           </div>
                           <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                              <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                                 <div
                                    className="h-1.5 rounded-full bg-emerald-500"
                                    style={{ width: `${progress}%` }}
                                 />
                              </div>
                              <span>
                                 {joined}/{r.openings} filled
                              </span>
                              <span>· {rc.length} submitted</span>
                              <span>
                                 · {countBy(rc, "Interview")} interview
                              </span>
                           </div>
                        </Link>
                     );
                  })}
                  {reqs.length === 0 && (
                     <p className="p-8 text-center text-sm text-slate-500">
                        No requirements yet. Create your first one.
                     </p>
                  )}
               </div>
            </Card>
         </div>
      </AppShell>
   );
}
