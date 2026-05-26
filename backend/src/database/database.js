import "dotenv/config";
import prismaClient from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const { PrismaClient } = prismaClient;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = new PrismaClient({
  adapter: new PrismaPg(pool),
});

export default db;