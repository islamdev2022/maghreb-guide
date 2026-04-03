export type Seasonality = "all" | "summer" | "winter" | "spring" | "autumn";
export type WeatherCondition = "indoor" | "outdoor" | "any";
export type BudgetLevel = "low" | "medium" | "high";
export type ExperienceCategory = "cultural" | "artisan" | "wellness" | "gastronomy" | "adventure";

export interface Experience {
    id: string;
    title: string;
    country: "Algeria" | "Morocco" | "Tunisia";
    city: string;
    category: ExperienceCategory;
    seasonality: Seasonality[];
    weatherCondition: WeatherCondition;
    priceLevel: BudgetLevel;
    priceAmount: number; // Stored in local currency equivalent roughly for UI
    currency: string;
    description: string;
    rating: number;
    imageUrl: string;
}

export interface Guide {
    id: string;
    name: string;
    country: "Algeria" | "Morocco" | "Tunisia";
    baseCity: string;
    specialties: string[];
    languages: string[];
    hourlyRate: number;
    currency: string;
    rating: number;
    reviews: number;
    availability: boolean;
    avatarUrl: string;
}

export interface TransportRoute {
    id: string;
    from: string;
    to: string;
    type: "train" | "bus" | "shared-taxi" | "flight";
    operator: string;
    estimatedDurationMins: number;
    priceAmt: number;
    currency: string;
    frequency: string; // e.g., "Every 2 hours", "Daily at 10:00"
}

export const mockExperiences: Experience[] = [
    {
        id: "exp-1", title: "Chouara Tannery Artisan Tour", country: "Morocco", city: "Fez", category: "artisan", seasonality: ["all", "spring", "autumn"], weatherCondition: "outdoor", priceLevel: "low", priceAmount: 50, currency: "MAD", description: "An immersive tour of the world's oldest leather tannery. Learn ancient natural dyeing techniques from local artisans.", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1549480164-9f893a74653a?q=80&w=800&auto=format"
    },
    {
        id: "exp-2", title: "Djanet Sahara Expedition", country: "Algeria", city: "Djanet", category: "adventure", seasonality: ["winter", "spring", "autumn"], weatherCondition: "outdoor", priceLevel: "high", priceAmount: 15000, currency: "DZD", description: "Multi-day 4x4 expedition through Tassili n'Ajjer National Park, camping under the stars and viewing prehistoric rock art.", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1542318040-3ee9c2c62c93?q=80&w=800&auto=format"
    },
    {
        id: "exp-3", title: "Authentic Medina Hammam", country: "Tunisia", city: "Tunis", category: "wellness", seasonality: ["all", "winter"], weatherCondition: "indoor", priceLevel: "medium", priceAmount: 85, currency: "TND", description: "Experience a traditional deep-cleansing scrub and massage in a 16th-century steam bathhouse nestled in the Medina.", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format"
    },
    {
        id: "exp-4", title: "La Pêcherie Seafood Feast", country: "Algeria", city: "Algiers", category: "gastronomy", seasonality: ["all", "summer"], weatherCondition: "any", priceLevel: "medium", priceAmount: 3500, currency: "DZD", description: "Indulge in the freshest Mediterranean catch at the historic port restaurants in Algiers bay with view of the Mediterranean.", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800&auto=format"
    },
    {
        id: "exp-5", title: "Chefchaouen Photography Walk", country: "Morocco", city: "Chefchaouen", category: "cultural", seasonality: ["spring", "summer", "autumn"], weatherCondition: "outdoor", priceLevel: "low", priceAmount: 100, currency: "MAD", description: "A guided walk through the 'Blue Pearl' of Morocco, finding the best angles and hidden alleys for stunning photos.", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format"
    },
    {
        id: "exp-6", title: "Carthage Ruins & Museum", country: "Tunisia", city: "Carthage", category: "cultural", seasonality: ["all", "spring", "autumn"], weatherCondition: "outdoor", priceLevel: "low", priceAmount: 12, currency: "TND", description: "Explore the ancient Phoenician and Roman ruins overlooking the beautiful blue waters of the Gulf of Tunis.", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format"
    },
    {
        id: "exp-7", title: "Suspension Bridges Tour", country: "Algeria", city: "Constantine", category: "adventure", seasonality: ["all"], weatherCondition: "outdoor", priceLevel: "low", priceAmount: 500, currency: "DZD", description: "Walk the dizzying suspended bridges crossing the deep Rhumel gorge in the 'City of Bridges'. Adrenaline pumping!", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1583488731388-662584144369?q=80&w=800&auto=format"
    },
    {
        id: "exp-8", title: "El Djem Colosseum Night Tour", country: "Tunisia", city: "El Djem", category: "cultural", seasonality: ["summer", "spring", "autumn"], weatherCondition: "outdoor", priceLevel: "medium", priceAmount: 30, currency: "TND", description: "Visit the massive Roman amphitheater of Thysdrus under atmospheric night lighting. One of the best preserved in the world.", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1605389617260-845116de0bfa?q=80&w=800&auto=format"
    },
    {
        id: "exp-9", title: "Majorelle Botanical Escape", country: "Morocco", city: "Marrakech", category: "wellness", seasonality: ["spring", "summer", "autumn"], weatherCondition: "outdoor", priceLevel: "medium", priceAmount: 150, currency: "MAD", description: "Find peace inside the vibrant blue botanical garden created by Jacques Majorelle and later owned by Yves Saint Laurent.", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1574620025946-b25752b0cfb0?q=80&w=800&auto=format"
    },
    {
        id: "exp-10", title: "Taghit Oasis Sunset Safari", country: "Algeria", city: "Taghit", category: "adventure", seasonality: ["winter", "spring", "autumn"], weatherCondition: "outdoor", priceLevel: "medium", priceAmount: 4000, currency: "DZD", description: "Ride dune buggies into the massive Grand Erg Occidental sand dunes as the sun sets over the ancient Taghit oasis.", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=800&auto=format"
    },
    {
        id: "exp-11", title: "Casbah Street Food Crawl", country: "Algeria", city: "Algiers", category: "gastronomy", seasonality: ["all"], weatherCondition: "any", priceLevel: "low", priceAmount: 1500, currency: "DZD", description: "Taste authentic Mahjouba, Bourek, and traditional mint tea while weaving through the steep, narrow alleys of the UNESCO Casbah.", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format"
    },
    {
        id: "exp-12", title: "Essaouira Surf Camp", country: "Morocco", city: "Essaouira", category: "adventure", seasonality: ["summer", "autumn"], weatherCondition: "outdoor", priceLevel: "high", priceAmount: 2500, currency: "MAD", description: "Catch the Atlantic waves with professional instructors in the breezy coastal town known for its relaxed vibes and sea winds.", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format"
    }
];

export const mockGuides: Guide[] = [
    { id: "g-1", name: "Tariq Benali", country: "Algeria", baseCity: "Ghardaïa", specialties: ["Desert Trekking", "M'zab Architecture", "Nomadic Culture"], languages: ["Arabic", "French", "English", "Tamazight"], hourlyRate: 2000, currency: "DZD", rating: 4.9, reviews: 142, availability: true, avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    { id: "g-2", name: "Fatima Zahra", country: "Morocco", baseCity: "Marrakech", specialties: ["Gastronomy", "Souk Navigation", "Artisanal Crafts"], languages: ["Arabic", "French", "English", "Spanish"], hourlyRate: 150, currency: "MAD", rating: 4.8, reviews: 320, availability: false, avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704b" },
    { id: "g-3", name: "Youssef Tarek", country: "Tunisia", baseCity: "Tunis", specialties: ["Roman History", "Islamic Architecture", "Medina Secrets"], languages: ["Arabic", "French", "Italian", "English"], hourlyRate: 40, currency: "TND", rating: 4.7, reviews: 89, availability: true, avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    { id: "g-4", name: "Amine Bouzid", country: "Algeria", baseCity: "Algiers", specialties: ["Casbah History", "Photography", "Revolutionary Tour"], languages: ["Arabic", "French", "English"], hourlyRate: 1500, currency: "DZD", rating: 4.6, reviews: 201, availability: true, avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
    { id: "g-5", name: "Nadia Amrani", country: "Morocco", baseCity: "Fez", specialties: ["Textiles & Leather", "Andalusian Music", "Fez Cuisine"], languages: ["Arabic", "French", "Spanish"], hourlyRate: 200, currency: "MAD", rating: 4.9, reviews: 412, availability: true, avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704a" },
    { id: "g-6", name: "Karim Mansour", country: "Tunisia", baseCity: "Djerba", specialties: ["Island Jewish History", "Pottery Making", "Coastal Sailing"], languages: ["Arabic", "French", "German"], hourlyRate: 50, currency: "TND", rating: 4.5, reviews: 110, availability: false, avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704c" }
];

export const mockTransport: TransportRoute[] = [
    { id: "tr-1", from: "Algiers", to: "Oran", type: "train", operator: "SNTF Coradia", estimatedDurationMins: 240, priceAmt: 2000, currency: "DZD", frequency: "Daily 08:00, 10:00, 15:00" },
    { id: "tr-2", from: "Casablanca", to: "Tangier", type: "train", operator: "Al Boraq High Speed", estimatedDurationMins: 130, priceAmt: 149, currency: "MAD", frequency: "Every 2 hours" },
    { id: "tr-3", from: "Tunis", to: "Sousse", type: "shared-taxi", operator: "Louage Network", estimatedDurationMins: 120, priceAmt: 12, currency: "TND", frequency: "Fills organically, ~every 30 mins" },
    { id: "tr-4", from: "Marrakech", to: "Chefchaouen", type: "bus", operator: "CTM", estimatedDurationMins: 540, priceAmt: 250, currency: "MAD", frequency: "Daily at 20:30 (Overnight)" },
    { id: "tr-5", from: "Algiers", to: "Constantine", type: "flight", operator: "Air Algérie", estimatedDurationMins: 55, priceAmt: 4500, currency: "DZD", frequency: "4 flights daily" },
    { id: "tr-6", from: "Fez", to: "Marrakech", type: "train", operator: "ONCF", estimatedDurationMins: 390, priceAmt: 216, currency: "MAD", frequency: "Every 4 hours" },
    { id: "tr-7", from: "Djerba", to: "Tunis", type: "flight", operator: "Tunisair Express", estimatedDurationMins: 60, priceAmt: 140, currency: "TND", frequency: "3 flights daily" },
    { id: "tr-8", from: "Oran", to: "Tlemcen", type: "shared-taxi", operator: "Klandestan Auto", estimatedDurationMins: 105, priceAmt: 600, currency: "DZD", frequency: "On demand at taxi station" },
];
