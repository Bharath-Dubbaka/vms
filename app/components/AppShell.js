"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initials } from "./ui";

const NAV = [
   { href: "/dashboard", label: "Dashboard", icon: "▦" },
   { href: "/requirements", label: "Requirements", icon: "☰" },
   { href: "/analytics", label: "Analytics", icon: "◔" },
];

export default function AppShell({ user, title, subtitle, actions, children }) {
   const path = usePathname();
   const router = useRouter();

   async function logout() {
      await signOut(auth);
      router.replace("/login");
   }

   return (
      <div className="min-h-screen md:flex">
         <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 p-4 text-slate-300 md:flex">
            <Link
               href="/"
               className="mb-8 flex items-center gap-2 px-2 pt-2 text-white"
            >
               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold">
                  D
               </span>
               <span className="text-lg font-semibold">DBK VMS</span>
            </Link>
            <nav className="space-y-1">
               {NAV.map((n) => {
                  const active =
                     path === n.href ||
                     (n.href !== "/dashboard" && path.startsWith(n.href));
                  return (
                     <Link
                        key={n.href}
                        href={n.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}
                     >
                        <span className="w-4 text-center">{n.icon}</span>
                        {n.label}
                     </Link>
                  );
               })}
            </nav>
            <div className="mt-auto rounded-xl bg-slate-800 p-3">
               <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white">
                     {initials(user?.email?.split("@")[0])}
                  </span>
                  <p className="truncate text-xs">{user?.email}</p>
               </div>
               <button
                  onClick={logout}
                  className="mt-3 w-full rounded-lg border border-slate-600 py-1.5 text-xs hover:bg-slate-700"
               >
                  Log out
               </button>
            </div>
         </aside>

         <div className="min-w-0 flex-1">
            {/* mobile top nav */}
            <div className="flex items-center gap-4 bg-slate-900 px-4 py-3 text-sm text-white md:hidden">
               <span className="font-semibold">DBK VMS</span>
               {NAV.map((n) => (
                  <Link key={n.href} href={n.href} className="text-slate-300">
                     {n.label}
                  </Link>
               ))}
               <button onClick={logout} className="ml-auto text-slate-300">
                  Log out
               </button>
            </div>

            <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
               <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                     <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                     </h1>
                     {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">
                           {subtitle}
                        </p>
                     )}
                  </div>
                  <div className="flex gap-2">{actions}</div>
               </div>
               {children}
            </main>
         </div>
      </div>
   );
}
