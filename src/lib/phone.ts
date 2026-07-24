// รับเบอร์มือถือไทยรูปแบบ 0[6/8/9]xxxxxxxx (10 หลัก) แล้ว normalize เป็น +66xxxxxxxxx
const THAI_MOBILE_LOCAL = /^0[689]\d{8}$/;

export function isValidThaiMobile(input: string): boolean {
  return THAI_MOBILE_LOCAL.test(input.trim());
}

/** คืนค่ารูปแบบ +66xxxxxxxxx ถ้าถูกต้อง, null ถ้าไม่ผ่าน validate */
export function normalizeThaiMobile(input: string): string | null {
  const trimmed = input.trim();
  if (!isValidThaiMobile(trimmed)) return null;
  return `+66${trimmed.slice(1)}`;
}
