import { Suspense } from "react";
import RequirementDetailClient from "./RequirementDetailClient";

export default function Page({ params }) {
   return (
      <Suspense fallback={<p className="p-8">Loading...</p>}>
         <RequirementDetailClient params={params} />
      </Suspense>
   );
}
