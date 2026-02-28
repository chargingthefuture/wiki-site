import { db } from "../server/db";
import { moodChecks, moodAnnouncements } from "../shared/schema";

// Generate a random client ID (simulating anonymous users)
function generateClientId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function seedMood() {
  try {
    console.log("Starting Mood seeding...");

    // Generate unique client IDs
    const clientIds = [
      generateClientId(),
      generateClientId(),
      generateClientId(),
      generateClientId(),
    ];

    // Create some mood checks (anonymous, using client IDs)
    const moodChecksData = [
      { clientId: clientIds[0], moodValue: 3, daysAgo: 0 }, // Today
      { clientId: clientIds[0], moodValue: 4, daysAgo: 1 }, // Yesterday
      { clientId: clientIds[0], moodValue: 3, daysAgo: 2 },
      { clientId: clientIds[1], moodValue: 4, daysAgo: 0 },
      { clientId: clientIds[1], moodValue: 5, daysAgo: 1 },
      { clientId: clientIds[2], moodValue: 2, daysAgo: 0 },
      { clientId: clientIds[2], moodValue: 3, daysAgo: 1 },
      { clientId: clientIds[3], moodValue: 4, daysAgo: 0 },
    ];

    for (const moodData of moodChecksData) {
      try {
        const date = new Date();
        date.setDate(date.getDate() - moodData.daysAgo);

        await db.insert(moodChecks).values({
          clientId: moodData.clientId,
          moodValue: moodData.moodValue,
          date: date.toISOString().split('T')[0], // ISO date string
        });

        console.log(`Created mood check: ${moodData.moodValue}/5`);
      } catch (error) {
        console.log(`Error creating mood check:`, error);
      }
    }

    // Create some announcements
    const announcementsData = [
      {
        title: "New Feature: Enhanced Mood Tracking",
        content: "We've improved mood tracking to better understand your wellbeing patterns.",
        type: "update",
      },
      {
        title: "Reminder: Your Privacy Matters",
        content: "All mood checks are completely anonymous. Your data is never shared.",
        type: "info",
      },
    ];

    for (const announcementData of announcementsData) {
      try {
        await db.insert(moodAnnouncements).values({
          ...announcementData,
          isActive: true,
        });

        console.log(`Created announcement: ${announcementData.title}`);
      } catch (error) {
        console.log(`Error creating announcement:`, error);
      }
    }

    console.log("✓ Mood seeding completed");
    console.log(`- ${moodChecksData.length} mood checks created`);
    console.log(`- ${announcementsData.length} announcements created`);
  } catch (error) {
    console.error("Failed to seed mood data:", error);
    process.exit(1);
  }
}

seedMood().catch((error) => {
  console.error("Error seeding Mood data:", error);
  process.exit(1);
});
