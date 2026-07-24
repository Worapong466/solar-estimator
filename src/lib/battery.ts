import type { BatteryRecommendation, DetailedAssessmentAnswers } from "../types";

export function recommendBattery(answers: DetailedAssessmentAnswers): BatteryRecommendation {
  if (answers.backupPowerNeeded === "yes") {
    return {
      recommended: true,
      reason: "คุณต้องการไฟสำรองเมื่อไฟดับ แบตเตอรี่จะช่วยจ่ายไฟให้เครื่องใช้ไฟฟ้าสำคัญต่อเนื่องได้",
    };
  }
  if (answers.evChargingTime === "night") {
    return {
      recommended: true,
      reason: "คุณชาร์จรถ EV ตอนกลางคืน แบตเตอรี่จะช่วยเก็บไฟที่ผลิตได้ตอนกลางวันไว้ใช้ชาร์จตอนกลางคืนแทนการซื้อไฟจากระบบ",
    };
  }
  if (answers.daytimeUsagePct < 40) {
    return {
      recommended: true,
      reason: "คุณใช้ไฟส่วนใหญ่ตอนกลางคืน แบตเตอรี่จะช่วยเพิ่มสัดส่วนการใช้ไฟที่ผลิตเองได้มากขึ้น",
    };
  }
  if (answers.backupPowerNeeded === "maybe") {
    return {
      recommended: false,
      reason: "ระบบยังไม่จำเป็นต้องมีแบตเตอรี่ในตอนนี้ แต่พิจารณาเพิ่มได้ภายหลังหากไฟดับบ่อยในพื้นที่ของคุณ",
    };
  }
  return {
    recommended: false,
    reason: "สัดส่วนใช้ไฟกลางวันของคุณค่อนข้างสูงและไม่ต้องการไฟสำรอง ระบบไม่จำเป็นต้องมีแบตเตอรี่เพิ่ม",
  };
}
