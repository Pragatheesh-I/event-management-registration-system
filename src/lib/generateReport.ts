// lib/generateReport.ts
// Two exported functions:
//   generatePDFReport(events, filterLabel) — downloads a PDF file
//   generateCSVReport(events, filterLabel) — downloads a CSV file
//
// Both receive the already-filtered events array from the dashboard.
// Install: npm install jspdf jspdf-autotable

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Type: matches the shaped object returned by /api/dashboard ────────────────
type EventRow = {
  id:        string;
  title:     string;
  type:      "public" | "private";
  total:     number;   // total attendees registered
  present:   number;
  absent:    number;
  notMarked: number;
};


// ═════════════════════════════════════════════════════════════════════════════
//  PDF REPORT
// ═════════════════════════════════════════════════════════════════════════════
export function generatePDFReport(events: EventRow[], filterLabel: string) {

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Step 1: Calculate summary numbers from the events array
  const totalEvents        = events.length;
  const publicEvents       = events.filter((e) => e.type === "public").length;
  const privateEvents      = events.filter((e) => e.type === "private").length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.total, 0);
  const totalPresent       = events.reduce((sum, e) => sum + e.present, 0);
  const totalAbsent        = events.reduce((sum, e) => sum + e.absent, 0);
  const totalNotMarked     = events.reduce((sum, e) => sum + e.notMarked, 0);

  let attendanceRate = "N/A";
  if (totalRegistrations > 0) {
    attendanceRate = ((totalPresent / totalRegistrations) * 100).toFixed(1) + "%";
  }

  // Step 2: Draw dark header banner
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 44, "F");

  doc.setTextColor(245, 245, 245);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Event Management & Registration System", 14, 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Dashboard Report  •  Filter: " + filterLabel, 14, 24);
  doc.text("Generated: " + today, 14, 32);

  // Step 3: Summary KPI table
  let y = 54;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Summary", 14, y);
  y = y + 4;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total Events",        String(totalEvents)],
      ["Public Events",       String(publicEvents)],
      ["Private Events",      String(privateEvents)],
      ["Total Registrations", String(totalRegistrations)],
      ["Attendance Rate",     attendanceRate],
      ["Present",             String(totalPresent)],
      ["Absent",              String(totalAbsent)],
      ["Not Marked",          String(totalNotMarked)],
    ],
    theme: "grid",
    headStyles:         { fillColor: [20, 20, 20], textColor: [245, 245, 245], fontSize: 9 },
    bodyStyles:         { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles:       { 1: { fontStyle: "bold", halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  // Step 4: Overall Attendance Status table
  // @ts-ignore — jspdf-autotable attaches lastAutoTable to doc at runtime
  y = doc.lastAutoTable.finalY + 14;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Overall Attendance Status", 14, y);
  y = y + 4;

  let presentPct   = "N/A";
  let absentPct    = "N/A";
  let notMarkedPct = "N/A";
  if (totalRegistrations > 0) {
    presentPct   = ((totalPresent   / totalRegistrations) * 100).toFixed(1) + "%";
    absentPct    = ((totalAbsent    / totalRegistrations) * 100).toFixed(1) + "%";
    notMarkedPct = ((totalNotMarked / totalRegistrations) * 100).toFixed(1) + "%";
  }

  autoTable(doc, {
    startY: y,
    head: [["Status", "Count", "Percentage"]],
    body: [
      ["Present",    String(totalPresent),    presentPct],
      ["Absent",     String(totalAbsent),     absentPct],
      ["Not Marked", String(totalNotMarked),  notMarkedPct],
      ["Total",      String(totalRegistrations), "100%"],
    ],
    theme: "grid",
    headStyles:         { fillColor: [20, 20, 20], textColor: [245, 245, 245], fontSize: 9 },
    bodyStyles:         { fontSize: 9, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    didParseCell: (hook) => {
      if (hook.section !== "body") return;
      const rowData = hook.row.raw as string[];
      const status  = rowData[0];
      if (status === "Present")    hook.cell.styles.textColor = [22,  163,  74]; // green
      if (status === "Absent")     hook.cell.styles.textColor = [220,  38,  38]; // red
      if (status === "Not Marked") hook.cell.styles.textColor = [100, 116, 139]; // grey
      if (status === "Total")      hook.cell.styles.fontStyle  = "bold";
    },
    margin: { left: 14, right: 14 },
  });

  // Step 5: Per-event attendance table
  // @ts-ignore
  y = doc.lastAutoTable.finalY + 14;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Attendance by Event", 14, y);
  y = y + 4;

  const eventTableRows = events.map((event) => {
    let rate = "N/A";
    if (event.total > 0) {
      rate = ((event.present / event.total) * 100).toFixed(1) + "%";
    }
    const typeLabel = event.type.charAt(0).toUpperCase() + event.type.slice(1);
    return [
      event.title,
      typeLabel,
      String(event.present),
      String(event.absent),
      String(event.notMarked),
      String(event.total),
      rate,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["Event", "Type", "Present", "Absent", "Not Marked", "Total", "Rate"]],
    body: eventTableRows,
    theme: "grid",
    headStyles:         { fillColor: [20, 20, 20], textColor: [245, 245, 245], fontSize: 8 },
    bodyStyles:         { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 18 },
      6: { fontStyle: "bold", halign: "right" },
    },
    styles: { overflow: "linebreak", cellPadding: 3 },
    didParseCell: (hook) => {
      if (hook.section !== "body") return;
      if (hook.column.index !== 1) return;
      const rowData = hook.row.raw as string[];
      const type    = rowData[1];
      if (type === "Public")  hook.cell.styles.textColor = [59, 130, 246]; // blue
      if (type === "Private") hook.cell.styles.textColor = [168, 85, 247]; // purple
    },
    margin: { left: 14, right: 14 },
  });

  // Step 6: Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Event Management & Registration System  •  Page " + i + " of " + totalPages,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Step 7: Trigger download
  doc.save("attendance-report-" + Date.now() + ".pdf");
}


// ═════════════════════════════════════════════════════════════════════════════
//  CSV REPORT
// ═════════════════════════════════════════════════════════════════════════════
export function generateCSVReport(events: EventRow[], filterLabel: string) {

  // Step 1: Calculate totals for the summary row
  const totalPresent       = events.reduce((sum, e) => sum + e.present, 0);
  const totalAbsent        = events.reduce((sum, e) => sum + e.absent, 0);
  const totalNotMarked     = events.reduce((sum, e) => sum + e.notMarked, 0);
  const totalRegistrations = events.reduce((sum, e) => sum + e.total, 0);

  let overallRate = "N/A";
  if (totalRegistrations > 0) {
    overallRate = ((totalPresent / totalRegistrations) * 100).toFixed(1) + "%";
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Step 2: Build the rows array — each inner array becomes one CSV line
  const rows: string[][] = [];

  // Meta header
  rows.push(["Event Management & Registration System — Attendance Report"]);
  rows.push(["Filter: " + filterLabel]);
  rows.push(["Generated: " + today]);
  rows.push([]); // blank line

  // Column headers
  rows.push(["Event", "Type", "Present", "Absent", "Not Marked", "Total", "Attendance Rate"]);

  // One row per event
  for (const event of events) {
    let rate = "N/A";
    if (event.total > 0) {
      rate = ((event.present / event.total) * 100).toFixed(1) + "%";
    }
    rows.push([
      '"' + event.title + '"', // quotes around title in case it contains commas
      event.type,
      String(event.present),
      String(event.absent),
      String(event.notMarked),
      String(event.total),
      rate,
    ]);
  }

  rows.push([]); // blank line before totals

  // Totals row
  rows.push([
    "TOTAL",
    events.length + " events",
    String(totalPresent),
    String(totalAbsent),
    String(totalNotMarked),
    String(totalRegistrations),
    overallRate,
  ]);

  // Step 3: Convert rows array → CSV string
  const csvString = rows.map((row) => row.join(",")).join("\n");

  // Step 4: Create blob, trigger download, clean up
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const link    = document.createElement("a");
  link.href     = url;
  link.download = "attendance-report-" + Date.now() + ".csv";
  link.click();

  URL.revokeObjectURL(url);
}