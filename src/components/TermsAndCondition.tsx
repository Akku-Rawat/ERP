import { useState, useEffect, useRef } from "react";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const TermsAndCondition = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("General Service Terms");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

   const [localPhases, setLocalPhases] = useState<
    { phase: string; percent: string; when: string }[]
  >([]);
  const [localBullets, setLocalBullets] = useState<
    { title: string; value: string }[]
  >([]);

  const templates: Record<string, string> = {
    "General Service Terms": `1.This Quotation is subject to the following terms and conditions. By accepting this quotation, {{CustomerName}} agrees to be bound by these terms. This quotation, identified by number {{QuotationNumber}}, was issued on {{QuotationDate}} and is valid until {{ValidUntil}}.
2.The services to be provided are: {{ServiceName}}. The total amount payable for these services is {{TotalAmount}}.
3.Payment is due upon receipt of the invoice. Any disputes must be raised within 14 days of the invoice date.`,

    "Payment Terms": `1.Payment Structure:
  a)Advance Payment 20%, Upon quotation acceptance.
  b)Phase 1 Completion 30%, After Phase 1 delivery
  c)Final Completion 50%, On project sign-off 
2.Due Dates:Payment due within 30 days from invoice. 
3. Late Payment Charges:  12% p.a. on overdue payments. 
4. Taxes / Additional Charges: Tax applicable @ 18%. 
5. Special Notes / Conditions:  Advance payment is non-refundable.`,

    "Service Delivery Terms": `1. Estimated delivery timelines are as follows: Phase 1 – 2 weeks, Phase 2 – 3 weeks, with a total project duration of 5 weeks.`,

    "Cancellation / Refund Policy": `1. Cancellation Conditions: Client may cancel anytime with written notice.
2. Refund Rules: Advance payment is non-refundable, milestone payments refundable only for uninitiated work.`,

    "Warranty": `1.The Company warrants that the service will be performed professionally and function as intended for 30 days after completion.`,

    "Limitations and Liability": `1.The Company is not liable for delays caused by the client.
2.The client is responsible for providing accurate information and resources.
3.In no event shall the Company’s total liability, whether in contract or otherwise, exceed the total amount paid by the client for the service.`,
  };

  
  useEffect(() => {
    const txt = templates[selectedTemplate] || "";
    setContent(txt);
    setOriginalContent(txt);
    // reset table editing state when template changes
    setLocalPhases([]);
    setLocalBullets([]);
  }, [selectedTemplate]);

  
  interface PhaseRow {
    phase: string;
    percent: string;
    when: string;
  }
  interface Bullet {
    title: string;
    value: string;
  }

  const parsePaymentTable = (raw: string): { phases: PhaseRow[]; bullets: Bullet[] } => {
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    const phases: PhaseRow[] = [];
    const bullets: Bullet[] = [];

    lines.forEach((line) => {
      
      const phaseMatch = line.match(/^[abc]\)\s*(.+)$/);
      if (phaseMatch) {
        const clean = phaseMatch[1];
        const [percent, ...whenParts] = clean.split(",");
        const phaseMap: Record<string, string> = {
          a: "Advance",
          b: "Phase 1",
          c: "Final",
        };
        const key = line.charAt(0);
        phases.push({
          phase: phaseMap[key] || "",
          percent: percent.trim(),
          when: whenParts.join(",").trim(),
        });
        return;
      }

      
      const bulletMatch = line.match(/^\d+\.\s*(.+?):\s*(.+)$/);
      if (bulletMatch) {
        bullets.push({ title: bulletMatch[1], value: bulletMatch[2] });
      }
    });

    return { phases, bullets };
  };

  
  useEffect(() => {
    if (selectedTemplate !== "Payment Terms") return;
    const { phases, bullets } = parsePaymentTable(content);
    setLocalPhases(phases);
    setLocalBullets(bullets);
  }, [content, selectedTemplate]);

  
  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOriginalContent(content);
    setIsEditing(true);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContent(originalContent);
    setIsEditing(false);
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();

    
    const phaseLines = localPhases.map((p, i) => {
      const prefix = String.fromCharCode(97 + i) + ")";
      return `  ${prefix}${p.percent}, ${p.when}`;
    });

    const bulletLines = localBullets.map((b, i) => `${i + 2}. ${b.title}: ${b.value}`);

    const newRaw = [
      "1.Payment Structure:",
      ...phaseLines,
      ...bulletLines,
    ].join("\n");

    setContent(newRaw);
    setOriginalContent(newRaw);
    alert("Terms saved successfully!");
    setIsEditing(false);
  };

  
  const EditableCell = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={ref}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={() => onChange(ref.current?.innerText || "")}
        className="px-1 outline-none min-h-[1.5em]"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  };

  
  const renderPaymentTable = () => {
    const updatePhase = (idx: number, field: keyof PhaseRow, val: string) => {
      const copy = [...localPhases];
      copy[idx] = { ...copy[idx], [field]: val };
      setLocalPhases(copy);
    };

    const updateBullet = (idx: number, field: "title" | "value", val: string) => {
      const copy = [...localBullets];
      copy[idx] = { ...copy[idx], [field]: val };
      setLocalBullets(copy);
    };

    return (
      <div className="space-y-6">
        {/* Phases table */}
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                Phase
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                Percentage
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                When
              </th>
            </tr>
          </thead>
          <tbody>
            {localPhases.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {isEditing ? (
                    <EditableCell
                      value={row.phase}
                      onChange={(v) => updatePhase(idx, "phase", v)}
                    />
                  ) : (
                    row.phase
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {isEditing ? (
                    <EditableCell
                      value={row.percent}
                      onChange={(v) => updatePhase(idx, "percent", v)}
                    />
                  ) : (
                    row.percent
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {isEditing ? (
                    <EditableCell
                      value={row.when}
                      onChange={(v) => updatePhase(idx, "when", v)}
                    />
                  ) : (
                    row.when
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Other bullets */}
        {localBullets.length > 0 && (
          <dl className="grid grid-cols-1 gap-3 text-sm">
            {localBullets.map((b, i) => (
              <div key={i} className="flex">
                <dt className="font-medium text-gray-700 w-48">
                  {isEditing ? (
                    <EditableCell
                      value={b.title}
                      onChange={(v) => updateBullet(i, "title", v)}
                    />
                  ) : (
                    b.title + ":"
                  )}
                </dt>
                <dd className="text-gray-600 flex-1">
                  {isEditing ? (
                    <EditableCell
                      value={b.value}
                      onChange={(v) => updateBullet(i, "value", v)}
                    />
                  ) : (
                    b.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    );
  };

  
  const renderNormalContent = () => (
    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
      {content}
    </pre>
  );

  
  return (
    <div className="p-6 space-y-6">
      {/* Header + Template selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 underline">
          Terms and Conditions
        </h3>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Select a template</label>
          <select
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            disabled={isEditing}
            onClick={(e) => e.stopPropagation()}
          >
            {Object.keys(templates).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content area */}
      <div
        className={`
          w-full min-h-64 p-4 border border-gray-300 rounded-md text-sm font-mono
          ${!isEditing ? "bg-gray-50" : "bg-white"}
        `}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {selectedTemplate === "Payment Terms"
          ? renderPaymentTable()
          : renderNormalContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaCheck /> Save
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaEdit /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default TermsAndCondition;