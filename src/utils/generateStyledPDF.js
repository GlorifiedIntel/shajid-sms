import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Helper: fetch any image as bytes
async function fetchImageBytes(url) {
  const res = await fetch(url);
  return await res.arrayBuffer();
}

export async function generateStyledPDF(allData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  // === LOGO ===
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

  // === WATERMARK ===
  page.drawText('SHAJID COLLEGE OF NURSING', {
    x: 80,
    y: height / 2,
    size: 40,
    font: boldFont,
    rotate: { angle: Math.PI / 4 },
    opacity: 0.08,
    color: rgb(0.5, 0.5, 0.5),
  });

  // === PASSPORT PHOTO ===
  try {
    const photoUrl = allData.personalInfo?.photoUrl || '/default-avatar.jpg';
    const photoBytes = await fetchImageBytes(photoUrl);
    const photoImage = photoUrl.endsWith('.png')
      ? await pdfDoc.embedPng(photoBytes)
      : await pdfDoc.embedJpg(photoBytes);
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

  // === DRAW HELPERS ===
  const drawSectionHeader = (title) => {
    page.drawText(title, {
      x: 50,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.7),
    });
    y -= 20;
  };

  const drawField = (label, value) => {
    page.drawText(`${label}: ${value || 'N/A'}`, {
      x: 60,
      y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  };

  const space = (amt = 10) => (y -= amt);

  // === TITLE ===
  page.drawText('Application Summary', {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.5),
  });
  y -= 30;

  // === Personal Info ===
  const personal = allData.personalInfo || {};
  drawSectionHeader('Personal Information');
  drawField('Full Name', personal.fullName);
  drawField('Gender', personal.gender);
  drawField('Date of Birth', personal.dob);
  drawField('Email', personal.email);
  drawField('Phone', personal.phone);
  drawField('Contact Address', personal.address);
  drawField('Parent/Guardian Name', personal.parentName);
  drawField('Parent\'s Contact Address', personal.parentAddress);
  space();

  // === Health Info ===
  const health = allData.healthInfo || {};
  drawSectionHeader('Health Information');
  drawField('Chronic Illness', health.chronicIllness);
  drawField('Blood Group', health.bloodGroup);
  drawField('Genotype', health.genotype);
  drawField('Emergency Contact', health.emergencyContact);
  space();

  // === Schools Attended ===
  const schools = allData.schoolsAttended || {};
  drawSectionHeader('Schools Attended');
  drawField('Primary School', schools.primarySchool);
  drawField('Secondary School', schools.secondarySchool);
  drawField('Other Institutions', schools.otherInstitutions);
  space();

  // === Exam Results: Sitting 1 ===
  const sit1 = allData.examResults?.sitting1 || {};
  drawSectionHeader('Exam Results - Sitting 1');
  drawField('Exam Type', sit1.examType);
  drawField('Exam Year', sit1.examYear);
  drawField('Exam Number', sit1.examNumber);
  (sit1.subjects || []).forEach((s, i) =>
    drawField(`Subject ${i + 1}`, `${s.subject} - ${s.grade}`)
  );
  space();

  // === Exam Results: Sitting 2 (Optional) ===
  const sit2 = allData.examResults?.sitting2;
  if (sit2?.examType) {
    drawSectionHeader('Exam Results - Sitting 2');
    drawField('Exam Type', sit2.examType);
    drawField('Exam Year', sit2.examYear);
    drawField('Exam Number', sit2.examNumber);
    (sit2.subjects || []).forEach((s, i) =>
      drawField(`Subject ${i + 1}`, `${s.subject} - ${s.grade}`)
    );
    space();
  }

  // === Program Details ===
  const program = allData.programDetails || {};
  drawSectionHeader('Program Details');
  drawField('Program of Choice', program.program);
  drawField('Mode of Study', program.mode);
  drawField('Campus', program.campus);
  space();

  // === UTME Info ===
  const utme = allData.utmeInfo || {};
  drawSectionHeader('UTME Information');
  drawField('JAMB Reg No', utme.jambRegNo);
  drawField('JAMB Score', utme.jambScore);
  drawField('Subjects', (utme.jambSubjects || []).join(', '));
  space();

  // === FOOTER ===
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