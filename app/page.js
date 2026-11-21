import Link from "next/link";
import RedirectIfAuthed from "../app/components/RedirectIfAuthed";

const FEATURES = [
   {
      t: "Requirement management",
      d: "Post hiring needs for electricians, plumbers, developers and more, with openings and locations.",
      i: "☰",
   },
   {
      t: "Candidate pipeline",
      d: "Track every candidate from submission to interview, offer and joining with a full status history.",
      i: "⇄",
   },
   {
      t: "Secure BGV documents",
      d: "Collect ID, address, education and employment proofs in one place, linked to each candidate.",
      i: "🔒",
   },
   {
      t: "Live analytics",
      d: "See submissions, interview rates and offer conversion per requirement, instantly.",
      i: "◔",
   },
];

export default function Home() {
   return (
      <div className="min-h-screen bg-white">
         <RedirectIfAuthed />
         <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2 text-lg font-semibold">
               <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                  D
               </span>
               DBK VMS
            </div>
            <div className="flex items-center gap-3 text-sm">
               <Link
                  href="/login"
                  className="font-medium text-slate-700 hover:text-indigo-600"
               >
                  Log in
               </Link>
               <Link
                  href="/signup"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
               >
                  Get started
               </Link>
            </div>
         </header>

         <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white" />
            <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
               <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  Vendor Management System
               </span>
               <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
                  Manage hiring vendors,{" "}
                  <span className="text-indigo-600">end to end</span>
               </h1>
               <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                  One platform for requirements, candidate submissions,
                  interview tracking and background verification, built for
                  corporate teams.
               </p>
               <div className="mt-8 flex justify-center gap-3">
                  <Link
                     href="/signup"
                     className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                  >
                     Sign up with work email
                  </Link>
                  <Link
                     href="/login"
                     className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                     Log in
                  </Link>
               </div>
               <p className="mt-4 text-sm text-slate-500">
                  Verified corporate email required
               </p>
            </div>
         </section>

         <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
               <div
                  key={f.t}
                  className="rounded-2xl border border-slate-200 p-6 shadow-sm"
               >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                     {f.i}
                  </div>
                  <h3 className="font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm text-slate-600">{f.d}</p>
               </div>
            ))}
         </section>

         {/* <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} DBK VMS. All rights reserved.
         </footer> */}
      </div>
   );
}
