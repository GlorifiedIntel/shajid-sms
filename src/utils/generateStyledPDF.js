import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Helper: fetch any image as bytes
async function fetchImageBytes(url) {
  const res = await fetch(url);
  return await res.arrayBuffer();
}

export async function generateStyledPDF(allData) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;
  const bottomMargin = 50;

  try {
    const logoBytes = await fetchImageBytes('/logo.png');
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.25);
    page.drawImage(logoImage, {
      x: width - logoDims.width - 40,
      y: height - logoDims.height - 30,
      width: logoDims.width,
      height: logoDims.height,
    });
  } catch (e) {
    console.warn('Logo image not found or failed to load:', e);
  }

  page.drawText('SHAJID COLLEGE OF NURSING', {
    x: 80,
    y: height / 2,
    size: 40,
    font: boldFont,
    rotate: { angle: Math.PI / 4 },
    opacity: 0.08,
    color: rgb(0.5, 0.5, 0.5),
  });

  // --- Fixed Passport Photo Embedding ---
  try {
    const photoUrl = allData.personalInfo?.photo || '/default-avatar.jpg';
    const photoBytes = await fetchImageBytes(photoUrl);
    const lowerUrl = photoUrl.toLowerCase();

    let photoImage;
    if (lowerUrl.endsWith('.png')) {
      photoImage = await pdfDoc.embedPng(photoBytes);
    } else if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) {
      photoImage = await pdfDoc.embedJpg(photoBytes);
    } else {
      throw new Error('Unsupported image format (must be PNG or JPG)');
    }

    const photoDims = photoImage.scale(0.2);

    page.drawImage(photoImage, {
      x: 50,
      y: height - photoDims.height - 40,
      width: photoDims.width,
      height: photoDims.height,
    });

    page.drawText('Passport Photo', {
      x: 50,
      y: height - photoDims.height - 55,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    y = height - photoDims.height - 80;
  } catch (err) {
    console.warn('Passport photo load failed:', err);
    y -= 20;
  }
  // --- End Passport Photo ---

  function checkAddPage() {
    if (y < bottomMargin) {
      page = pdfDoc.addPage();
      y = height - 50;
    }
  }

  const drawLine = () => {
    page.drawLine({
      start: { x: 50, y: y + 10 },
      end: { x: width - 50, y: y + 10 },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });
  };

  const drawSectionHeader = (title) => {
    checkAddPage();
    page.drawText(title, {
      x: 50,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.7),
    });
    drawLine();
    y -= 25;
  };

  const drawField = (label, value, isStrong = false) => {
    checkAddPage();
    page.drawText(`${label}:`, {
      x: 60,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`${value || 'N/A'}`, {
      x: 150,
      y,
      size: 10,
      font: isStrong ? boldFont : font,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 14;
  };

  const drawSchoolsTable = (primary, secondary, others) => {
    checkAddPage();
    page.drawText('Level', { x: 60, y, size: 10, font: boldFont });
    page.drawText('School Name', { x: 140, y, size: 10, font: boldFont });
    page.drawText('From', { x: 360, y, size: 10, font: boldFont });
    page.drawText('To', { x: 420, y, size: 10, font: boldFont });
    y -= 15;

    const row = (label, school) => {
      page.drawText(label, { x: 60, y, size: 10, font });
      page.drawText(school?.name || 'N/A', { x: 140, y, size: 10, font });
      page.drawText(school?.from || 'N/A', { x: 360, y, size: 10, font });
      page.drawText(school?.to || 'N/A', { x: 420, y, size: 10, font });
      y -= 14;
    };

    row('Primary', primary);
    row('Secondary', secondary);

    if (others) {
      page.drawText('Other Institutions:', { x: 60, y, size: 10, font: boldFont });
      y -= 14;
      page.drawText(others, { x: 80, y, size: 10, font });
      y -= 14;
    }
  };

  const drawExamTable = (sitting) => {
    drawField('Exam Type', sitting.examType);
    drawField('Exam Year', sitting.examYear);
    drawField('Exam Number', sitting.examNumber);

    checkAddPage();
    page.drawText('Subject', { x: 60, y, size: 10, font: boldFont });
    page.drawText('Grade', { x: 300, y, size: 10, font: boldFont });
    y -= 14;

    (sitting.subjects || []).forEach((s) => {
      checkAddPage();
      page.drawText(s.subject || '-', { x: 60, y, size: 10, font });
      page.drawText(s.grade || '-', { x: 300, y, size: 10, font });
      y -= 14;
    });
  };

  const drawUtmeSubjects = (subjects) => {
    checkAddPage();
    page.drawText('Subject', { x: 60, y, size: 10, font: boldFont });
    y -= 14;

    subjects.forEach((subj) => {
      checkAddPage();
      page.drawText(subj, { x: 60, y, size: 10, font });
      y -= 14;
    });
  };

  const space = (amt = 15) => {
    y -= amt;
  };

  page.drawText('Application Summary', {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.5),
  });
  y -= 30;

  const personal = allData.personalInfo || {};
  drawSectionHeader('Personal Information');
  drawField('Full Name', personal.fullName, true);
  drawField('Gender', personal.gender);
  drawField('Date of Birth', personal.dob);
  drawField('Email', personal.email);
  drawField('Phone', personal.phone);
  drawField('Contact Address', personal.address);
  drawField('Parent/Guardian Name', personal.parentName);
  drawField("Parent's Contact Address", personal.parentAddress);
  space();

  const health = allData.healthInfo || {};
  drawSectionHeader('Health Information');
  drawField('Chronic Illness', health.chronicIllness);
  drawField('Blood Group', health.bloodGroup);
  drawField('Genotype', health.genotype);
  drawField('Emergency Contact', health.emergencyContact);
  space();

  drawSectionHeader('Schools Attended');
  drawSchoolsTable(
    allData.schoolsAttended?.primarySchool,
    allData.schoolsAttended?.secondarySchool,
    allData.schoolsAttended?.otherInstitutions
  );
  space();

  const sit1 = allData.examResults?.sitting1 || {};
  drawSectionHeader('Exam Results - Sitting 1');
  drawExamTable(sit1);
  space();

  const sit2 = allData.examResults?.sitting2;
  if (sit2?.examType) {
    drawSectionHeader('Exam Results - Sitting 2');
    drawExamTable(sit2);
    space();
  }

  const program = allData.programDetails || {};
  drawSectionHeader('Program Details');
  drawField('Program of Choice', program.program, true);
  drawField('Mode of Study', program.mode);
  drawField('Campus', program.campus);
  space();

  const utme = allData.utmeInfo || {};
  drawSectionHeader('UTME Information');
  drawField('JAMB Reg No', utme.jambRegNo);
  drawField('JAMB Score', utme.jambScore);
  drawUtmeSubjects(utme.jambSubjects || []);
  space();

  drawSectionHeader('Declaration');
  drawField('Signature', '_________________________');
  drawField('Date', new Date().toLocaleDateString());
  space();

  pdfDoc.getPages().forEach((pg, index) => {
    pg.drawText(`Page ${index + 1} of ${pdfDoc.getPageCount()}`, {
      x: pg.getWidth() - 100,
      y: 20,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  return await pdfDoc.save();
}