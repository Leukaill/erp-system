import { db } from "./db";
import { 
  users, 
  projects, 
  inventory, 
  transactions, 
  activities, 
  tasks, 
  farmSectors 
} from "@shared/schema";
import { hashPassword } from "./localAuth";

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random amounts
const randomAmount = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");
  
  try {
    // Clear existing data
    await db.delete(activities);
    await db.delete(tasks);
    await db.delete(transactions);
    await db.delete(inventory);
    await db.delete(farmSectors);
    await db.delete(projects);
    await db.delete(users);
    
    console.log("✅ Cleared existing data");

    // Create demo users
    const demoUsers = [
      {
        id: "user-001",
        email: "manager@agriflow.rw",
        password: await hashPassword("password123"),
        firstName: "Jean Claude",
        lastName: "Uwimana",
        profileImageUrl: "",
        role: "farm_manager"
      },
      {
        id: "user-002", 
        email: "supervisor@agriflow.rw",
        password: await hashPassword("password123"),
        firstName: "Marie",
        lastName: "Mukamana",
        profileImageUrl: "",
        role: "supervisor"
      }
    ];

    await db.insert(users).values(demoUsers);
    console.log("✅ Created demo users");

    // Create farm sectors
    const sectors = [
      {
        name: "North Valley",
        area: 15.5,
        soilType: "Clay loam",
        irrigationSystem: "Drip irrigation",
        currentProjectId: null,
        lastTested: new Date("2024-06-15"),
        phLevel: 6.8,
        notes: "Highly fertile area with excellent drainage"
      },
      {
        name: "South Hills",
        area: 22.3,
        soilType: "Sandy loam", 
        irrigationSystem: "Sprinkler",
        currentProjectId: null,
        lastTested: new Date("2024-06-20"),
        phLevel: 7.1,
        notes: "Slightly elevated terrain, good for coffee cultivation"
      },
      {
        name: "East Fields",
        area: 18.7,
        soilType: "Silty clay",
        irrigationSystem: "Rain-fed",
        currentProjectId: null,
        lastTested: new Date("2024-07-01"),
        phLevel: 6.5,
        notes: "Natural rainfall area, suitable for maize and beans"
      },
      {
        name: "West Plateau",
        area: 12.4,
        soilType: "Red soil",
        irrigationSystem: "Furrow irrigation",
        currentProjectId: null,
        lastTested: new Date("2024-06-25"),
        phLevel: 6.9,
        notes: "Traditional farming area with rich volcanic soil"
      }
    ];

    const insertedSectors = await db.insert(farmSectors).values(sectors).returning();
    console.log("✅ Created farm sectors");

    // Create comprehensive projects
    const projectsData = [
      {
        name: "Premium Coffee Arabica 2024",
        description: "High-quality arabica coffee cultivation focusing on specialty grade beans for export markets. Implementing sustainable farming practices and organic certification.",
        type: "coffee",
        location: "South Hills - 8.5 hectares",
        status: "active",
        progress: 75,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-12-31"),
        budget: "2850000.00", // 2.85M RWF
        spent: "2137500.00",   // 2.14M RWF
        managerId: "user-001",
        imageUrl: ""
      },
      {
        name: "Maize Season A 2024",
        description: "Large-scale maize production using hybrid seeds and modern farming techniques. Target yield: 6 tons per hectare with drought-resistant varieties.",
        type: "maize", 
        location: "East Fields - 12 hectares",
        status: "completed",
        progress: 100,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-30"),
        budget: "1680000.00", // 1.68M RWF
        spent: "1598400.00",  // 1.60M RWF
        managerId: "user-001",
        imageUrl: ""
      },
      {
        name: "Organic Beans Cultivation",
        description: "Organic climbing beans production with companion planting techniques. Focus on soil health improvement and natural pest management.",
        type: "beans",
        location: "North Valley - 5 hectares", 
        status: "active",
        progress: 60,
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-09-30"),
        budget: "950000.00",  // 950K RWF
        spent: "570000.00",   // 570K RWF
        managerId: "user-002",
        imageUrl: ""
      },
      {
        name: "Vegetable Greenhouse Complex",
        description: "Modern greenhouse facility for year-round vegetable production including tomatoes, peppers, and cucumbers. Climate-controlled environment with hydroponic systems.",
        type: "vegetables",
        location: "West Plateau - 2 hectares",
        status: "planning",
        progress: 15,
        startDate: new Date("2024-08-01"),
        endDate: new Date("2025-03-31"),
        budget: "4200000.00", // 4.2M RWF
        spent: "630000.00",   // 630K RWF
        managerId: "user-001", 
        imageUrl: ""
      },
      {
        name: "Fruit Orchard Development",
        description: "Establishment of mixed fruit orchard with avocados, mangoes, and citrus fruits. Long-term investment project with 5-year maturation period.",
        type: "fruits",
        location: "South Hills - 6 hectares",
        status: "active",
        progress: 35,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2026-12-31"),
        budget: "3500000.00", // 3.5M RWF
        spent: "1225000.00",  // 1.23M RWF
        managerId: "user-001",
        imageUrl: ""
      },
      {
        name: "Livestock Integration Program",
        description: "Integrated farming system combining dairy cows with crop production. Focus on sustainable manure management and pasture rotation.",
        type: "livestock",
        location: "North Valley - 8 hectares",
        status: "active", 
        progress: 80,
        startDate: new Date("2023-11-01"),
        endDate: new Date("2024-10-31"),
        budget: "5600000.00", // 5.6M RWF
        spent: "4480000.00",  // 4.48M RWF
        managerId: "user-002",
        imageUrl: ""
      },
      {
        name: "Sweet Potato Commercial Production",
        description: "Large-scale sweet potato cultivation using improved varieties. Target market: local processing companies and export opportunities.",
        type: "tubers",
        location: "East Fields - 10 hectares",
        status: "planning",
        progress: 25,
        startDate: new Date("2024-09-01"),
        endDate: new Date("2025-02-28"),
        budget: "1400000.00", // 1.4M RWF
        spent: "350000.00",   // 350K RWF
        managerId: "user-001",
        imageUrl: ""
      },
      {
        name: "Mushroom Production Unit",
        description: "Indoor mushroom cultivation facility producing oyster and shiitake mushrooms. Year-round production with controlled environment systems.",
        type: "mushrooms",
        location: "West Plateau - 0.5 hectares",
        status: "active",
        progress: 90,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        budget: "2100000.00", // 2.1M RWF
        spent: "1890000.00",  // 1.89M RWF
        managerId: "user-002",
        imageUrl: ""
      }
    ];

    const insertedProjects = await db.insert(projects).values(projectsData).returning();
    console.log("✅ Created projects");

    // Create comprehensive inventory
    const inventoryData = [
      // Seeds
      { name: "Arabica Coffee Seeds - Premium", category: "seeds", currentStock: "125.00", minStock: "50.00", unit: "kg", unitPrice: "8500.00" },
      { name: "Hybrid Maize Seeds (SC719)", category: "seeds", currentStock: "45.00", minStock: "20.00", unit: "kg", unitPrice: "12000.00" },
      { name: "Climbing Bean Seeds - Rwamagana", category: "seeds", currentStock: "78.00", minStock: "30.00", unit: "kg", unitPrice: "4500.00" },
      { name: "Tomato Seeds - Improved Variety", category: "seeds", currentStock: "12.00", minStock: "15.00", unit: "kg", unitPrice: "25000.00" },
      { name: "Sweet Potato Vines", category: "seeds", currentStock: "2500.00", minStock: "1000.00", unit: "pieces", unitPrice: "150.00" },
      
      // Fertilizers
      { name: "NPK 17-17-17 Fertilizer", category: "fertilizers", currentStock: "850.00", minStock: "200.00", unit: "kg", unitPrice: "1200.00" },
      { name: "Organic Compost", category: "fertilizers", currentStock: "2400.00", minStock: "500.00", unit: "kg", unitPrice: "450.00" },
      { name: "Urea Fertilizer (46% N)", category: "fertilizers", currentStock: "320.00", minStock: "100.00", unit: "kg", unitPrice: "1800.00" },
      { name: "DAP Fertilizer", category: "fertilizers", currentStock: "180.00", minStock: "80.00", unit: "kg", unitPrice: "2100.00" },
      { name: "Potassium Sulfate", category: "fertilizers", currentStock: "65.00", minStock: "30.00", unit: "kg", unitPrice: "2800.00" },
      
      // Pesticides
      { name: "Organic Neem Oil", category: "pesticides", currentStock: "45.00", minStock: "20.00", unit: "liters", unitPrice: "3500.00" },
      { name: "Copper Fungicide", category: "pesticides", currentStock: "28.00", minStock: "15.00", unit: "liters", unitPrice: "4200.00" },
      { name: "Biological Pest Control Agent", category: "pesticides", currentStock: "35.00", minStock: "10.00", unit: "liters", unitPrice: "5800.00" },
      { name: "Herbicide - Glyphosate", category: "pesticides", currentStock: "22.00", minStock: "12.00", unit: "liters", unitPrice: "3200.00" },
      
      // Equipment
      { name: "Drip Irrigation Kit - 1 hectare", category: "equipment", currentStock: "8.00", minStock: "3.00", unit: "sets", unitPrice: "180000.00" },
      { name: "Hand Cultivators", category: "equipment", currentStock: "15.00", minStock: "8.00", unit: "pieces", unitPrice: "8500.00" },
      { name: "Pruning Shears - Professional", category: "equipment", currentStock: "25.00", minStock: "10.00", unit: "pieces", unitPrice: "4500.00" },
      { name: "Wheelbarrows - Heavy Duty", category: "equipment", currentStock: "6.00", minStock: "4.00", unit: "pieces", unitPrice: "35000.00" },
      { name: "Soil pH Meter", category: "equipment", currentStock: "3.00", minStock: "2.00", unit: "pieces", unitPrice: "85000.00" },
      { name: "Water Pumps - Solar Powered", category: "equipment", currentStock: "2.00", minStock: "1.00", unit: "pieces", unitPrice: "450000.00" },
      
      // Tools
      { name: "Hoes - Traditional", category: "tools", currentStock: "35.00", minStock: "15.00", unit: "pieces", unitPrice: "2500.00" },
      { name: "Machetes - Forged Steel", category: "tools", currentStock: "28.00", minStock: "12.00", unit: "pieces", unitPrice: "3200.00" },
      { name: "Spades - Heavy Duty", category: "tools", currentStock: "18.00", minStock: "8.00", unit: "pieces", unitPrice: "4800.00" },
      { name: "Harvesting Baskets", category: "tools", currentStock: "45.00", minStock: "20.00", unit: "pieces", unitPrice: "1800.00" },
      
      // Livestock supplies
      { name: "Dairy Cow Feed - Premium", category: "livestock", currentStock: "1250.00", minStock: "500.00", unit: "kg", unitPrice: "650.00" },
      { name: "Mineral Supplements for Cattle", category: "livestock", currentStock: "180.00", minStock: "50.00", unit: "kg", unitPrice: "2200.00" },
      { name: "Veterinary Medicine Kit", category: "livestock", currentStock: "5.00", minStock: "2.00", unit: "sets", unitPrice: "125000.00" },
      
      // Processing materials
      { name: "Coffee Drying Beds - Mesh", category: "processing", currentStock: "12.00", minStock: "5.00", unit: "pieces", unitPrice: "65000.00" },
      { name: "Storage Bags - Jute", category: "processing", currentStock: "200.00", minStock: "80.00", unit: "pieces", unitPrice: "2800.00" },
      { name: "Weighing Scales - Digital", category: "processing", currentStock: "4.00", minStock: "2.00", unit: "pieces", unitPrice: "85000.00" }
    ];

    await db.insert(inventory).values(inventoryData);
    console.log("✅ Created inventory items");

    // Create comprehensive financial transactions
    const transactionsData = [];
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-07-31");

    // Income transactions
    const incomeTransactions = [
      { type: "income", amount: "4500000.00", description: "Coffee beans sale - Premium grade", category: "sales", currency: "RWF", projectId: insertedProjects[0].id },
      { type: "income", amount: "2800000.00", description: "Maize harvest sale - Local market", category: "sales", currency: "RWF", projectId: insertedProjects[1].id },
      { type: "income", amount: "1250000.00", description: "Organic beans - Export order", category: "sales", currency: "RWF", projectId: insertedProjects[2].id },
      { type: "income", amount: "850000.00", description: "Dairy products - Monthly sales", category: "sales", currency: "RWF", projectId: insertedProjects[5].id },
      { type: "income", amount: "650000.00", description: "Mushroom sales - Restaurants", category: "sales", currency: "RWF", projectId: insertedProjects[7].id },
      { type: "income", amount: "380000.00", description: "Vegetable sales - Farmers market", category: "sales", currency: "RWF", projectId: insertedProjects[3].id },
      { type: "income", amount: "920000.00", description: "Government subsidy - Organic farming", category: "grants", currency: "RWF", projectId: null },
      { type: "income", amount: "1500000.00", description: "Bank loan - Equipment purchase", category: "financing", currency: "RWF", projectId: null },
      { type: "income", amount: "750000.00", description: "Fruit tree saplings sale", category: "sales", currency: "RWF", projectId: insertedProjects[4].id },
      { type: "income", amount: "2200000.00", description: "Coffee premium - Quality bonus", category: "sales", currency: "RWF", projectId: insertedProjects[0].id }
    ];

    // Expense transactions
    const expenseTransactions = [
      { type: "expense", amount: "850000.00", description: "Seeds and planting materials", category: "inputs", currency: "RWF", projectId: insertedProjects[0].id },
      { type: "expense", amount: "420000.00", description: "Fertilizers - NPK and organic", category: "inputs", currency: "RWF", projectId: insertedProjects[1].id },
      { type: "expense", amount: "180000.00", description: "Pesticides and herbicides", category: "inputs", currency: "RWF", projectId: insertedProjects[2].id },
      { type: "expense", amount: "650000.00", description: "Labor - Harvesting season", category: "labor", currency: "RWF", projectId: insertedProjects[1].id },
      { type: "expense", amount: "320000.00", description: "Equipment maintenance", category: "maintenance", currency: "RWF", projectId: null },
      { type: "expense", amount: "450000.00", description: "Irrigation system upgrade", category: "infrastructure", currency: "RWF", projectId: insertedProjects[3].id },
      { type: "expense", amount: "280000.00", description: "Transportation - Market delivery", category: "logistics", currency: "RWF", projectId: null },
      { type: "expense", amount: "380000.00", description: "Veterinary services", category: "livestock_care", currency: "RWF", projectId: insertedProjects[5].id },
      { type: "expense", amount: "120000.00", description: "Fuel and utilities", category: "utilities", currency: "RWF", projectId: null },
      { type: "expense", amount: "95000.00", description: "Insurance - Crop protection", category: "insurance", currency: "RWF", projectId: null },
      { type: "expense", amount: "220000.00", description: "Processing equipment", category: "equipment", currency: "RWF", projectId: insertedProjects[7].id },
      { type: "expense", amount: "150000.00", description: "Soil testing and analysis", category: "consulting", currency: "RWF", projectId: null },
      { type: "expense", amount: "75000.00", description: "Training and certification", category: "education", currency: "RWF", projectId: null },
      { type: "expense", amount: "340000.00", description: "Storage facility rent", category: "rent", currency: "RWF", projectId: null },
      { type: "expense", amount: "180000.00", description: "Marketing and packaging", category: "marketing", currency: "RWF", projectId: insertedProjects[0].id }
    ];

    // Combine and add random dates
    [...incomeTransactions, ...expenseTransactions].forEach(transaction => {
      transactionsData.push({
        ...transaction,
        date: randomDate(startDate, endDate),
        userId: Math.random() > 0.5 ? "user-001" : "user-002"
      });
    });

    await db.insert(transactions).values(transactionsData);
    console.log("✅ Created financial transactions");

    // Create tasks
    const tasksData = [
      {
        title: "Harvest coffee cherries - North section",
        description: "Selective picking of ripe coffee cherries in the northern section of the plantation. Focus on red cherries only.",
        status: "in_progress",
        priority: "high",
        dueDate: new Date("2024-07-25"),
        assignedTo: "user-001",
        projectId: insertedProjects[0].id,
        estimatedHours: 8,
        completedAt: null
      },
      {
        title: "Apply organic fertilizer to bean plots",
        description: "Distribute compost and organic fertilizer around climbing bean plants. Water thoroughly after application.",
        status: "pending",
        priority: "medium", 
        dueDate: new Date("2024-07-26"),
        assignedTo: "user-002",
        projectId: insertedProjects[2].id,
        estimatedHours: 4,
        completedAt: null
      },
      {
        title: "Inspect greenhouse ventilation system",
        description: "Check all fans, vents, and climate control systems in the vegetable greenhouse. Replace any damaged components.",
        status: "pending",
        priority: "high",
        dueDate: new Date("2024-07-24"),
        assignedTo: "user-001",
        projectId: insertedProjects[3].id,
        estimatedHours: 3,
        completedAt: null
      },
      {
        title: "Prune fruit tree saplings",
        description: "Formative pruning of young avocado and mango trees. Remove competing leaders and shape the canopy.",
        status: "completed",
        priority: "medium",
        dueDate: new Date("2024-07-20"),
        assignedTo: "user-002",
        projectId: insertedProjects[4].id,
        estimatedHours: 6,
        completedAt: new Date("2024-07-20")
      },
      {
        title: "Clean and maintain milking equipment",
        description: "Daily cleaning and sanitization of milking machines and storage tanks. Check for any leaks or malfunctions.",
        status: "completed",
        priority: "high",
        dueDate: new Date("2024-07-23"),
        assignedTo: "user-001",
        projectId: insertedProjects[5].id,
        estimatedHours: 2,
        completedAt: new Date("2024-07-23")
      },
      {
        title: "Harvest mushrooms - Oyster variety",
        description: "Harvest mature oyster mushrooms from growing beds 3-5. Package immediately for market delivery.",
        status: "in_progress",
        priority: "high",
        dueDate: new Date("2024-07-24"),
        assignedTo: "user-002",
        projectId: insertedProjects[7].id,
        estimatedHours: 3,
        completedAt: null
      },
      {
        title: "Soil preparation for sweet potato planting",
        description: "Till and prepare 5 hectares for sweet potato vines. Create ridges and apply base fertilizer.",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-08-01"),
        assignedTo: "user-001",
        projectId: insertedProjects[6].id,
        estimatedHours: 12,
        completedAt: null
      },
      {
        title: "Inventory check - Seeds and fertilizers",
        description: "Conduct monthly inventory count of all seeds, fertilizers, and pesticides. Update stock levels in system.",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-07-28"),
        assignedTo: "user-002",
        projectId: null,
        estimatedHours: 4,
        completedAt: null
      }
    ];

    await db.insert(tasks).values(tasksData);
    console.log("✅ Created tasks");

    // Create activities
    const activitiesData = [
      {
        type: "project_update",
        title: "Coffee harvest completed - 85% yield achieved",
        description: "Successfully completed the first phase of coffee harvesting with excellent quality cherries",
        entityType: "project",
        entityId: insertedProjects[0].id,
        userId: "user-001",
        priority: "medium"
      },
      {
        type: "financial",
        title: "Major sale: Premium coffee beans - 4,500,000 RWF",
        description: "Sold premium grade coffee beans to export company with quality bonus",
        entityType: "transaction",
        entityId: 1,
        userId: "user-001",
        priority: "high"
      },
      {
        type: "inventory_alert",
        title: "Low stock alert: Tomato seeds below minimum",
        description: "Tomato seeds stock (12 kg) is below minimum threshold (15 kg)",
        entityType: "inventory",
        entityId: 4,
        userId: "user-002",
        priority: "medium"
      },
      {
        type: "task_completion",
        title: "Task completed: Fruit tree pruning",
        description: "Successfully completed formative pruning of 150 fruit tree saplings",
        entityType: "task",
        entityId: 4,
        userId: "user-002",
        priority: "low"
      },
      {
        type: "system",
        title: "New irrigation system installed",
        description: "Upgraded drip irrigation system in greenhouse complex - 30% water efficiency improvement",
        entityType: "project",
        entityId: insertedProjects[3].id,
        userId: "user-001",
        priority: "medium"
      },
      {
        type: "livestock",
        title: "Dairy production milestone: 500L daily",
        description: "Achieved new daily milk production record of 500 liters",
        entityType: "project",
        entityId: insertedProjects[5].id,
        userId: "user-001",
        priority: "high"
      },
      {
        type: "quality_control",
        title: "Organic certification renewed",
        description: "Successfully renewed organic farming certification for 3 more years",
        entityType: "project",
        entityId: insertedProjects[2].id,
        userId: "user-002",
        priority: "high"
      }
    ];

    await db.insert(activities).values(activitiesData);
    console.log("✅ Created activities");

    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Demo data created:");
    console.log(`   • ${demoUsers.length} users`);
    console.log(`   • ${insertedSectors.length} farm sectors`);
    console.log(`   • ${insertedProjects.length} projects`);
    console.log(`   • ${inventoryData.length} inventory items`);
    console.log(`   • ${transactionsData.length} transactions`);
    console.log(`   • ${tasksData.length} tasks`);
    console.log(`   • ${activitiesData.length} activities`);
    console.log("");
    console.log("🔐 Demo login credentials:");
    console.log("   Email: manager@agriflow.rw");
    console.log("   Password: password123");
    console.log("");
    console.log("   Email: supervisor@agriflow.rw");
    console.log("   Password: password123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}