import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  pdf,
} from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
});

export async function generateStyledPDF(data) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo2.png" alt="Shajid College Logo" style={styles.logo} />
          <Text style={styles.schoolName}>Shajid College of Nursing & Midwifery</Text>
        </View>

        <Text style={styles.title}>Application Summary</Text>

        {data?.personalInfo?.photo && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image
              src={data.personalInfo.photo}
              alt="Applicant Passport Photo"
              style={styles.passport}
            />
          </View>
        )}

        <Section title="Personal Information">
          <Item label="Full Name" value={data.personalInfo?.fullName} />
          <Item label="Gender" value={data.personalInfo?.gender} />
          <Item label="Date of Birth" value={data.personalInfo?.dob} />
          <Item label="Email" value={data.personalInfo?.email} />
          <Item label="Phone" value={data.personalInfo?.phone} />
          <Item label="Address" value={data.personalInfo?.address} />
          <Item label="Parent Name" value={data.personalInfo?.parentName} />
          <Item label="Parent Address" value={data.personalInfo?.parentAddress} />
        </Section>

        <Section title="Health Information">
          <Item label="Blood Group" value={data.healthInfo?.bloodGroup} />
          <Item label="Genotype" value={data.healthInfo?.genotype} />
          <Item label="Chronic Illness" value={data.healthInfo?.chronicIllness} />
          <Item label="Emergency Contact" value={data.healthInfo?.emergencyContact} />
        </Section>

        <Section title="Schools Attended">
          <Table
            headers={['Level', 'School Name', 'From', 'To']}
            rows={[
              [
                'Primary',
                data.schoolsAttended?.primarySchool?.name || '-',
                data.schoolsAttended?.primarySchool?.from || '-',
                data.schoolsAttended?.primarySchool?.to || '-',
              ],
              [
                'Secondary',
                data.schoolsAttended?.secondarySchool?.name || '-',
                data.schoolsAttended?.secondarySchool?.from || '-',
                data.schoolsAttended?.secondarySchool?.to || '-',
              ],
              data.schoolsAttended?.otherInstitutions
                ? ['Other', data.schoolsAttended.otherInstitutions, '', '']
                : null,
            ].filter(Boolean)}
          />
        </Section>

        {data.examResults?.sitting1?.examType && (
          <Section title={`Exam Results – Sitting 1 (${data.examResults.sitting1.examType} ${data.examResults.sitting1.examYear})`}>
            <Item label="Exam Number" value={data.examResults.sitting1.examNumber} />
            <Table
              headers={['Subject', 'Grade']}
              rows={data.examResults.sitting1.subjects.map((s) => [s.subject, s.grade])}
            />
          </Section>
        )}

        {data.examResults?.sitting2?.examType && data.examResults?.sitting2?.subjects?.length > 0 && (
          <Section title={`Exam Results – Sitting 2 (${data.examResults.sitting2.examType} ${data.examResults.sitting2.examYear})`}>
            <Item label="Exam Number" value={data.examResults.sitting2.examNumber} />
            <Table
              headers={['Subject', 'Grade']}
              rows={data.examResults.sitting2.subjects.map((s) => [s.subject, s.grade])}
            />
          </Section>
        )}

        <Section title="Program Details">
          <Item
            label="Course Choice"
            value={
              data.programDetails?.courseChoice ||
              data.program?.courseChoice
            }
          />
          <Item
            label="Mode of Study"
            value={
              data.programDetails?.modeOfStudy ||
              data.program?.modeOfStudy
            }
          />
          <Item
            label="Campus"
            value={
              data.programDetails?.campus ||
              data.program?.campus
            }
          />
        </Section>

        <Section title="UTME Information">
          <Item
            label="JAMB Reg No"
            value={
              data.utme?.regNumber ||
              data.utmeInfo?.regNumber
            }
          />
          <Item
            label="JAMB Score"
            value={
              data.utme?.score ||
              data.utmeInfo?.score
            }
          />
          <Table
            headers={['UTME Subjects']}
            rows={
              (data.utme?.subjects || data.utmeInfo?.subjects || []).map((subj) => [subj])
            }
          />
        </Section>
      </Page>
    </Document>
  );

  return await pdf(doc).toBlob();
}

// Layout components

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Item = ({ label, value }) =>
  value ? (
    <View style={styles.item}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  ) : null;

const Table = ({ headers, rows }) => (
  <View style={styles.table}>
    <View style={styles.tableRowHeader}>
      {headers.map((header, i) => (
        <Text key={i} style={[styles.tableCell, styles.tableHeaderCell]}>
          {header}
        </Text>
      ))}
    </View>
    {rows.map((row, i) => (
      <View key={i} style={styles.tableRow}>
        {row.map((cell, j) => (
          <Text key={j} style={styles.tableCell}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e3b55',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  passport: {
    width: 100,
    height: 120,
    objectFit: 'cover',
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1px solid #ccc',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 6,
    fontSize: 11,
    border: '1px solid #ccc',
    flex: 1,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
});