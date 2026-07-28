import { redirect } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { WEIDNER_TABLES } from "@/lib/supabase/tables";
import { getWeidnerTenantIdOrNull } from "@/lib/tenant/deployment";

export type StaffRole = "owner" | "admin" | "staff" | "content_editor";

export type StaffProfile = {
  id: string;
  userId: string;
  role: StaffRole;
  fullName: string;
  email: string | null;
  isActive: boolean;
};

export type AccessState =
  | { status: "unauthenticated" }
  | { status: "disabled"; reason: string }
  | { status: "active"; profile: StaffProfile };

export async function resolveAccessState(): Promise<AccessState> {
  if (!isSupabaseConfigured()) {
    return { status: "disabled", reason: "supabase_not_configured" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "unauthenticated" };

  const tenantId = getWeidnerTenantIdOrNull();
  if (!tenantId) {
    return { status: "disabled", reason: "tenant_not_configured" };
  }

  const { data, error } = await supabase
    .from(WEIDNER_TABLES.staffProfiles)
    .select("id, user_id, role, full_name, email, is_active")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data || !data.is_active) {
    return { status: "disabled", reason: "not_provisioned" };
  }

  return {
    status: "active",
    profile: {
      id: data.id,
      userId: data.user_id,
      role: data.role as StaffRole,
      fullName: data.full_name,
      email: data.email,
      isActive: data.is_active,
    },
  };
}

export async function requireStaff(): Promise<StaffProfile> {
  const access = await resolveAccessState();
  if (access.status === "unauthenticated") {
    redirect("/login");
  }
  if (access.status !== "active") {
    redirect(`/access-disabled?reason=${access.reason}`);
  }
  return access.profile;
}
