import React from "react";
import HeaderPDF from "./HeaderPDF";
import AmountInWords from "../../utils/AmountInWords";

const DemandBillPrintView = ({ demandData, billsPerPage = 1, selectedMonth }) => {
  return (
    <div className={`print-area p-2 text-sm layout-${billsPerPage}`}>
      <style>
        {`
          @media print {
            @page { 
              margin: 0; 
              ${billsPerPage === 9 || billsPerPage === 6 ? "size: A4 landscape;" : ""}
            }
            body { margin: 0; padding: 0; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { display: block; }
            .page-break { page-break-after: always; }
          }

          /* Table row height + padding adjustments */
      table th, table td {
      padding-top: 2px !important;
      padding-bottom: 2px !important;
      line-height: 1 !important;
    }

          /* 1 per page */
          .layout-1 { display: block; }
          .layout-1 .bill-box { padding: 10px; margin-bottom: 0; }

          /* 2 per page */
          .layout-2 { display: block; }
          .layout-2 .bill-box { padding: 8px; margin-bottom: 0; }

          /* 4 per page (grid style) */
          .layout-4 {
            display: flex;
            flex-wrap: wrap;
            justify-content: start;
            align-items: flex-start;
            gap: 8px;
          }
          .layout-4 .bill-box {
            width: 49%;
            border: 1px solid black;
            padding: 6px;
            font-size: 11px;
          }
          .layout-6 {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            gap: 6px;
          }
          .layout-6 .bill-box {
            width: 32%;
            border: 1px solid black;
            padding: 6px;
            font-size: 11px;
            box-sizing: border-box;
          }
          /* 9 per page (3-column layout, landscape) */
          .layout-9 {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            gap: 6px;
          }
          .layout-9 .bill-box {
            width: 32%;
            border: 1px solid black;
            padding: 6px;
            font-size: 10px;
            box-sizing: border-box;
          }

          /* Common styling */
          .print-area {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .total-dues {
            font-weight: bold;
            color: red;
          }
        `}
      </style>

      {demandData.map((student, index) => {
        const feeHeads = student.studentFees || [];
        const prevDues =
          feeHeads.find((f) => f.headName === "PrevDues")?.feeAmount || 0;
        const normalFees = feeHeads.filter((f) => f.headName !== "PrevDues");
        const totalFee = student.totalFeeAmount || 0; // Already includes prevDues

        // ✅ billsPerPage===4 → Book & Dress grouping
        let displayFees = [...normalFees];
        if (billsPerPage === 4) {
          const bookFees = normalFees.filter((f) =>
            f.headName.includes("Book Dues")
          );
          const dressFees = normalFees.filter((f) =>
            f.headName.includes("Dress Dues")
          );

          displayFees = normalFees.filter(
            (f) =>
              !f.headName.includes("Book Dues") &&
              !f.headName.includes("Dress Dues")
          );

          if (bookFees.length > 0) {
            displayFees.push({
              headName: "Book Dues",
              feeAmount: bookFees.reduce(
                (sum, f) => sum + (f.feeAmount || 0),
                0
              ),
            });
          }

          if (dressFees.length > 0) {
            displayFees.push({
              headName: "Dress Dues",
              feeAmount: dressFees.reduce(
                (sum, f) => sum + (f.feeAmount || 0),
                0
              ),
            });
          }
        }

        // Page break logic
        let isPageBreak = false;
        if (billsPerPage === 1) {
          isPageBreak = index + 1 < demandData.length;
        } else if (billsPerPage === 2) {
          isPageBreak = (index + 1) % 2 === 0 && index + 1 < demandData.length;
        } else if (billsPerPage === 4) {
          isPageBreak = (index + 1) % 4 === 0 && index + 1 < demandData.length;
        } else if (billsPerPage === 6) {
          isPageBreak = (index + 1) % 6 === 0 && index + 1 < demandData.length;
        } else if (billsPerPage === 9) {
          isPageBreak = (index + 1) % 9 === 0 && index + 1 < demandData.length;
        }

        return (
          <div
            key={index}
            className={`bill-box bg-white ${isPageBreak ? "page-break" : ""
              }`}
          >
            <HeaderPDF
              overrideStyle={
                billsPerPage === 9 || billsPerPage === 6
                  ? { printHeaderStyle: "style5" }
                  : billsPerPage === 2 || billsPerPage === 4
                    ? { printHeaderStyle: "style2" }
                    : null
              }
            />

            {billsPerPage === 9 ? (
              <h3 className="text-lg font-semibold text-center -my-1">
                Demand Bill
              </h3>
            ) : (
              <h2 className="text-lg font-semibold text-center my-2">
                Demand Bill
              </h2>
            )}

            {/* Student Info */}
            <div
              className={`grid grid-cols-2 gap-y-1 ${billsPerPage === 9 ? "mt-0 mb-0" : "mt-2 mb-2"
                }`}
            >
              {billsPerPage === 9 ||
                billsPerPage === 2 ||
                billsPerPage === 6 ||
                billsPerPage === 4 ? (
                <>
                  <p>
                    <strong>Adm/Roll :</strong> {student.admissionNo} /{" "}
                    {student.rollNo}
                  </p>
                  <p>
                    <strong>Name :</strong> {student.studentName}
                  </p>
                  <p>
                    <strong>Father :</strong> {student.fatherName}
                  </p>
                  <p>
                    <strong>Class :</strong> {student.className} -{" "}
                    {student.section}
                  </p>
                  <p>
                    <strong>Mobile :</strong> {student.mobileNo}
                  </p>
                  <p>
                    <strong>Upto Month :</strong> {selectedMonth}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Admission No :</strong> {student.admissionNo}
                  </p>
                  <p>
                    <strong>
                      {billsPerPage === 4 ? "Name" : "Student Name"} :
                    </strong>{" "}
                    {student.studentName}
                  </p>
                  <p>
                    <strong>Class :</strong> {student.className} -{" "}
                    {student.section}
                  </p>
                  <p>
                    <strong>Roll :</strong> {student.rollNo}
                  </p>
                  <p>
                    <strong>
                      {billsPerPage === 4 ? "Father" : "Father Name"} :
                    </strong>{" "}
                    {student.fatherName}
                  </p>
                  <p>
                    <strong>Mobile No :</strong> {student.mobileNo}
                  </p>
                  <p className="col-span-2">
                    <strong>Upto Month :</strong> {selectedMonth}
                  </p>
                </>
              )}
            </div>

            {/* Table (not for 6/9 layout) */}
            {billsPerPage !== 9 && billsPerPage !== 6 && (
              <>
                <table className="w-full border border-black border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black px-2 py-1 text-left">
                        Fee Head
                      </th>
                      <th className="border border-black px-2 py-1 text-right">
                        Amount
                      </th>
                      <th className="border border-black px-2 py-1 text-center">
                        Total Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayFees.map((fh, i) => (
                      <tr key={i}>
                        <td className="border border-black px-2 py-1">
                          {fh.headName}
                        </td>
                        <td className="border border-black px-2 py-1 text-right">
                          {fh.feeAmount}
                        </td>
                        {i === 0 && (
                          <td
                            rowSpan={displayFees.length}
                            className="border border-black px-2 py-1 text-center align-middle total-dues"
                          >
                            {totalFee}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Amount in Words */}
                {billsPerPage !== 4 && (
                  <p className="mt-2">
                    <strong>Amount in Words:</strong>{" "}
                    {student.totalFeeAmountInWords}
                    {/* <AmountInWords amount={totalFee} /> */}
                  </p>
                )}
                <p className="mt-1">
                  <strong>Description:</strong>{" "}
                  {student.duesDescription}
                </p>
              </>
            )}

            {/* Compact Table for 6 per page */}
            {billsPerPage === 6 && (
              <>
                <table className="w-full border border-black border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black px-2 py-1 text-center">
                        Total Fee
                      </th>
                      <th className="border border-black px-2 py-1 text-center">
                        PrevDues
                      </th>
                      <th className="border border-black px-2 py-1 text-center">
                        Total Dues Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-2 py-1 text-center">
                        {normalFees.reduce(
                          (sum, f) => sum + (f.feeAmount || 0),
                          0
                        )}
                      </td>
                      <td className="border border-black px-2 py-1 text-center">
                        {prevDues}
                      </td>
                      <td className="border border-black px-2 py-1 text-center total-dues">
                        {totalFee}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Amount in Words */}
                <p className="mt-2">
                  <strong>Amount in Words:</strong>{" "}
                  {student.totalFeeAmountInWords}
                  {/* <AmountInWords amount={totalFee} /> */}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {student.duesDescription}
                </p>
              </>
            )}

            {/* Short Info for layout-9 */}
            {billsPerPage === 9 && (
              <div className="mt-2 border border-black p-2">
                <p>
                  <strong>Total Fee:</strong>{" "}
                  {normalFees.reduce(
                    (sum, f) => sum + (f.feeAmount || 0),
                    0
                  )}{" "}
                  | <strong>PrevDues:</strong> {prevDues} |{" "}
                  <span className="total-dues">Total Dues: {totalFee}</span>
                </p>
                <p className="mt-1">
                  <strong>Amount in Words:</strong>{" "}
                  {student.totalFeeAmountInWords}
                  {/* <AmountInWords amount={totalFee} /> */}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {student.duesDescription}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DemandBillPrintView;
