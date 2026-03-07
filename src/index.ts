import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

console.log("DATABASE_URL", process.env.DATABASE_URL!);

export const db = drizzle(process.env.DATABASE_URL!);
