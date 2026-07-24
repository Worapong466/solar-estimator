import type { FinancialResult, YearProjection } from "../../types";

interface Props {
  financial: FinancialResult;
  projection: YearProjection[];
}

export function FinancialBenefitsCard({ financial, projection }: Props) {
  const total25YearSavingsBaht = projection.reduce(
    (sum, year) => sum + (year.billWithoutSolarBaht - year.billWithSolarBaht),
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">ผลประโยชน์ทางการเงิน</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <Item label="งบลงทุนโดยประมาณ" value={`${Math.round(financial.investmentBaht).toLocaleString()} บาท`} />
        <Item label="ประหยัด/เดือน" value={`${Math.round(financial.savingsPerMonthBaht).toLocaleString()} บาท`} />
        <Item label="ประหยัด/ปี" value={`${Math.round(financial.savingsPerMonthBaht * 12).toLocaleString()} บาท`} />
        <Item label="ประหยัดสะสม 25 ปี" value={`${Math.round(total25YearSavingsBaht).toLocaleString()} บาท`} />
        <Item
          label="ระยะคืนทุน"
          value={financial.paybackYears ? `${financial.paybackYears.toFixed(1)} ปี` : "คำนวณไม่ได้"}
        />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
