import { PrismaClient, CardCondition } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    "postgresql://neondb_owner:npg_GcfX3tZzY4HC@ep-dawn-brook-a4496079-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Map folder names to proper set names
const setMappings: Record<string, string> = {
  "Base Set (BS)": "Base Set",
  "Base Set 2 (B2)": "Base Set 2",
  "Fossil (FO)": "Fossil",
  "Jungle (JU)": "Jungle",
  "Team Rocket (RO)": "Team Rocket",
};

// Rarity determination based on card number and name patterns
function determineRarity(
  cardNumber: number,
  name: string,
  set: string
): string {
  // Common cards (high numbers, basic Pokémon)
  if (cardNumber > 50) return "Common";

  // Energy cards
  if (name.includes("energy")) return "Common";

  // Trainer cards (usually high numbers in Base Set)
  if (
    name.includes("trainer") ||
    name.includes("professor") ||
    name.includes("breeder") ||
    name.includes("finder") ||
    name.includes("search") ||
    name.includes("maintenance") ||
    name.includes("pluspower") ||
    name.includes("potion") ||
    name.includes("switch") ||
    name.includes("center") ||
    name.includes("flute") ||
    name.includes("pokédex") ||
    name.includes("ball") ||
    name.includes("recall") ||
    name.includes("removal") ||
    name.includes("retrieval") ||
    name.includes("revive") ||
    name.includes("scoop") ||
    name.includes("devolution") ||
    name.includes("imposter") ||
    name.includes("lass") ||
    name.includes("computer") ||
    name.includes("defender") ||
    name.includes("double") ||
    name.includes("full") ||
    name.includes("gust") ||
    name.includes("heal") ||
    name.includes("item") ||
    name.includes("bill") ||
    name.includes("oak") ||
    name.includes("super") ||
    name.includes("doll") ||
    name.includes("gambler") ||
    name.includes("challenge") ||
    name.includes("digger") ||
    name.includes("goop") ||
    name.includes("imposter") ||
    name.includes("nightly") ||
    name.includes("sleep") ||
    name.includes("the boss") ||
    name.includes("rockets")
  )
    return "Uncommon";

  // Legendary Pokémon
  if (
    [
      "mewtwo",
      "mew",
      "articuno",
      "zapdos",
      "moltres",
      "dratini",
      "dragonite",
    ].includes(name)
  )
    return "Rare";

  // 1st Edition cards (usually rare)
  if (cardNumber <= 10) return "Rare";

  // Default to Uncommon for most others
  return "Uncommon";
}

// Price calculation based on rarity and condition
function calculatePrice(rarity: string, condition: CardCondition): number {
  const basePrices: Record<string, number> = {
    Common: 0.5,
    Uncommon: 1.5,
    Rare: 5.0,
  };

  const conditionMultipliers: Record<CardCondition, number> = {
    POOR: 0.3,
    PLAYED: 0.5,
    LIGHT_PLAYED: 0.7,
    GOOD: 0.8,
    EXCELLENT: 0.9,
    NEAR_MINT: 1.0,
    MINT: 1.2,
  };

  return (
    Math.round(
      (basePrices[rarity] || 1.0) * conditionMultipliers[condition] * 100
    ) / 100
  );
}

// Stock calculation (more stock for common cards, less for rare)
function calculateStock(rarity: string, condition: CardCondition): number {
  const baseStock: Record<string, number> = {
    Common: 50,
    Uncommon: 25,
    Rare: 10,
  };

  const conditionMultipliers: Record<CardCondition, number> = {
    POOR: 1.5,
    PLAYED: 1.3,
    LIGHT_PLAYED: 1.2,
    GOOD: 1.1,
    EXCELLENT: 1.0,
    NEAR_MINT: 0.8,
    MINT: 0.5,
  };

  return Math.floor(
    (baseStock[rarity] || 20) * conditionMultipliers[condition]
  );
}

async function main() {
  console.log("🌱 Starting comprehensive database seed...");

  const cardAssetsPath = path.join(process.cwd(), "public", "card-assets");
  const processedCards: string[] = [];

  // Process each set folder
  for (const [folderName, setName] of Object.entries(setMappings)) {
    const folderPath = path.join(cardAssetsPath, folderName);

    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folderPath}`);
      continue;
    }

    console.log(`📂 Processing ${setName}...`);

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".jpg"))
      .sort();

    for (const file of files) {
      try {
        // Parse filename: "43-abra.jpg" -> number: 43, name: "abra"
        const match = file.match(/^(\d+)-(.+)\.jpg$/);
        if (!match) {
          console.log(`⚠️  Skipping invalid filename: ${file}`);
          continue;
        }

        const [, cardNumberStr, cardName] = match;
        const cardNumber = parseInt(cardNumberStr);
        const name = cardName.replace(/-/g, " "); // Convert hyphens to spaces

        // Create unique ID
        const cardId = `${setName
          .toLowerCase()
          .replace(/\s+/g, "-")}-${cardNumber}-${cardName}`;

        // Skip if already processed
        if (processedCards.includes(cardId)) {
          continue;
        }
        processedCards.push(cardId);

        // Determine rarity
        const rarity = determineRarity(cardNumber, cardName, setName);

        // Create card record
        const card = await prisma.card.upsert({
          where: { id: cardId },
          update: {},
          create: {
            id: cardId,
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
            imageUrl: `/card-assets/${folderName}/${file}`,
            rarity,
            set: setName,
            cardNumber: `${cardNumber}/${files.length}`, // Approximate total cards in set
            description: `${rarity} ${name} from ${setName}`,
          },
        });

        // Create inventory variants for all conditions
        const conditions: CardCondition[] = [
          "MINT",
          "NEAR_MINT",
          "EXCELLENT",
          "GOOD",
          "LIGHT_PLAYED",
          "PLAYED",
          "POOR",
        ];

        for (const condition of conditions) {
          await prisma.cardInventory.upsert({
            where: {
              cardId_condition: {
                cardId: card.id,
                condition,
              },
            },
            update: {},
            create: {
              cardId: card.id,
              condition,
              price: calculatePrice(rarity, condition),
              quantity: calculateStock(rarity, condition),
            },
          });
        }

        console.log(
          `✅ Created ${card.name} (${rarity}) with ${conditions.length} condition variants`
        );
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log(
    `📊 Created ${processedCards.length} cards with inventory variants`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
