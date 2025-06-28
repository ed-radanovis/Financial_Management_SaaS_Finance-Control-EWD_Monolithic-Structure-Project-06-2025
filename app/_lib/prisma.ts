// code for old Prisma version, before 03_02_2025

/* eslint-disable no-unused-vars */
// import { PrismaClient } from "@prisma/client";

// declare global {
// 	// eslint-disable-next-line no-var
// 	var cachedPrisma: PrismaClient;
// }

// let prisma: PrismaClient;
// if (process.env.NODE_ENV === "production") {
// opens a connection to the database
// 	prisma = new PrismaClient();
// } else {
// 	if (!global.cachedPrisma) {
// 		global.cachedPrisma = new PrismaClient();
// 	}
// 	prisma = global.cachedPrisma;
// }

// export const db = prisma;

// new version after the crash, 03_02_2025
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	// eslint-disable-next-line no-var
	var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const db = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") global.prisma = db;
