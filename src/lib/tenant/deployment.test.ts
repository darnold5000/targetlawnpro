import { describe, expect, it } from "vitest";
import { assertNoClientTenantId } from "./assert-no-client-tenant";
import { getWeidnerTenantId, getWeidnerTenantIdOrNull } from "./deployment";

describe("assertNoClientTenantId", () => {
  it("allows bodies without tenant fields", () => {
    expect(() => assertNoClientTenantId({ email: "a@b.com" })).not.toThrow();
    expect(() => assertNoClientTenantId(null)).not.toThrow();
  });

  it("rejects tenant_id / tenantId / WEIDNER_TENANT_ID from clients", () => {
    expect(() => assertNoClientTenantId({ tenant_id: "x" })).toThrow(
      /not allowed/,
    );
    expect(() => assertNoClientTenantId({ tenantId: "x" })).toThrow(
      /not allowed/,
    );
    expect(() =>
      assertNoClientTenantId({ WEIDNER_TENANT_ID: "x" }),
    ).toThrow(/not allowed/);
  });
});

describe("getWeidnerTenantId", () => {
  it("reads only from process.env", () => {
    const prev = process.env.WEIDNER_TENANT_ID;
    delete process.env.WEIDNER_TENANT_ID;
    expect(getWeidnerTenantIdOrNull()).toBeNull();
    expect(() => getWeidnerTenantId()).toThrow(/WEIDNER_TENANT_ID/);
    process.env.WEIDNER_TENANT_ID = "11111111-1111-1111-1111-111111111111";
    expect(getWeidnerTenantId()).toBe("11111111-1111-1111-1111-111111111111");
    if (prev === undefined) delete process.env.WEIDNER_TENANT_ID;
    else process.env.WEIDNER_TENANT_ID = prev;
  });
});
