export const isInternshipEligible = (
    student: { major: string; gpa: number },
    internship: { major: string; minimumGpa: number },
) =>
    student.major.toLowerCase() === internship.major.toLowerCase() &&
    internship.minimumGpa <= student.gpa;
