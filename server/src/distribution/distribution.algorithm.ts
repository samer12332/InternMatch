export type AllocationApplication = {
    id: string;
    internshipId: string;
    wishOrder: number;
    createdAt: Date;
};
export type AllocationStudent = {
    id: string;
    gpa: number;
    applications: AllocationApplication[];
};
export type AllocationInternship = { id: string; capacity: number };

// Project decision: complete each preference round before considering the next one.
export const allocateApplications = (
    students: AllocationStudent[],
    internships: AllocationInternship[],
) => {
    const remainingCapacity = new Map(
        internships.map((internship) => [internship.id, internship.capacity]),
    );
    const assignedApplicationByStudent = new Map<string, string>();
    for (const wishOrder of [1, 2, 3]) {
        const candidatesByInternship = new Map<
            string,
            Array<{
                id: string;
                studentId: string;
                gpa: number;
                createdAt: Date;
            }>
        >();
        for (const student of students) {
            if (assignedApplicationByStudent.has(student.id)) continue;
            const application = student.applications.find(
                (item) => item.wishOrder === wishOrder,
            );
            if (
                !application ||
                (remainingCapacity.get(application.internshipId) ?? 0) < 1
            )
                continue;
            const candidates =
                candidatesByInternship.get(application.internshipId) ?? [];
            candidates.push({
                ...application,
                studentId: student.id,
                gpa: student.gpa,
            });
            candidatesByInternship.set(application.internshipId, candidates);
        }
        for (const [internshipId, candidates] of candidatesByInternship) {
            candidates.sort(
                (left, right) =>
                    right.gpa - left.gpa ||
                    left.createdAt.getTime() - right.createdAt.getTime() ||
                    left.id.localeCompare(right.id),
            );
            const winners = candidates.slice(
                0,
                remainingCapacity.get(internshipId) ?? 0,
            );
            for (const winner of winners)
                assignedApplicationByStudent.set(winner.studentId, winner.id);
            remainingCapacity.set(
                internshipId,
                (remainingCapacity.get(internshipId) ?? 0) - winners.length,
            );
        }
    }
    return assignedApplicationByStudent;
};
