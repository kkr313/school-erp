import React from "react";
import HeaderPDF from "../PrintPDF/HeaderPDF";

const AdmitCardPrintView = ({ students, declaration, exam, className, section }) => {
  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  return (
    <div className="print-area text-sm">
      <style>
        {`
          @media print {
            @page { 
              size: A4;
              margin: 15mm; 
            }
            body { margin: 0; padding: 0; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { display: block; }
            .page-break { page-break-after: always; }
          }

          .admit-box {
            width: 100%;
            min-height: 100%;
            background: white;
            padding: 10px;
            margin-bottom: 0;
            box-sizing: border-box;
          }
        `}
      </style>

      {students?.length > 0 ? (
        students.map((student, index) => (
          <div key={index} className="admit-box page-break">
            {/* Header */}
            <HeaderPDF />
            <h2 className="text-lg font-semibold text-center my-2">Admit Card</h2>
            <h3 className="text-md text-center mb-4">
              {exam} – Class {className}{" "}
              {section !== "All" ? `(${section})` : ""}
            </h3>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-y-1 mb-4">
              <p><strong>Admission No :</strong> {student.admRoll || student.admissionNo}</p>
              <p><strong>Roll No :</strong> {student.rollNo}</p>
              <p><strong>Name :</strong> {student.studentName}</p>
              <p><strong>Father :</strong> {student.fatherName}</p>
              <p><strong>Class :</strong> {student.className} - {student.section}</p>
              <p><strong>Mobile :</strong> {student.mobileNo}</p>
            </div>

            {/* Admit Card Table */}
            <table className="w-full border border-black border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-1 text-left">Subject</th>
                  <th className="border border-black px-2 py-1 text-center">Full Marks</th>
                  <th className="border border-black px-2 py-1 text-center">Pass Marks</th>
                  <th className="border border-black px-2 py-1 text-center">Date</th>
                  <th className="border border-black px-2 py-1 text-center">Time</th>
                </tr>
              </thead>
              <tbody>
                {declaration?.subjects?.length > 0 ? (
                  declaration.subjects.map((subj, i) => (
                    <tr key={i}>
                      <td className="border border-black px-2 py-1">{subj.subjectName}</td>
                      <td className="border border-black px-2 py-1 text-center">{subj.fullMarks}</td>
                      <td className="border border-black px-2 py-1 text-center">{subj.passMarks}</td>
                      <td className="border border-black px-2 py-1 text-center">{subj.date}</td>
                      <td className="border border-black px-2 py-1 text-center">
                        {formatTime(subj.fromTime)} – {formatTime(subj.toTime)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center border border-black py-2">
                      No Admit Card Detail Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Signature Section */}
            <div className="flex justify-between mt-12">
              <div className="text-center">
                ___________________<br />
                Student Signature
              </div>
              <div className="text-center">
                ___________________<br />
                Principal Signature
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No Student Found</p>
      )}
    </div>
  );
};

export default AdmitCardPrintView;
