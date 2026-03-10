// prisma/seed.ts
// TypeScript version of the seed — same logic as seed.mjs
// Run with: npx prisma db seed

import pg                        from "pg";
import { PrismaPg }              from "@prisma/adapter-pg";
import { PrismaClient,
         Role, EventType,
         AttendanceStatus }      from "../src/generated/prisma/index.js";
import { faker }                 from "@faker-js/faker";

const { Pool } = pg;

// Create a pg connection pool — Prisma v7 requires an explicit driver adapter
const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// Seed counts — adjust as needed
const NUM_ORGANIZERS = 4;
const NUM_USERS      = 20;
const NUM_EVENTS     = 10; // per organizer

async function main() {

  console.log("🌱 Starting seed...");

  // Clear tables in FK order: child first, then parent
  console.log("  Clearing tables...");
  await prisma.attendance.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleared");

  // ── Organizers ────────────────────────────────────────────────────────────
  console.log("  Creating organizers...");
  const organizers: { id: string; name: string; email: string }[] = [];

  for (let i = 0; i < NUM_ORGANIZERS; i++) {
    const org = await prisma.user.create({
      data: {
        name:     faker.person.fullName(),
        email:    faker.internet.email(),
        password: faker.internet.password({ length: 12 }),
        role:     Role.ORGANIZER,
      },
    });
    organizers.push(org);
    console.log("    →", org.name, "|", org.email);
  }

  // ── Regular users ─────────────────────────────────────────────────────────
  console.log("  Creating users...");
  const users: { id: string }[] = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const user = await prisma.user.create({
      data: {
        name:     faker.person.fullName(),
        email:    faker.internet.email(),
        password: faker.internet.password({ length: 12 }),
        role:     Role.USER,
      },
    });
    users.push(user);
  }
  console.log("  ✓ Created", users.length, "users");

  // ── Events + attendance ───────────────────────────────────────────────────
  console.log("  Creating events and attendance...");
  let totalEvents     = 0;
  let totalAttendance = 0;

  for (const organizer of organizers) {
    for (let i = 0; i < NUM_EVENTS; i++) {

      const isPrivate = faker.datatype.boolean();

      const event = await prisma.event.create({
        data: {
          title:       faker.company.catchPhrase(),
          description: faker.lorem.sentences(2),
          type:        isPrivate ? EventType.PRIVATE : EventType.PUBLIC,
          isPrivate:   isPrivate,
          privateCode: isPrivate ? faker.string.alphanumeric(8).toUpperCase() : null,
          createdBy:   organizer.id,
          organizerId: organizer.id,
        },
      });
      totalEvents++;

      // Register 2–8 random users for this event
      const count     = faker.number.int({ min: 2, max: 8 });
      const attendees = [...users].sort(() => Math.random() - 0.5).slice(0, count);

      for (const user of attendees) {
        const roll   = Math.random();
        const status = roll < 0.4 ? AttendanceStatus.PRESENT
                     : roll < 0.7 ? AttendanceStatus.ABSENT
                     :              AttendanceStatus.NOT_MARKED;

        await prisma.attendance.create({
          data: { userId: user.id, eventId: event.id, status },
        });
        totalAttendance++;
      }
    }
  }

  console.log("  ✓ Created", totalEvents,     "events");
  console.log("  ✓ Created", totalAttendance, "attendance records");

  console.log("\n✅ Seed complete!");
  console.log("\n── Paste one of these into TEST_ORGANIZER_ID in dashboard/page.tsx ──");
  for (const org of organizers) {
    console.log("  ", org.name, "\n   ID:", org.id);
  }
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });