
class ResearchNode {
    id: string;                // Unique identifier for the node
    name: string;              // Name of the research node
    cost: number;              // Cost to unlock the research
    dependencies: string[];    // Array of dependency node IDs
    unlocked: boolean;         // Flag indicating if the research is unlocked
    researchedCount: number;   // Number of times the research has been completed
    requiredMaterials: string[]; // Materials required for the research

    constructor(id: string, name: string, cost: number, dependencies: string[], requiredMaterials: string[]) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.dependencies = dependencies;
        this.unlocked = false;   // Initially, the node is locked
        this.researchedCount = 0; // Initialize research count to 0
        this.requiredMaterials = requiredMaterials; // Set required materials
    }

    // Unlock the node
    unlock() {
        this.unlocked = true;
    }

    // Mark the technology as researched
    research() {
        this.researchedCount++;
        this.unlock(); // Automatically unlock when researched
        console.log(`Research on '${this.name}' completed ${this.researchedCount} time(s).`);
    }
}

export class ResearchTree {
    nodes: Record<string, ResearchNode>; // Store all research nodes by ID
    currentMaterials: Set<string>; // Materials available to the player

    constructor() {
        this.nodes = {};
        this.currentMaterials = new Set(); // Initialize with no materials
    }

    // Add a research node to the tree
    addNode(node: ResearchNode) {
        this.nodes[node.id] = node;
    }

    // Set the current materials available to the player
    setCurrentMaterials(materials: string[]) {
        this.currentMaterials = new Set(materials);
    }

    // Get all available research nodes based on current unlocked nodes and materials
    getAvailableResearch(): ResearchNode[] {
        return Object.values(this.nodes).filter(node => {
            const dependenciesMet = node.dependencies.every(depId => {
                return this.nodes[depId]?.unlocked; // Check if dependencies are unlocked
            });

            const materialsMet = node.requiredMaterials.every(material => {
                return this.currentMaterials.has(material); // Check if required materials are available
            });

            return dependenciesMet && materialsMet && !node.unlocked; // Include only if not already unlocked
        });
    }

    // Research a specific node if available
    researchNode(nodeId: string): boolean {
        const node = this.nodes[nodeId];
        if (node) {
            const dependenciesMet = node.dependencies.every(depId => this.nodes[depId]?.unlocked);
            const materialsMet = node.requiredMaterials.every(material => this.currentMaterials.has(material));
            if (dependenciesMet && materialsMet) {
                node.research(); // Mark as researched
                return true;
            } else {
                if (!dependenciesMet) {
                    console.log(`Cannot research '${node.name}'. Dependencies not met.`);
                }
                if (!materialsMet) {
                    console.log(`Cannot research '${node.name}'. Required materials not available.`);
                }
            }
        } else {
            console.log("Node not found.");
        }
        return false;
    }

    // Print the research tree
    printTree(): void {
        console.log("Research Tree:");
        for (const node of Object.values(this.nodes)) {
            console.log(`- ${node.name} (Unlocked: ${node.unlocked}, Researched: ${node.researchedCount}, Required Materials: ${node.requiredMaterials.join(", ")})`);
        }
    }
}
