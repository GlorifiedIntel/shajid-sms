// components/Sidebar.jsx
"use client";
import { useFormStep } from "@/context/FormContext";

const steps = [
  "Personal Info",
  "Health Info",
  "Schools Attended",
  "Exam Results",
  "Program Details",
  "UTME Info",
  "Review & Submit",
];

export default function Sidebar() {
  const { step } = useFormStep();

  return (
    <div className="bg-blue-600 text-white p-6 w-64 rounded-l-lg min-h-screen">
      {steps.map((label, index) => {
        const active = step === index + 1;
        return (
          <div key={label} className="mb-6">
            <div className={`flex items-center gap-3 ${active ? "font-bold" : "opacity-70"}`}>
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  active ? "bg-white text-blue-600" : "border border-white"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="text-sm">STEP {index + 1}</div>
                <div className="uppercase text-xs">{label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}