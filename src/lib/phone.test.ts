import { describe, it, expect } from "vitest";
import { isValidThaiMobile, normalizeThaiMobile } from "./phone";

describe("isValidThaiMobile", () => {
  it("ผ่านสำหรับเบอร์มือถือที่ขึ้นต้น 06/08/09 และมี 10 หลัก", () => {
    expect(isValidThaiMobile("0812345678")).toBe(true);
    expect(isValidThaiMobile("0612345678")).toBe(true);
    expect(isValidThaiMobile("0912345678")).toBe(true);
  });

  it("ไม่ผ่านถ้าจำนวนหลักผิดหรือขึ้นต้นด้วยเลขอื่น", () => {
    expect(isValidThaiMobile("081234567")).toBe(false); // สั้นไป
    expect(isValidThaiMobile("08123456789")).toBe(false); // ยาวไป
    expect(isValidThaiMobile("0712345678")).toBe(false); // ไม่ใช่ 06/08/09
    expect(isValidThaiMobile("+66812345678")).toBe(false); // ต้องเป็น local format ก่อน normalize
  });
});

describe("normalizeThaiMobile", () => {
  it("แปลงเป็น +66 แล้วตัด 0 นำหน้าออก", () => {
    expect(normalizeThaiMobile("0812345678")).toBe("+66812345678");
  });

  it("คืนค่า null ถ้าเบอร์ไม่ถูกต้อง", () => {
    expect(normalizeThaiMobile("123")).toBeNull();
  });
});
