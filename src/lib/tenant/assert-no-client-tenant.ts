/**
 * Reject client-supplied tenant identifiers.
 * Tenant scope always comes from server env (WEIDNER_TENANT_ID).
 */
export function assertNoClientTenantId(body: unknown): void {
  if (!body || typeof body !== "object") return;
  const record = body as Record<string, unknown>;
  if (
    "tenant_id" in record ||
    "tenantId" in record ||
    "WEIDNER_TENANT_ID" in record
  ) {
    throw new Error("Client-supplied tenant_id is not allowed");
  }
}
