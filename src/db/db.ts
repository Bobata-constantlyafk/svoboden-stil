import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  dbGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.dbGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.dbGlobal = db;
