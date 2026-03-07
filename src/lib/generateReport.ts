// lib/generateReport.ts
// Generates a PDF report for the Event Management & Registration System
// Uses jsPDF + jspdf-autotable (install: npm install jspdf jspdf-autotable)

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Types ────────────────────────────────────────────────────────────────────
type AttendanceRow = {
  title:     string;
  present:   number;
  absent:    number;
  notMarked: number;
};

type DashboardData = {
  totalEvents:        number;
  publicEvents:       number;
  privateEvents:      number;
  totalRegistrations: number;
  attendanceRate:     number;
  presentCount:       number;
  absentCount:        number;
  notMarkedCount:     number;
  repeatAttendees:    number;
  attendanceByEvent:  AttendanceRow[];
};

// ─── Main function ────────────────────────────────────────────────────────────
export function generatePDFReport(data: DashboardData) {
  const doc    = new jsPDF();
  const pageW  = doc.internal.pageSize.getWidth();
  const today  = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // ── Dark header banner ─────────────────────────────────────────────────────
  doc.setFillColor(2, 8, 23);           // #020817
  doc.rect(0, 0, pageW, 42, "F");

  doc.setTextColor(248, 250, 252);      // #f8fafc
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Event Management & Registration System", 14, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);      // #94a3b8
  doc.text(
    "A web application to manage events, registrations, attendance, and reports.",
    14, 24
  );
  doc.text(`Report generated: ${today}`, 14, 32);

  // ── Section: About ─────────────────────────────────────────────────────────
  let y = 54;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);         // #0f172a
  doc.text("About This System", 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);        // #475569

  const aboutText =
    "Organizers can create events, manage registrations, track attendance, and generate " +
    "event reports. Users can browse upcoming events, register online, and receive " +
    "confirmation notifications.";

  const lines = doc.splitTextToSize(aboutText, pageW - 28);
  doc.text(lines, 14, y);
  y += lines.length * 5 + 10;

  // ── Section: Summary KPIs ──────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Summary", 14, y);
  y += 4;

  const kpis = [
    ["Total Events",        String(data.totalEvents)],
    ["Public Events",       String(data.publicEvents)],
    ["Private Events",      String(data.privateEvents)],
    ["Total Registrations", String(data.totalRegistrations)],
    ["Repeat Attendees",    String(data.repeatAttendees)],
    ["Attendance Rate",     data.attendanceRate.toFixed(1) + "%"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: kpis,
    theme: "grid",
    headStyles:  { fillColor: [2, 8, 23], textColor: [248, 250, 252], fontSize: 9 },
    bodyStyles:  { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 1: { fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  // ── Section: Attendance Status ─────────────────────────────────────────────
  // @ts-ignore - autoTable adds this
  y = doc.lastAutoTable.finalY + 14;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Overall Attendance Status", 14, y);
  y += 4;

  const attendanceSummary = [
    ["Present",    String(data.presentCount),   `${((data.presentCount   / data.totalRegistrations) * 100).toFixed(1)}%`],
    ["Absent",     String(data.absentCount),     `${((data.absentCount    / data.totalRegistrations) * 100).toFixed(1)}%`],
    ["Not Marked", String(data.notMarkedCount),  `${((data.notMarkedCount / data.totalRegistrations) * 100).toFixed(1)}%`],
    ["Total",      String(data.totalRegistrations), "100%"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Status", "Count", "Percentage"]],
    body: attendanceSummary,
    theme: "grid",
    headStyles: { fillColor: [2, 8, 23], textColor: [248, 250, 252], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    didParseCell: (hookData) => {
      if (hookData.section === "body") {
        const status = (hookData.row.raw as string[])[0];
        if (status === "Present")    hookData.cell.styles.textColor = [22, 163, 74];
        if (status === "Absent")     hookData.cell.styles.textColor = [220, 38,  38];
        if (status === "Not Marked") hookData.cell.styles.textColor = [100, 116, 139];
        if (status === "Total")      hookData.cell.styles.fontStyle  = "bold";
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Section: Attendance by Event ───────────────────────────────────────────
  // @ts-ignore
  y = doc.lastAutoTable.finalY + 14;

  // Check if we need a new page
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Attendance by Event", 14, y);
  y += 4;

  const eventRows = data.attendanceByEvent.map((e) => {
    const total = e.present + e.absent + e.notMarked;
    const rate  = total > 0 ? ((e.present / total) * 100).toFixed(1) + "%" : "N/A";
    return [e.title, String(e.present), String(e.absent), String(e.notMarked), String(total), rate];
  });

  autoTable(doc, {
    startY: y,
    head: [["Event", "Present", "Absent", "Not Marked", "Total", "Rate"]],
    body: eventRows,
    theme: "grid",
    headStyles: { fillColor: [2, 8, 23], textColor: [248, 250, 252], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 60 },
      5: { fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer on every page ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Event Management & Registration System  •  Page ${i} of ${totalPages}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  doc.save(`attendance-report-${Date.now()}.pdf`);
}