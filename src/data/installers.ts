export interface Installer {
  id: string;
  name: string;
  serviceAreas: string[]; // รายชื่อจังหวัดที่ให้บริการ
  yearsExperience: number;
  projectCount: number;
  warrantyYears: number;
  rating: number; // 0-5
  priceRangeMinPerKwp: number;
  priceRangeMaxPerKwp: number;
  installDays: number;
  profileUrl: string;
}

// ข้อมูลจำลอง (mock) — ใช้แทนฐานข้อมูลจริงไปก่อนตามที่ตกลงไว้ใน solar-estimator-spec.md หมวด 8
export const INSTALLERS: Installer[] = [
  {
    id: "inst-001",
    name: "บางกอก โซลาร์ โซลูชั่น",
    serviceAreas: ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"],
    yearsExperience: 8,
    projectCount: 320,
    warrantyYears: 10,
    rating: 4.7,
    priceRangeMinPerKwp: 22000,
    priceRangeMaxPerKwp: 28000,
    installDays: 3,
    profileUrl: "/installers/inst-001",
  },
  {
    id: "inst-002",
    name: "สยาม กรีน เอนเนอร์จี",
    serviceAreas: ["กรุงเทพมหานคร", "นนทบุรี", "นครปฐม", "สมุทรสาคร"],
    yearsExperience: 5,
    projectCount: 145,
    warrantyYears: 12,
    rating: 4.5,
    priceRangeMinPerKwp: 24000,
    priceRangeMaxPerKwp: 30000,
    installDays: 4,
    profileUrl: "/installers/inst-002",
  },
  {
    id: "inst-003",
    name: "เชียงใหม่ โซลาร์ เทค",
    serviceAreas: ["เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง"],
    yearsExperience: 6,
    projectCount: 180,
    warrantyYears: 10,
    rating: 4.6,
    priceRangeMinPerKwp: 21000,
    priceRangeMaxPerKwp: 26000,
    installDays: 4,
    profileUrl: "/installers/inst-003",
  },
  {
    id: "inst-004",
    name: "อีสาน พาวเวอร์ โซลาร์",
    serviceAreas: ["นครราชสีมา", "ขอนแก่น", "อุดรธานี", "อุบลราชธานี"],
    yearsExperience: 4,
    projectCount: 95,
    warrantyYears: 10,
    rating: 4.3,
    priceRangeMinPerKwp: 20000,
    priceRangeMaxPerKwp: 25000,
    installDays: 5,
    profileUrl: "/installers/inst-004",
  },
  {
    id: "inst-005",
    name: "ชลบุรี โซลาร์ รูฟ",
    serviceAreas: ["ชลบุรี", "ระยอง", "ฉะเชิงเทรา"],
    yearsExperience: 7,
    projectCount: 260,
    warrantyYears: 15,
    rating: 4.8,
    priceRangeMinPerKwp: 23000,
    priceRangeMaxPerKwp: 29000,
    installDays: 3,
    profileUrl: "/installers/inst-005",
  },
  {
    id: "inst-006",
    name: "ภูเก็ต เอ็นเนอร์จี ซิสเต็มส์",
    serviceAreas: ["ภูเก็ต", "พังงา", "กระบี่"],
    yearsExperience: 5,
    projectCount: 110,
    warrantyYears: 10,
    rating: 4.4,
    priceRangeMinPerKwp: 25000,
    priceRangeMaxPerKwp: 32000,
    installDays: 5,
    profileUrl: "/installers/inst-006",
  },
  {
    id: "inst-007",
    name: "ดวงอาทิตย์ โซลาร์ กรุ๊ป",
    serviceAreas: ["กรุงเทพมหานคร", "สมุทรปราการ", "ฉะเชิงเทรา", "ชลบุรี"],
    yearsExperience: 9,
    projectCount: 410,
    warrantyYears: 12,
    rating: 4.6,
    priceRangeMinPerKwp: 22000,
    priceRangeMaxPerKwp: 27000,
    installDays: 3,
    profileUrl: "/installers/inst-007",
  },
  {
    id: "inst-008",
    name: "นครสวรรค์ โซลาร์ เซอร์วิส",
    serviceAreas: ["นครสวรรค์", "กำแพงเพชร", "พิจิตร", "อุทัยธานี"],
    yearsExperience: 3,
    projectCount: 60,
    warrantyYears: 10,
    rating: 4.2,
    priceRangeMinPerKwp: 20000,
    priceRangeMaxPerKwp: 24000,
    installDays: 6,
    profileUrl: "/installers/inst-008",
  },
];

export function countInstallersByProvince(province: string): number {
  return INSTALLERS.filter((installer) => installer.serviceAreas.includes(province)).length;
}
