import { useState } from "react";
import { useEstimatorStore } from "../../store/useEstimatorStore";
import { submitRequestToBackend } from "../../lib/api";

export function SubmitRequestButton() {
  const leadId = useEstimatorStore((s) => s.leadId);
  const requestSubmitted = useEstimatorStore((s) => s.requestSubmitted);
  const submitRequest = useEstimatorStore((s) => s.submitRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const handleClick = async () => {
    if (!leadId) return;
    setStatus("sending");
    try {
      await submitRequestToBackend(leadId);
      submitRequest();
    } catch (err) {
      console.error("submitRequestToBackend failed", err);
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      {requestSubmitted ? (
        <p className="font-medium text-emerald-700">ส่งคำขอของคุณเรียบร้อยแล้ว ทีมงานจะติดต่อกลับเร็ว ๆ นี้</p>
      ) : (
        <>
          <p className="text-sm text-slate-600">พร้อมให้ทีมงานติดต่อกลับเพื่อดำเนินการต่อหรือยัง?</p>
          <button
            type="button"
            onClick={handleClick}
            disabled={status === "sending"}
            className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? "กำลังส่ง..." : "ส่งคำขอของฉัน"}
          </button>
          {status === "error" && (
            <p className="mt-2 text-sm text-red-600">ส่งคำขอไม่สำเร็จ กรุณาลองอีกครั้ง</p>
          )}
        </>
      )}
    </div>
  );
}
