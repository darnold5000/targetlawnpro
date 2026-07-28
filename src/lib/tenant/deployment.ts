export function getWeidnerTenantId(): string {
  const id = process.env.WEIDNER_TENANT_ID?.trim();
  if (!id) {
    throw new Error(
      "WEIDNER_TENANT_ID is not set. After applying migrations, set it from: select id from tenants where slug = 'weidner-lawnscape';",
    );
  }
  return id;
}

export function getWeidnerTenantIdOrNull(): string | null {
  return process.env.WEIDNER_TENANT_ID?.trim() || null;
}
