import Link from "next/link";
import RedirectIfAuthed from "./RedirectIfAuthed";

export default function AuthLayout({ title, subtitle, children }) {
   return (
      <div className="grid min-h-screen lg:grid-cols-2">
         <RedirectIfAuthed />
         <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-12 text-white lg:flex">
            <Link
               href="/"
               className="flex items-center gap-2 text-lg font-semibold"
            >
               <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 font-bold">
                  D
               </span>
               DBK VMS
            </Link>
            <div>
               <h2 className="text-4xl font-semibold leading-tight">
                  Hire faster.
                  <br />
                  Verify with confidence.
               </h2>
               <p className="mt-4 max-w-md text-indigo-100">
                  Post requirements, track every candidate from submission to
                  joining, and keep background verification documents in one
                  secure place.
               </p>
            </div>
            {/* <p className="text-sm text-indigo-200">
               © {new Date().getFullYear()} DBK VMS
            </p> */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-white/10" />
         </div>
         <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
               <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
               </h1>
               <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>
               {children}
            </div>
         </div>
      </div>
   );
}
