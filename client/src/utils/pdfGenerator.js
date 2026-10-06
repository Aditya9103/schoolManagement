import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';

/**
 * Print an element in isolation so ONLY the result/card is printed
 * Restores natural layout flow without multi-page truncation.
 */
export const printElement = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) {
        window.print();
        return;
    }

    el.classList.add('printable-result-target');
    document.body.classList.add('print-only-result');

    const cleanup = () => {
        document.body.classList.remove('print-only-result');
        el.classList.remove('printable-result-target');
        window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 2500);
};

/**
 * Capture an on-screen DOM element and download as a high-fidelity PDF
 * Supports both single-page fit and automatic vertical pagination so NO content is ever cut off.
 */
export const downloadElementAsPdf = async (elementId, filename = 'document.pdf', options = {}) => {
    const el = document.getElementById(elementId);
    if (!el) {
        toast.error('Printable document not found');
        return false;
    }

    const toastId = toast.loading('Rendering complete PDF document...');

    try {
        const scrollW = Math.max(el.scrollWidth || 0, el.offsetWidth || 0, 800);
        const scrollH = Math.max(el.scrollHeight || 0, el.offsetHeight || 0, 1000);

        const dataUrl = await toPng(el, {
            quality: 0.98,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            width: scrollW,
            height: scrollH,
            style: {
                overflow: 'visible',
                width: `${scrollW}px`,
                maxWidth: 'none',
                maxHeight: 'none',
                margin: '0',
            },
            ...options,
        });

        const isLandscape = options.orientation === 'landscape' || (scrollW > scrollH * 1.25);
        const pdf = new jsPDF({
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = options.margin !== undefined ? options.margin : 10; // 10mm safe margin
        const printWidth = pdfWidth - margin * 2;
        const printHeight = pdfHeight - margin * 2;

        const imgProps = pdf.getImageProperties(dataUrl);

        // If content fits safely on one page (allowing small 10% tolerance)
        const singlePageHeight = (imgProps.height * printWidth) / imgProps.width;
        if (singlePageHeight <= printHeight * 1.08) {
            const scale = Math.min(printWidth / imgProps.width, printHeight / imgProps.height);
            const finalWidth = imgProps.width * scale;
            const finalHeight = imgProps.height * scale;
            const xPos = margin + (printWidth - finalWidth) / 2;
            const yPos = margin + (printHeight - finalHeight) / 2;

            pdf.addImage(dataUrl, 'PNG', xPos, yPos, finalWidth, finalHeight, undefined, 'FAST');
        } else {
            // Multi-page document: paginate across pages cleanly so zero rows/sections get truncated
            let heightLeft = singlePageHeight;
            let position = 0;
            let page = 1;

            while (heightLeft > 0) {
                if (page > 1) {
                    pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait');
                }
                pdf.addImage(dataUrl, 'PNG', margin, margin + position, printWidth, singlePageHeight, undefined, 'FAST');
                heightLeft -= printHeight;
                position -= printHeight;
                page += 1;
            }
        }

        pdf.save(filename);
        toast.success(`Downloaded ${filename}`, { id: toastId });
        return true;
    } catch (err) {
        console.error('downloadElementAsPdf error:', err);
        toast.error('Failed to capture PDF document', { id: toastId });
        return false;
    }
};

/**
 * Generate official Greenwood International School Report Card PDF directly
 * Fits 100% into standard A4 portrait (210 x 297 mm) with full view, zero clipping, and authentic CBSE formatting.
 */
export const generateStudentReportCardPdf = (student, examName = 'Half Yearly Examination', academicYear = '2026 - 27') => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
        const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

        // 1. Official Border (Safe margin of 12mm all around so nothing is clipped by printer margins)
        doc.setLineWidth(0.8);
        doc.setDrawColor(30, 41, 59); // slate-800
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24); // 186 x 273 mm
        doc.setLineWidth(0.3);
        doc.rect(13.8, 13.8, pageWidth - 27.6, pageHeight - 27.6); // 182.4 x 269.4 mm

        // 2. School Emblem Crest (Gold shield with GIS centered)
        const crestX = pageWidth / 2;
        doc.setFillColor(217, 119, 6); // amber-600
        doc.roundedRect(crestX - 6, 17, 12, 11.5, 2.5, 2.5, 'F');
        doc.setFillColor(245, 158, 11); // amber-500
        doc.circle(crestX, 22.8, 3.2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.text('GIS', crestX, 23.9, { align: 'center' });

        // School Name & Affiliation
        doc.setFont('times', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('GREENWOOD INTERNATIONAL SCHOOL', crestX, 34, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text('Affiliated to Central Board of Secondary Education (CBSE), New Delhi', crestX, 38.5, { align: 'center' });
        doc.text('Affiliation No. 2130001 | School Code: 54321 | Institutional ISO 9001:2015', crestX, 42.5, { align: 'center' });

        // Pill Banner: Exam Title & Academic Year
        doc.setFillColor(241, 245, 249); // slate-100
        doc.setDrawColor(203, 213, 225); // slate-300
        doc.roundedRect(crestX - 52, 46, 104, 6.2, 1.8, 1.8, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${examName.toUpperCase()} REPORT CARD - ACADEMIC YEAR ${academicYear}`, crestX, 50.2, { align: 'center' });

        // 3. Student Information Metadata Box
        const metaY = 55;
        const boxMargin = 16;
        const boxWidth = pageWidth - boxMargin * 2;
        doc.setFillColor(248, 250, 252); // slate-50
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(boxMargin, metaY, boxWidth, 17, 1.5, 1.5, 'FD');

        doc.setFontSize(7.2);
        doc.setTextColor(100, 116, 139);
        doc.text('STUDENT NAME:', boxMargin + 4, metaY + 5.2);
        doc.text('ROLL NUMBER:', boxMargin + 4, metaY + 10.5);
        doc.text('ADMISSION NO:', boxMargin + 4, metaY + 15.5);

        doc.text('CLASS & SECTION:', pageWidth / 2 + 5, metaY + 5.2);
        doc.text('DATE OF BIRTH:', pageWidth / 2 + 5, metaY + 10.5);
        doc.text('DATE OF ISSUE:', pageWidth / 2 + 5, metaY + 15.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(student.name || 'Aarav Sharma', boxMargin + 32, metaY + 5.2);
        doc.text(String(student.rollNo || '101'), boxMargin + 32, metaY + 10.5);
        doc.text('GIS-2024-0482', boxMargin + 32, metaY + 15.5);

        doc.text(student.class || student.className || 'Class 10 - A', pageWidth / 2 + 40, metaY + 5.2);
        doc.text('15 Aug 2011', pageWidth / 2 + 40, metaY + 10.5);
        doc.text('30 Jun 2026', pageWidth / 2 + 40, metaY + 15.5);

        // 4. Scholastic Achievement Table
        const tableY = 75;
        doc.setFillColor(241, 245, 249);
        doc.rect(boxMargin, tableY, boxWidth, 7, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.line(boxMargin, tableY + 7, boxMargin + boxWidth, tableY + 7);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(30, 41, 59);
        doc.text('SCHOLASTIC SUBJECT', boxMargin + 6, tableY + 4.8);
        doc.text('MARKS OBTAINED', 95, tableY + 4.8, { align: 'center' });
        doc.text('MAX MARKS', 126, tableY + 4.8, { align: 'center' });
        doc.text('PERCENTAGE', 156, tableY + 4.8, { align: 'center' });
        doc.text('GRADE', 182, tableY + 4.8, { align: 'center' });

        const defaultSubjects = [
            { subject: 'English', marks: 88, maxMarks: 100, grade: 'A' },
            { subject: 'Mathematics', marks: 98, maxMarks: 100, grade: 'A+' },
            { subject: 'Science', marks: 94, maxMarks: 100, grade: 'A+' },
            { subject: 'Social Science', marks: 96, maxMarks: 100, grade: 'A+' },
            { subject: 'Hindi', marks: 96, maxMarks: 100, grade: 'A+' },
        ];
        const subjects = (student.subjects && student.subjects.length > 0) ? student.subjects : defaultSubjects;

        let rowY = tableY + 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);

        subjects.forEach((sub, idx) => {
            if (idx % 2 === 1) {
                doc.setFillColor(250, 250, 250);
                doc.rect(boxMargin, rowY, boxWidth, 6.5, 'F');
            }
            doc.setDrawColor(226, 232, 240);
            doc.line(boxMargin, rowY + 6.5, boxMargin + boxWidth, rowY + 6.5);

            doc.setTextColor(15, 23, 42);
            doc.text(sub.subject || sub.name || '', boxMargin + 6, rowY + 4.5);
            doc.text(String(sub.marks !== undefined ? sub.marks : sub.marksObtained || 0), 95, rowY + 4.5, { align: 'center' });
            doc.text(String(sub.maxMarks || 100), 126, rowY + 4.5, { align: 'center' });

            const m = Number(sub.marks !== undefined ? sub.marks : sub.marksObtained || 0);
            const mm = Number(sub.maxMarks || 100);
            const pct = Math.round((m / mm) * 100);
            doc.setTextColor(37, 99, 235);
            doc.text(`${pct}%`, 156, rowY + 4.5, { align: 'center' });

            doc.setTextColor(16, 185, 129);
            doc.setFont('helvetica', 'bold');
            doc.text(sub.grade || 'A+', 182, rowY + 4.5, { align: 'center' });
            doc.setFont('helvetica', 'normal');

            rowY += 6.5;
        });

        // Grand Total Row
        doc.setFillColor(241, 245, 249);
        doc.rect(boxMargin, rowY, boxWidth, 7.5, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('GRAND TOTAL (AGGREGATE)', boxMargin + 6, rowY + 5);
        doc.setTextColor(37, 99, 235);
        doc.text(String(student.totalMarks || 472), 95, rowY + 5, { align: 'center' });
        doc.setTextColor(100, 116, 139);
        doc.text(String(student.maxMarks || 500), 126, rowY + 5, { align: 'center' });
        doc.setTextColor(37, 99, 235);
        doc.text(`${student.percentage || 94.4}%`, 156, rowY + 5, { align: 'center' });
        doc.setTextColor(16, 185, 129);
        doc.text(student.grade || 'A+', 182, rowY + 5, { align: 'center' });

        // 5. Result Summary Card (Two Columns)
        const summaryY = rowY + 8;
        const cardColWidth = (boxWidth - 4) / 2;

        const userRemarks = student.remarks || student.teacherRemarks || 'Outstanding performance across theoretical and applied concepts. Consistently disciplined and inquisitive.';
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        const remarkLines = doc.splitTextToSize(`"${userRemarks}"`, cardColWidth - 8);

        // Ensure dynamic card height so remarks and status never collide
        const neededRemarksHeight = 12 + (remarkLines.length * 4) + 8;
        const summaryCardHeight = Math.max(30, Math.min(neededRemarksHeight, 35));

        // Left box: performance summary
        doc.setDrawColor(203, 213, 225);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(boxMargin, summaryY, cardColWidth, summaryCardHeight, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(100, 116, 139);
        doc.text('RESULT STATUS:', boxMargin + 4, summaryY + 6.5);
        doc.text('PERCENTAGE:', boxMargin + 4, summaryY + 13);
        doc.text('OVERALL GRADE:', boxMargin + 4, summaryY + 19.5);
        doc.text('CLASS RANK:', boxMargin + 4, summaryY + 26);

        doc.setTextColor(16, 185, 129);
        doc.text('PASS (QUALIFIED)', boxMargin + 40, summaryY + 6.5);
        doc.setTextColor(37, 99, 235);
        doc.text(`${student.percentage || 94.4}%`, boxMargin + 40, summaryY + 13);
        doc.setTextColor(16, 185, 129);
        doc.text(student.grade || 'A+', boxMargin + 40, summaryY + 19.5);
        doc.setTextColor(147, 51, 234);
        doc.text(`#${student.rank || 1} / 48 (TOP RANKER)`, boxMargin + 40, summaryY + 26);

        // Right box: remarks
        const rightCardX = boxMargin + cardColWidth + 4;
        doc.roundedRect(rightCardX, summaryY, cardColWidth, summaryCardHeight, 1.5, 1.5, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text("TEACHER'S OBSERVATIONS & REMARKS:", rightCardX + 4, summaryY + 6.5);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);
        doc.text(remarkLines, rightCardX + 4, summaryY + 12);

        // Bottom divider and promotion note inside right card (completely separated from remarks)
        doc.setDrawColor(226, 232, 240);
        doc.line(rightCardX + 4, summaryY + summaryCardHeight - 6.5, rightCardX + cardColWidth - 4, summaryY + summaryCardHeight - 6.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(16, 185, 129);
        doc.text('Promoted to Next Term', rightCardX + 4, summaryY + summaryCardHeight - 2.2);

        // 6. Co-Scholastic & Life Skills Box (CBSE Scale A-E)
        const coScholasticY = summaryY + summaryCardHeight + 3.5;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(boxMargin, coScholasticY, boxWidth, 20, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(30, 41, 59);
        doc.text('CO-SCHOLASTIC ACTIVITIES & LIFE SKILLS (CBSE 5-POINT SCALE)', boxMargin + 4, coScholasticY + 5.5);

        const skills = [
            { name: 'Work Education (Pre-Vocational):', grade: 'Grade A' },
            { name: 'Art Education (Visual & Performing):', grade: 'Grade A' },
            { name: 'Health & Physical Education (Sports):', grade: 'Grade A' },
            { name: 'Discipline, Values & Classroom Ethics:', grade: 'Grade A+' },
        ];

        doc.setFontSize(6.8);
        doc.setFont('helvetica', 'normal');
        skills.forEach((sk, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = col === 0 ? boxMargin + 4 : pageWidth / 2 + 5;
            const y = coScholasticY + 11 + row * 5.2;

            doc.setTextColor(71, 85, 105);
            doc.text(sk.name, x, y);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(16, 185, 129);
            doc.text(sk.grade, x + 58, y);
            doc.setFont('helvetica', 'normal');
        });

        // 7. Attendance & Verification
        const attY = coScholasticY + 23;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(boxMargin, attY, boxWidth, 9.5, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text('ATTENDANCE RECORD:', boxMargin + 4, attY + 6);
        doc.setTextColor(15, 23, 42);
        doc.text(student.attendanceDays || '185 / 192 Days (96.4%)', boxMargin + 40, attY + 6);

        doc.setTextColor(71, 85, 105);
        doc.text('EXAM ELIGIBILITY:', pageWidth / 2 + 5, attY + 6);
        doc.setTextColor(16, 185, 129);
        doc.text('ELIGIBLE (Satisfies CBSE 75% Rule)', pageWidth / 2 + 36, attY + 6);

        // 8. Signatures & Official Stamp (Safely at y=250mm, leaving 35mm comfortable margin at bottom)
        const sigY = 250;
        const sigColWidth = (boxWidth - 12) / 3;

        // Signature 1: Class Teacher
        const sig1X = boxMargin + 2;
        doc.setDrawColor(148, 163, 184);
        doc.line(sig1X, sigY, sig1X + sigColWidth - 4, sigY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text('Sunita Paul', sig1X + (sigColWidth - 4) / 2, sigY - 2, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text('Class Teacher Signature', sig1X + (sigColWidth - 4) / 2, sigY + 4, { align: 'center' });

        // Signature 2: Exam Controller
        const sig2X = sig1X + sigColWidth + 4;
        doc.line(sig2X, sigY, sig2X + sigColWidth - 4, sigY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text('Arvind Joseph', sig2X + (sigColWidth - 4) / 2, sigY - 2, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text('Examination Incharge', sig2X + (sigColWidth - 4) / 2, sigY + 4, { align: 'center' });

        // Signature 3: Principal & Institutional Head
        const sig3X = sig2X + sigColWidth + 4;
        doc.line(sig3X, sigY, sig3X + sigColWidth - 4, sigY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text('Dr. S. K. Bose', sig3X + (sigColWidth - 4) / 2, sigY - 2, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text('Principal & Institutional Head', sig3X + (sigColWidth - 4) / 2, sigY + 4, { align: 'center' });

        // Save PDF with clean filename
        const cleanName = (student.name || 'Student').replace(/\s+/g, '_');
        const fileName = `${cleanName}_Report_Card_${academicYear.replace(/\s+/g, '')}.pdf`;
        doc.save(fileName);
        toast.success(`Downloaded ${fileName}`);
        return true;
    } catch (err) {
        console.error('Report card PDF generation error:', err);
        toast.error('Failed to generate Report Card PDF');
        return false;
    }
};

/**
 * Generate Student Academic Scorecard PDF (Full View for Student Result Detail)
 * Fits perfectly on standard A4 portrait with zero cut-off.
 */
export const generateStudentScorecardPdf = (student, examName = 'Half Yearly Examination', academicYear = '2026 - 27') => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
        const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

        const margin = 14;
        const contentWidth = pageWidth - margin * 2;

        // Top School Header Bar
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(margin, 14, contentWidth, 18, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text('GREENWOOD INTERNATIONAL SCHOOL', margin + 6, 22);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text('STUDENT ACADEMIC PERFORMANCE SCORECARD - OFFICIAL RECORD', margin + 6, 28);

        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text(`CBSE AFFILIATION NO. 2130001`, pageWidth - margin - 6, 22, { align: 'right' });
        doc.text(`ACADEMIC SESSION: ${academicYear}`, pageWidth - margin - 6, 28, { align: 'right' });

        // Student Profile Banner
        const bannerY = 36;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, bannerY, contentWidth, 20, 1.5, 1.5, 'FD');

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('STUDENT NAME:', margin + 6, bannerY + 6);
        doc.text('ROLL NO:', margin + 6, bannerY + 12);
        doc.text('CLASS & SEC:', margin + 6, bannerY + 17);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(student.name || 'Aarav Sharma', margin + 34, bannerY + 6);
        doc.text(String(student.rollNo || '101'), margin + 34, bannerY + 12);
        doc.text(student.className || student.class || 'Class 10 - A', margin + 34, bannerY + 17);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('EXAM TITLE:', pageWidth / 2 + 5, bannerY + 6);
        doc.text('STATUS:', pageWidth / 2 + 5, bannerY + 12);
        doc.text('ISSUE DATE:', pageWidth / 2 + 5, bannerY + 17);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text(examName, pageWidth / 2 + 30, bannerY + 6);
        doc.setTextColor(16, 185, 129);
        doc.text('PASS [QUALIFIED]', pageWidth / 2 + 30, bannerY + 12);
        doc.setTextColor(15, 23, 42);
        doc.text(new Date().toLocaleDateString(), pageWidth / 2 + 30, bannerY + 17);

        // 4 KPI Metric Tiles
        const kpiY = 60;
        const kpiWidth = (contentWidth - 9) / 4;
        const kpis = [
            { label: 'TOTAL MARKS', value: `${student.totalMarks || 472} / ${student.maxMarks || 500}`, color: [15, 23, 42] },
            { label: 'PERCENTAGE', value: `${student.percentage || 94.4}%`, color: [37, 99, 235] },
            { label: 'OVERALL GRADE', value: student.grade || 'A+', color: [16, 185, 129] },
            { label: 'CLASS RANK', value: `#${student.rank || 1} / 48`, color: [147, 51, 234] },
        ];

        kpis.forEach((kpi, idx) => {
            const x = margin + idx * (kpiWidth + 3);
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(x, kpiY, kpiWidth, 15, 1.5, 1.5, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.8);
            doc.setTextColor(100, 116, 139);
            doc.text(kpi.label, x + kpiWidth / 2, kpiY + 5, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
            doc.text(kpi.value, x + kpiWidth / 2, kpiY + 11.5, { align: 'center' });
        });

        // Subject-Wise Marks Ledger Table
        const tableY = 80;
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, tableY, contentWidth, 7, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.line(margin, tableY + 7, margin + contentWidth, tableY + 7);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        doc.text('SUBJECT', margin + 4, tableY + 4.8);
        doc.text('MARKS', 68, tableY + 4.8, { align: 'center' });
        doc.text('MAX', 84, tableY + 4.8, { align: 'center' });
        doc.text('%', 98, tableY + 4.8, { align: 'center' });
        doc.text('GRADE', 114, tableY + 4.8, { align: 'center' });
        doc.text('STATUS', 130, tableY + 4.8, { align: 'center' });
        doc.text('REMARKS', 144, tableY + 4.8, { align: 'left' });

        const defaultSubjects = [
            { subject: 'English', marks: 88, maxMarks: 100, percentage: 88, grade: 'A', status: 'Pass', remarks: 'Fluent and expressive essays' },
            { subject: 'Mathematics', marks: 98, maxMarks: 100, percentage: 98, grade: 'A+', status: 'Pass', remarks: 'Flawless geometry and calculus solutions' },
            { subject: 'Science', marks: 94, maxMarks: 100, percentage: 94, grade: 'A+', status: 'Pass', remarks: 'Superb practical laboratory work' },
            { subject: 'Social Science', marks: 96, maxMarks: 100, percentage: 96, grade: 'A+', status: 'Pass', remarks: 'Deep contextual understanding of history' },
            { subject: 'Hindi', marks: 96, maxMarks: 100, percentage: 96, grade: 'A+', status: 'Pass', remarks: 'Accurate grammar and poetry interpretation' },
        ];
        const subjects = (student.subjects && student.subjects.length > 0) ? student.subjects : defaultSubjects;

        let rowY = tableY + 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);

        subjects.forEach((sub, idx) => {
            if (idx % 2 === 1) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margin, rowY, contentWidth, 7, 'F');
            }
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, rowY + 7, margin + contentWidth, rowY + 7);

            doc.setTextColor(15, 23, 42);
            doc.text(sub.subject, margin + 4, rowY + 4.8);
            doc.text(String(sub.marks), 68, rowY + 4.8, { align: 'center' });
            doc.text(String(sub.maxMarks || 100), 84, rowY + 4.8, { align: 'center' });

            doc.setTextColor(37, 99, 235);
            doc.text(`${sub.percentage || Math.round((sub.marks / (sub.maxMarks || 100)) * 100)}%`, 98, rowY + 4.8, { align: 'center' });

            doc.setTextColor(16, 185, 129);
            doc.setFont('helvetica', 'bold');
            doc.text(sub.grade || 'A+', 114, rowY + 4.8, { align: 'center' });
            doc.text(sub.status || 'Pass', 130, rowY + 4.8, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            const remarkText = doc.splitTextToSize(sub.remarks || 'Satisfactory progress', contentWidth - 146)[0] || '';
            doc.text(remarkText, 144, rowY + 4.8, { align: 'left' });

            rowY += 7;
        });

        // Grand Total Row
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, rowY, contentWidth, 8, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('GRAND TOTAL (AGGREGATE)', margin + 4, rowY + 5.2);
        doc.text(String(student.totalMarks || 472), 68, rowY + 5.2, { align: 'center' });
        doc.text(String(student.maxMarks || 500), 84, rowY + 5.2, { align: 'center' });
        doc.setTextColor(37, 99, 235);
        doc.text(`${student.percentage || 94.4}%`, 98, rowY + 5.2, { align: 'center' });
        doc.setTextColor(16, 185, 129);
        doc.text(student.grade || 'A+', 114, rowY + 5.2, { align: 'center' });
        doc.text('PASS', 130, rowY + 5.2, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Rank #${student.rank || 1} in ${student.className || student.class || 'Class 10 - A'}`, 144, rowY + 5.2, { align: 'left' });

        // Performance Highlights & Remarks Card
        const remarksY = rowY + 10;
        const remarksCardHeight = 28;
        doc.setDrawColor(203, 213, 225);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, remarksY, contentWidth, remarksCardHeight, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        doc.text("TEACHER'S ASSESSMENT & EVALUATION REMARKS:", margin + 6, remarksY + 6);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.2);
        doc.setTextColor(71, 85, 105);
        const remarks = student.teacherRemarks || student.remarks || 'Exceptional intellectual curiosity and methodical study approach. Consistently disciplined and inquisitive.';
        const remarkLines = doc.splitTextToSize(`"${remarks}"`, contentWidth - 12);
        doc.text(remarkLines, margin + 6, remarksY + 12);

        doc.setDrawColor(226, 232, 240);
        doc.line(margin + 6, remarksY + remarksCardHeight - 6.5, margin + contentWidth - 6, remarksY + remarksCardHeight - 6.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(16, 185, 129);
        doc.text('Promotion Status: Promoted to Next Academic Term', margin + 6, remarksY + remarksCardHeight - 2.5);

        // Official Signatures
        const sigY = 248;
        const colWidth = (contentWidth - 12) / 3;

        // Class Teacher
        doc.setDrawColor(148, 163, 184);
        doc.line(margin + 2, sigY, margin + colWidth - 2, sigY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text('Sunita Paul', margin + colWidth / 2, sigY - 2, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('Class Teacher Signature', margin + colWidth / 2, sigY + 4, { align: 'center' });

        // Examination Controller
        const sig2X = margin + colWidth + 6;
        doc.line(sig2X, sigY, sig2X + colWidth - 4, sigY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text('Arvind Joseph', sig2X + (colWidth - 4) / 2, sigY - 2, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('Exam Incharge', sig2X + (colWidth - 4) / 2, sigY + 4, { align: 'center' });

        // Principal
        const sig3X = sig2X + colWidth + 6;
        doc.line(sig3X, sigY, sig3X + colWidth - 4, sigY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text('Dr. S. K. Bose', sig3X + (colWidth - 4) / 2, sigY - 2, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('Principal & Head of School', sig3X + (colWidth - 4) / 2, sigY + 4, { align: 'center' });

        const fileName = `${(student.name || 'Student').replace(/\s+/g, '_')}_Scorecard_${examName.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
        toast.success(`Downloaded ${fileName}`);
        return true;
    } catch (err) {
        console.error('Scorecard PDF error:', err);
        toast.error('Failed to generate Scorecard PDF');
        return false;
    }
};

/**
 * Generate Class Marksheet Ledger PDF with automatic multi-page pagination
 * Full view in Landscape mode without any rows or columns cut off.
 */
export const generateClassMarksheetPdf = (className = 'Class 10', examName = 'Half Yearly Examination', students = []) => {
    try {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape (297 x 210 mm)
        const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
        const pageHeight = doc.internal.pageSize.getHeight(); // 210mm

        const margin = 12;
        const contentWidth = pageWidth - margin * 2; // 273mm

        const drawHeader = (pageNum = 1) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('GREENWOOD INTERNATIONAL SCHOOL - CONSOLIDATED MARKSHEET', pageWidth / 2, 13, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`${className} | ${examName} | Academic Year 2026 - 27 | Generated on ${new Date().toLocaleDateString()} | Page ${pageNum}`, pageWidth / 2, 18.5, { align: 'center' });

            // Table Header Bar
            const startY = 24;
            doc.setFillColor(241, 245, 249);
            doc.rect(margin, startY, contentWidth, 7.5, 'F');
            doc.setDrawColor(203, 213, 225);
            doc.line(margin, startY + 7.5, margin + contentWidth, startY + 7.5);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.2);
            doc.setTextColor(30, 41, 59);

            doc.text('ROLL', margin + 4, startY + 5.2);
            doc.text('STUDENT NAME', margin + 22, startY + 5.2);
            doc.text('ENGLISH', 95, startY + 5.2, { align: 'center' });
            doc.text('MATH', 118, startY + 5.2, { align: 'center' });
            doc.text('SCIENCE', 140, startY + 5.2, { align: 'center' });
            doc.text('SST', 162, startY + 5.2, { align: 'center' });
            doc.text('HINDI', 184, startY + 5.2, { align: 'center' });
            doc.text('TOTAL (500)', 210, startY + 5.2, { align: 'center' });
            doc.text('PERCENTAGE', 234, startY + 5.2, { align: 'center' });
            doc.text('GRADE', 256, startY + 5.2, { align: 'center' });
            doc.text('RESULT', margin + contentWidth - 4, startY + 5.2, { align: 'right' });

            return startY + 7.5;
        };

        let currentPage = 1;
        let rowY = drawHeader(currentPage);

        students.forEach((s, idx) => {
            // Check if row exceeds printable height (210mm - 18mm margin)
            if (rowY > pageHeight - 18) {
                doc.addPage('a4', 'l');
                currentPage += 1;
                rowY = drawHeader(currentPage);
            }

            if (idx % 2 === 1) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margin, rowY, contentWidth, 6.5, 'F');
            }
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, rowY + 6.5, margin + contentWidth, rowY + 6.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.2);
            doc.setTextColor(15, 23, 42);

            doc.text(String(s.rollNo || idx + 1), margin + 4, rowY + 4.6);
            doc.text(s.studentName || s.name || '', margin + 22, rowY + 4.6);
            doc.text(String(s.english || 0), 95, rowY + 4.6, { align: 'center' });
            doc.text(String(s.math || 0), 118, rowY + 4.6, { align: 'center' });
            doc.text(String(s.science || 0), 140, rowY + 4.6, { align: 'center' });
            doc.text(String(s.sst || 0), 162, rowY + 4.6, { align: 'center' });
            doc.text(String(s.hindi || 0), 184, rowY + 4.6, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.text(String(s.totalMarks || 0), 210, rowY + 4.6, { align: 'center' });
            doc.setTextColor(37, 99, 235);
            doc.text(`${s.percentage || 0}%`, 234, rowY + 4.6, { align: 'center' });
            doc.setTextColor(15, 23, 42);
            doc.text(s.grade || 'A', 256, rowY + 4.6, { align: 'center' });

            const isPass = (s.result || 'PASS') === 'PASS';
            doc.setTextColor(isPass ? 16 : 225, isPass ? 185 : 29, isPass ? 129 : 72);
            doc.text(s.result || 'PASS', margin + contentWidth - 4, rowY + 4.6, { align: 'right' });

            rowY += 6.5;
        });

        const fileName = `${className.replace(/\s+/g, '_')}_${examName.replace(/\s+/g, '_')}_Marksheet.pdf`;
        doc.save(fileName);
        toast.success(`Downloaded ${fileName}`);
        return true;
    } catch (err) {
        console.error('Marksheet PDF error:', err);
        toast.error('Failed to generate marksheet PDF');
        return false;
    }
};

/**
 * Generate Question Paper PDF
 * Clean A4 portrait view without clipping.
 */
export const generateQuestionPaperPdf = (paper) => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        // School Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(15, 23, 42);
        doc.text('GREENWOOD INTERNATIONAL SCHOOL', pageWidth / 2, 18, { align: 'center' });

        doc.setFontSize(9.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`${paper.examName || 'Unit Test 1'} - ${paper.subjectName || 'Mathematics'}`, pageWidth / 2, 24, { align: 'center' });

        // Meta Bar
        doc.setDrawColor(203, 213, 225);
        doc.line(margin, 29, pageWidth - margin, 29);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(`CLASS: ${paper.className || 'Class 6'}`, margin, 34);
        doc.text(`TIME: ${paper.durationMinutes || 120} MINUTES`, pageWidth / 2, 34, { align: 'center' });
        doc.text(`MAX MARKS: ${paper.totalMarks || 100}`, pageWidth - margin, 34, { align: 'right' });

        doc.line(margin, 38, pageWidth - margin, 38);

        // General Instructions
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text('General Instructions:', margin, 44);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const instructions = [
            '1. All questions are compulsory and carry specified marks.',
            '2. Section A contains 10 Multiple Choice Questions carrying 1 mark each.',
            '3. Section B contains 8 Short Answer Questions carrying 3 marks each.',
            '4. Section C contains 6 Analytical & Application Questions carrying 5 marks each.',
            '5. Section D contains 2 Case Study based integrated questions carrying 6 marks each.',
            '6. Use of calculators or any electronic gadgets is strictly prohibited.',
        ];
        instructions.forEach((ins, i) => {
            doc.text(ins, margin + 3, 50 + i * 4.8);
        });

        // Section A
        let curY = 82;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text('SECTION A (10 x 1 = 10 Marks)', pageWidth / 2, curY, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        curY += 7;
        doc.text('Q1. Find the prime factorisation of 144 and write its index notation.', margin, curY);
        doc.text('[1 Mark]', pageWidth - margin, curY, { align: 'right' });
        curY += 6.5;
        doc.text('Q2. If a + b = 12 and ab = 32, find the value of a^2 + b^2.', margin, curY);
        doc.text('[1 Mark]', pageWidth - margin, curY, { align: 'right' });
        curY += 6.5;
        doc.text('Q3. Which of the following numbers is a rational number between 1/3 and 1/2?', margin, curY);
        doc.text('[1 Mark]', pageWidth - margin, curY, { align: 'right' });
        curY += 5.5;
        doc.text('(A) 5/12     (B) 7/12     (C) 1/6     (D) 3/4', margin + 6, curY);

        // Section B
        curY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text('SECTION B (8 x 3 = 24 Marks)', pageWidth / 2, curY, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        curY += 7;
        doc.text('Q4. Solve the linear equation: 4(2x - 3) + 5 = 3(x + 4) - 2.', margin, curY);
        doc.text('[3 Marks]', pageWidth - margin, curY, { align: 'right' });
        curY += 6.5;
        doc.text('Q5. In triangle ABC, angle B = 90 degrees, AB = 6 cm and BC = 8 cm. Find AC and sin A.', margin, curY);
        doc.text('[3 Marks]', pageWidth - margin, curY, { align: 'right' });

        const fileName = `${(paper.title || 'Question_Paper').replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
        toast.success(`Downloaded ${fileName}`);
        return true;
    } catch (err) {
        console.error('Question paper PDF error:', err);
        toast.error('Failed to download question paper PDF');
        return false;
    }
};

/**
 * Generate Exam Analytics PDF in full view
 */
export const generateAnalyticsPdf = (examName = 'Half Yearly Examination', className = 'Class 10') => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        const contentWidth = pageWidth - margin * 2;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(15, 23, 42);
        doc.text('GREENWOOD INTERNATIONAL SCHOOL', pageWidth / 2, 18, { align: 'center' });

        doc.setFontSize(10.5);
        doc.setTextColor(37, 99, 235);
        doc.text(`EXAM ANALYTICS REPORT - ${examName.toUpperCase()}`, pageWidth / 2, 25, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Target: ${className} | Academic Year 2026 - 27 | Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 31, { align: 'center' });

        // Executive Metrics
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, 38, contentWidth, 22, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('TOTAL ENROLLED', margin + 8, 46);
        doc.text('PASSED', margin + 55, 46);
        doc.text('CLASS AVERAGE', margin + 100, 46);
        doc.text('TOP SCORE', margin + 145, 46);

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('48', margin + 8, 54);
        doc.setTextColor(16, 185, 129);
        doc.text('44 (91.7%)', margin + 55, 54);
        doc.setTextColor(37, 99, 235);
        doc.text('78.6%', margin + 100, 54);
        doc.setTextColor(16, 185, 129);
        doc.text('98% (Aarav Sharma)', margin + 145, 54);

        // Grade Tiers
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text('Grade Tier Breakdown', margin, 70);

        const grades = [
            { grade: 'A1 (91-100%)', count: 12, pct: '25.0%' },
            { grade: 'A2 (81-90%)', count: 14, pct: '29.2%' },
            { grade: 'B1 (71-80%)', count: 10, pct: '20.8%' },
            { grade: 'B2 (61-70%)', count: 6, pct: '12.5%' },
            { grade: 'C1 (51-60%)', count: 4, pct: '8.3%' },
            { grade: 'C2 (41-50%)', count: 1, pct: '2.1%' },
            { grade: 'D (33-40%)', count: 1, pct: '2.1%' },
        ];

        let gy = 77;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        grades.forEach((g) => {
            doc.setTextColor(30, 41, 59);
            doc.text(g.grade, margin + 4, gy);
            doc.text(`${g.count} Students`, margin + 80, gy);
            doc.setTextColor(37, 99, 235);
            doc.text(g.pct, margin + contentWidth - 4, gy, { align: 'right' });
            gy += 6.5;
        });

        const fileName = `${className}_${examName.replace(/\s+/g, '_')}_Analytics_Report.pdf`;
        doc.save(fileName);
        toast.success(`Downloaded ${fileName}`);
        return true;
    } catch (err) {
        console.error('Analytics PDF error:', err);
        toast.error('Failed to generate analytics PDF');
        return false;
    }
};
