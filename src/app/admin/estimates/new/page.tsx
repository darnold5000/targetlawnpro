import Link from "next/link";
import { Suspense } from "react";
import { EstimateEditor } from "@/components/admin/estimate-editor";

export default function NewEstimatePage() {
  return (
    <div>
      <Link href="/admin/estimates" className="text-sm text-muted hover:text-evergreen">
        ← Estimates
      </Link>
      <h1 className="mt-4 font-display text-3xl text-evergreen-deep">New estimate</h1>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
        <EstimateEditor mode="create" />
      </Suspense>
    </div>
  );
}
