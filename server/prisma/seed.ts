import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const password = "Password123";
const majors = [
    "Computer Engineering",
    "Information Systems",
    "Computer Science",
] as const;

const students = [
    [
        "Amina Hassan",
        "Mansoura",
        4.0,
        majors[2],
        "React and Node.js frontend developer",
    ],
    [
        "Omar Ali",
        "Cairo",
        3.9,
        majors[2],
        "Backend developer using Node.js and PostgreSQL",
    ],
    [
        "Salma Adel",
        "Mansoura",
        3.8,
        majors[2],
        "React, TypeScript and Frontend projects",
    ],
    [
        "Youssef Samir",
        "Giza",
        3.6,
        majors[2],
        "Python and Machine Learning enthusiast",
    ],
    [
        "Mariam Tarek",
        "Alexandria",
        3.4,
        majors[2],
        "Java and Backend development",
    ],
    [
        "Karim Nabil",
        "Tanta",
        3.1,
        majors[2],
        "Cloud, React and API integration",
    ],
    [
        "Nour Ahmed",
        "Mansoura",
        2.7,
        majors[2],
        "Frontend foundations with React",
    ],
    [
        "Ahmed Mostafa",
        "Mansoura",
        3.95,
        majors[0],
        "Embedded systems, C++ and Python",
    ],
    [
        "Laila Mohamed",
        "Cairo",
        3.75,
        majors[0],
        "Computer Engineering and Cloud projects",
    ],
    [
        "Mahmoud Fathy",
        "Giza",
        3.55,
        majors[0],
        "Java, Backend and system design",
    ],
    [
        "Hana Ibrahim",
        "Mansoura",
        3.35,
        majors[0],
        "IoT, Python and Data Analysis",
    ],
    [
        "Mostafa Khaled",
        "Alexandria",
        3.05,
        majors[0],
        "Hardware integration and Backend basics",
    ],
    [
        "Rana Saad",
        "Tanta",
        2.8,
        majors[0],
        "Python programming and Cloud fundamentals",
    ],
    [
        "Ziad Amr",
        "Mansoura",
        2.5,
        majors[0],
        "Computer Engineering student interested in Java",
    ],
    [
        "Farah Ashraf",
        "Mansoura",
        3.9,
        majors[1],
        "Data Analysis, SQL and PostgreSQL",
    ],
    [
        "Tamer Wael",
        "Cairo",
        3.65,
        majors[1],
        "Information Systems and Backend development",
    ],
    [
        "Dina Hossam",
        "Giza",
        3.3,
        majors[1],
        "React, Business Analysis and Frontend",
    ],
    ["Belal Emad", "Mansoura", 2.9, majors[1], "Python and Data Analysis"],
    [
        "Reem Gamal",
        "Alexandria",
        2.6,
        majors[1],
        "Information Systems student with Cloud interests",
    ],
    ["Khaled Essam", "Tanta", 2.4, majors[1], "Java and database fundamentals"],
] as const;

const companies = [
    "Nile Labs",
    "Vertex Systems",
    "Pixel Bridge",
    "Orbit Logic",
    "Cedar Tech",
    "Atlas Digital",
    "Blue Horizon",
    "SparkWorks",
    "Delta Solutions",
    "CorePath",
];
const internshipTemplates = {
    "Computer Science": [
        "Frontend React Intern",
        "Node.js Backend Intern",
        "Python Automation Intern",
        "Machine Learning Intern",
        "Cloud Engineering Intern",
        "Java Developer Intern",
        "Full Stack Intern",
        "Data Platform Intern",
    ],
    "Computer Engineering": [
        "Embedded Systems Intern",
        "IoT Engineering Intern",
        "Hardware Integration Intern",
        "Cloud Infrastructure Intern",
        "Java Systems Intern",
        "Python Tools Intern",
        "Network Automation Intern",
        "Platform Engineering Intern",
    ],
    "Information Systems": [
        "Data Analysis Intern",
        "Business Systems Intern",
        "SQL Database Intern",
        "Frontend Systems Intern",
        "Backend Operations Intern",
        "Cloud Data Intern",
        "Java Applications Intern",
        "Analytics Platform Intern",
    ],
} as const;

const seed = async () => {
    if (process.env.NODE_ENV === "production")
        throw new Error("The evaluation seed cannot run in production.");
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
        await tx.distributionResult.deleteMany();
        await tx.profileView.deleteMany();
        await tx.application.deleteMany();
        await tx.internship.deleteMany();
        await tx.studentProfile.deleteMany();
        await tx.companyProfile.deleteMany();
        await tx.user.deleteMany();

        const seededStudents = [] as Array<{
            id: string;
            name: string;
            major: string;
            gpa: number;
        }>;
        for (const [
            index,
            [name, city, gpa, major, bio],
        ] of students.entries()) {
            const user = await tx.user.create({
                data: {
                    email: `student${index + 1}@example.com`,
                    passwordHash,
                    role: UserRole.STUDENT,
                    studentProfile: {
                        create: {
                            nationalId: String(3_000_000_000_000 + index),
                            name,
                            city,
                            gpa,
                            major,
                            bio,
                        },
                    },
                },
                select: { studentProfile: { select: { id: true } } },
            });
            seededStudents.push({
                id: user.studentProfile!.id,
                name,
                major,
                gpa,
            });
        }
        const seededCompanies = [] as Array<{ id: string }>;
        for (const [index, name] of companies.entries()) {
            const user = await tx.user.create({
                data: {
                    email: `company${index + 1}@example.com`,
                    passwordHash,
                    role: UserRole.COMPANY,
                    companyProfile: { create: { name } },
                },
                select: { companyProfile: { select: { id: true } } },
            });
            seededCompanies.push({ id: user.companyProfile!.id });
        }
        await tx.user.create({
            data: {
                email: "admin1@example.com",
                passwordHash,
                role: UserRole.ADMIN,
            },
        });

        const internships = [] as Array<{
            id: string;
            major: string;
            minimumGpa: number;
        }>;
        let sequence = 0;
        for (const major of majors)
            for (const [templateIndex, title] of internshipTemplates[
                major
            ].entries()) {
                const minimumGpa = [2.4, 2.5, 2.7, 2.9, 3.0, 3.2, 3.4, 3.6][
                    templateIndex
                ];
                const internship = await tx.internship.create({
                    data: {
                        companyId:
                            seededCompanies[sequence % seededCompanies.length]
                                .id,
                        title,
                        description: `${title} opportunity for ${major} students to gain practical experience.`,
                        major,
                        minimumGpa,
                        capacity: [1, 2, 2, 1, 3, 1, 2, 1][templateIndex],
                    },
                });
                internships.push({ id: internship.id, major, minimumGpa });
                sequence += 1;
            }
        const applications: Array<{
            studentId: string;
            internshipId: string;
            wishOrder: number;
            createdAt: Date;
        }> = [];
        for (const [index, student] of seededStudents.entries()) {
            if (index >= 18) continue;
            const eligible = internships.filter(
                (internship) =>
                    internship.major === student.major &&
                    internship.minimumGpa <= student.gpa,
            );
            for (const [wishIndex, internship] of eligible
                .slice(0, 3)
                .entries())
                applications.push({
                    studentId: student.id,
                    internshipId: internship.id,
                    wishOrder: wishIndex + 1,
                    createdAt: new Date(
                        Date.UTC(2026, 0, 1, 0, index, wishIndex),
                    ),
                });
        }
        await tx.application.createMany({ data: applications });
        await tx.profileView.createMany({
            data: [
                {
                    studentId: seededStudents[0].id,
                    companyId: seededCompanies[0].id,
                },
                {
                    studentId: seededStudents[0].id,
                    companyId: seededCompanies[1].id,
                },
                {
                    studentId: seededStudents[1].id,
                    companyId: seededCompanies[0].id,
                },
                {
                    studentId: seededStudents[2].id,
                    companyId: seededCompanies[2].id,
                },
                {
                    studentId: seededStudents[2].id,
                    companyId: seededCompanies[2].id,
                },
                {
                    studentId: seededStudents[7].id,
                    companyId: seededCompanies[3].id,
                },
                {
                    studentId: seededStudents[14].id,
                    companyId: seededCompanies[4].id,
                },
            ],
        });
        console.log(
            `Seed completed:\n${seededStudents.length} students\n${seededCompanies.length} companies\n${internships.length} internships\n${applications.length} applications\n7 profile views\n\nDemo credentials:\nAdmin: admin1@example.com / ${password}\nStudent: student1@example.com / ${password}\nCompany: company1@example.com / ${password}`,
        );
    });
};

seed()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
