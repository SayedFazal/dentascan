import { jsPDF } from 'jspdf';
import { Scan, CheckIn } from './storage';

export const reportGenerator = {
  generatePDF(userName: string, scans: Scan[], checkins: CheckIn[]) {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.setTextColor(14, 165, 168); // #0EA5A8
    doc.text('DentaScan: Oral Health Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.text(`Patient: ${userName}`, 20, 45);
    doc.text(`Report Date: ${date}`, 20, 52);

    doc.setFontSize(16);
    doc.text('Recent Scans', 20, 70);
    
    let y = 80;
    scans.slice(0, 5).forEach((scan) => {
      doc.setFontSize(10);
      doc.text(`${new Date(scan.date).toLocaleDateString()} - Plaque Level: ${scan.plaqueClass} (${(scan.confidence * 100).toFixed(0)}% confidence)`, 20, y);
      y += 10;
    });

    doc.setFontSize(16);
    doc.text('Brushing Adherence (Last 7 Days)', 20, y + 10);
    y += 25;

    const recentCheckins = checkins.slice(0, 7);
    recentCheckins.forEach((c) => {
      const status = [c.brushingAM ? 'AM' : '-', c.brushingPM ? 'PM' : '-', c.flossing ? 'Floss' : '-'].join(' | ');
      doc.setFontSize(10);
      doc.text(`${new Date(c.date).toLocaleDateString()}: ${status}`, 20, y);
      y += 10;
    });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'italic');
    doc.text('DISCLAIMER: Not a medical device. For informational purposes only.', 20, 280);

    return doc;
  },

  download(doc: jsPDF, filename = 'dentascan-report.pdf') {
    doc.save(filename);
  }
};
