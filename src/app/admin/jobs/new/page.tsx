import Link from "next/link";
import { Suspense } from "react";
import { JobEditor } from "@/components/admin/job-editor";

export default function NewJobPage() {
  return (
    <div>
      <Link href="/admin/jobs" className="text-sm text-muted hover:text-evergreen">
        ← Jobs
      </Link>
      <h1 className="mt-4 font-display text-3xl text-evergreen-deep">New job</h1>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
        <JobEditor mode="create" />
      </Suspense>
    </div>
  );
}
