/**
 * Pokemon Card Set Data
 *
 * This module provides centralized data about available card sets,
 * including metadata and booster pack images for use across the application.
 */

export interface BoosterPack {
  name: string;
  image: string;
}

export interface CardSet {
  id: string;
  name: string;
  shortCode: string;
  folderName: string;
  description: string;
  releaseYear: number;
  totalCards: number;
  boosterPacks: BoosterPack[];
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

/**
 * All available Pokemon card sets with their metadata and booster pack images
 */
export const cardSets: CardSet[] = [
  {
    id: "base-set",
    name: "Base Set",
    shortCode: "BS",
    folderName: "Base Set (BS)",
    description: "The original Pokemon Trading Card Game set that started it all. Features iconic Pokemon like Charizard, Blastoise, and Venusaur.",
    releaseYear: 1999,
    totalCards: 102,
    accentColor: "#FFFFFF",
    gradientFrom: "#5a87a8",
    gradientTo: "#232646",
    boosterPacks: [
      { name: "Charizard Pack", image: "/pack-assets/Base Set (BS)/Base_Set_Booster_Charizard_Shadowless.webp" },
      { name: "Blastoise Pack", image: "/pack-assets/Base Set (BS)/Base_Set_Booster_Blastoise_Shadowless.webp" },
      { name: "Venusaur Pack", image: "/pack-assets/Base Set (BS)/Base_Set_Booster_Venusaur_Shadowless.webp" },
    ],
  },
  {
    id: "jungle",
    name: "Jungle",
    shortCode: "JU",
    folderName: "Jungle (JU)",
    description: "Explore the wild side of Pokemon with jungle-dwelling creatures. Introduces powerful Eeveelutions and more.",
    releaseYear: 1999,
    totalCards: 64,
    accentColor: "#FFF",
    gradientFrom: "#6fa949",
    gradientTo: "#465c25",
    boosterPacks: [
      { name: "Flareon Pack", image: "/pack-assets/Jungle (JU)/Jungle_Booster_Flareon.webp" },
      { name: "Scyther Pack", image: "/pack-assets/Jungle (JU)/Jungle_Booster_Scyther.webp" },
      { name: "Wigglytuff Pack", image: "/pack-assets/Jungle (JU)/Jungle_Booster_Wigglytuff.webp" },
    ],
  },
  {
    id: "fossil",
    name: "Fossil",
    shortCode: "FO",
    folderName: "Fossil (FO)",
    description: "Unearth prehistoric Pokemon and legendary birds. Features ancient creatures revived from fossils.",
    releaseYear: 1999,
    totalCards: 62,
    accentColor: "#8D6E63",
    gradientFrom: "#B79891",
    gradientTo: "#94716B",
    boosterPacks: [
      { name: "Aerodactyl Pack", image: "/pack-assets/Fossil (FO)/Fossil_Booster_Aerodactyl.webp" },
      { name: "Lapras Pack", image: "/pack-assets/Fossil (FO)/Fossil_Booster_Lapras.webp" },
      { name: "Zapdos Pack", image: "/pack-assets/Fossil (FO)/Fossil_Booster_Zapdos.webp" },
    ],
  },
  {
    id: "base-set-2",
    name: "Base Set 2",
    shortCode: "B2",
    folderName: "Base Set 2 (B2)",
    description: "A reprint compilation featuring the best cards from Base Set and Jungle with updated artwork.",
    releaseYear: 2000,
    totalCards: 130,
    accentColor: "#1E88E5",
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
    boosterPacks: [
      { name: "Mewtwo Pack", image: "/pack-assets/Base Set 2 (B2)/Base_Set_2_Booster_Mewtwo.webp" },
      { name: "Gyarados Pack", image: "/pack-assets/Base Set 2 (B2)/Base_Set_2_Booster_Gyarados.webp" },
      { name: "Pidgeot Pack", image: "/pack-assets/Base Set 2 (B2)/Base_Set_2_Booster_Pidgeot.webp" },
      { name: "Raichu Pack", image: "/pack-assets/Base Set 2 (B2)/Base_Set_2_Booster_Raichu.webp" },
    ],
  },
  {
    id: "team-rocket",
    name: "Team Rocket",
    shortCode: "RO",
    folderName: "Team Rocket (RO)",
    description: "Enter the dark side with Team Rocket's sinister Pokemon. Features Dark Pokemon variants and villainous trainers.",
    releaseYear: 2000,
    totalCards: 83,
    accentColor: "#5E35B1",
    gradientFrom: "#434343",
    gradientTo: "#000000",
    boosterPacks: [
      { name: "Giovanni Pack", image: "/pack-assets/Team Rocket (RO)/Team_Rocket_Booster_Giovanni.webp" },
      { name: "Dark Gyarados Pack", image: "/pack-assets/Team Rocket (RO)/Team_Rocket_Booster_Gyarados.webp" },
      { name: "Jessie & James Pack", image: "/pack-assets/Team Rocket (RO)/Team_Rocket_Booster_Jessie_James.webp" },
      { name: "Team Rocket Pack", image: "/pack-assets/Team Rocket (RO)/Team_Rocket_Booster_Team_Rocket.webp" },
    ],
  },
];

/**
 * Get a specific set by its ID
 */
export function getSetById(id: string): CardSet | undefined {
  return cardSets.find((set) => set.id === id);
}

/**
 * Get a specific set by its name (case-insensitive)
 */
export function getSetByName(name: string): CardSet | undefined {
  return cardSets.find(
    (set) => set.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get a random booster pack image from a set
 */
export function getRandomBoosterPack(set: CardSet): BoosterPack {
  const randomIndex = Math.floor(Math.random() * set.boosterPacks.length);
  return set.boosterPacks[randomIndex];
}

/**
 * Get all booster pack images across all sets (flattened)
 */
export function getAllBoosterPacks(): (BoosterPack & { setName: string })[] {
  return cardSets.flatMap((set) =>
    set.boosterPacks.map((pack) => ({
      ...pack,
      setName: set.name,
    }))
  );
}
