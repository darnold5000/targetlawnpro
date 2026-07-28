import { assertNoClientTenantId } from "@/lib/tenant/assert-no-client-tenant";

/** Parse JSON body and reject any client-supplied tenant identifiers. */
export async function readJsonBody(request: Request): Promise<unknown> {
  const body = await request.json();
  assertNoClientTenantId(body);
  return body;
}
