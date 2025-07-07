import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: String,
  from: String,
  to: String,
});

const ExamSubjectSchema = new mongoose.Schema({
  subject: String,
  grade: String,
});

const ExamSittingSchema = new mongoose.Schema({
  examType: String,
  examYear: String,
  examNumber: String,
  subjects: [ExamSubjectSchema],
});

const ApplicationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // email or user ID
    personalInfo: {
      fullName: String,
      dob: String,
      gender: String,
      phone: String,
      email: String,
      address: String,
      photo: String, // base64 or URL
      parentName: String,
      parentAddress: String,
    },
    healthInfo: {
      bloodGroup: String,
      genotype: String,
      chronicIllness: String,
      emergencyContact: String,
    },
    schoolsAttended: {
      primarySchool: SchoolSchema,
      secondarySchool: SchoolSchema,
      otherInstitutions: String,
    },
    examResults: {
      sitting1: ExamSittingSchema,
      sitting2: ExamSittingSchema,
    },
    programDetails: {
      courseChoice: String,
    },
    utmeInfo: {
      regNumber: String,
      examYear: String,
      score: String,
      center: String,
    },
    submitted: {
      type: Boolean,
      default: false,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    adminFeedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Application ||
  mongoose.model('Application', ApplicationSchema);