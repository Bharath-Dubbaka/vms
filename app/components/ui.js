export const STATUS_STYLES = {
   Submitted: "bg-slate-100 text-slate-700 ring-slate-200",
   Shortlisted: "bg-blue-50 text-blue-700 ring-blue-200",
   Interview: "bg-amber-50 text-amber-700 ring-amber-200",
   Offered: "bg-violet-50 text-violet-700 ring-violet-200",
   Joined: "bg-emerald-50 text-emerald-700 ring-emerald-200",
   Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
   Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export const BAR_COLORS = {
   Submitted: "bg-slate-400",
   Shortlisted: "bg-blue-500",
   Interview: "bg-amber-500",
   Offered: "bg-violet-500",
   Joined: "bg-emerald-500",
   Rejected: "bg-rose-500",
};

export function Badge({ children }) {
   return (
      <span
         className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[children] || STATUS_STYLES.Submitted}`}
      >
         {children}
      </span>
   );
}

export function Card({ className = "", children }) {
   return (
      <div
         className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      >
         {children}
      </div>
   );
}

export function FullLoader() {
   return (
      <div className="flex min-h-screen items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
   );
}

export const inputCls =
   "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
export const btnPrimary =
   "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50";
export const btnGhost =
   "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50";

export function initials(name = "") {
   return (
      name
         .split(" ")
         .filter(Boolean)
         .slice(0, 2)
         .map((w) => w[0].toUpperCase())
         .join("") || "?"
   );
}
