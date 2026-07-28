import { NextResponse } from "next/server";
import { resolveAccessState } from "@/lib/auth/access";

export async function POST() {
  const access = await resolveAccessState();
  if (access.status === "active") {
    return NextResponse.json({ ok: true, role: access.profile.role });
  }
  if (access.status === "unauthenticated") {
    return NextResponse.json(
      { ok: false, error: "Not signed in" },
      { status: 401 },
    );
  }
  return NextResponse.json(
    {
      ok: false,
      error:
        "This account is not set up for Weidner Lawnscape staff access. Ask an owner to add a weidner_staff_profiles row for this tenant.",
      reason: access.reason,
    },
    { status: 403 },
  );
}
