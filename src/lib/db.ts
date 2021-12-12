import Prisma, * as PrismaAll from "@prisma/client";

const PrismaClient = Prisma?.PrismaClient || PrismaAll?.PrismaClient;
export default new PrismaClient({log: ['error', 'info', 'query', 'warn']});