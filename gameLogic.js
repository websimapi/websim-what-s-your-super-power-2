export class SuperpowerGame {
    constructor(room) {
        this.room = room;
        this.currentUser = null;
        this.generationInProgress = false;
    }

    async initialize() {
        this.currentUser = await window.websim.getCurrentUser();
        await this.ensureUserExists();
        this.startEvolutionCycle();
    }

    async ensureUserExists() {
        const existingUser = await this.room.collection('users')
            .filter({ id: this.currentUser.id })
            .getList();

        if (existingUser.length === 0) {
            // New user - queue them for avatar generation
            await this.room.collection('generation_queue').create({
                status: 'pending',
                generation_type: 'user_creation',
                target_user_id: this.currentUser.id
            });
        }
    }

    async generateDatapoints() {
        if (this.generationInProgress) return;
        this.generationInProgress = true;

        try {
            // Use AI to generate new datapoint types and values
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a cosmic force generating mystical datapoints for a superpower evolution game. 
                        Create unique datapoint types that represent abstract concepts like energy, wisdom, chaos, harmony, etc.
                        Each datapoint should have a meaningful value and interesting properties.
                        
                        Respond with JSON only:
                        {
                            "datapoints": [
                                {
                                    "type": "energy_type_name",
                                    "value": numeric_value,
                                    "rarity": "common|rare|epic|legendary",
                                    "metadata": {
                                        "description": "mystical description",
                                        "source": "where this energy comes from",
                                        "effect": "what visual effect it creates"
                                    }
                                }
                            ]
                        }`
                    },
                    {
                        role: "user",
                        content: "Generate 3-5 new mystical datapoints for the cosmic database"
                    }
                ],
                json: true
            });

            const result = JSON.parse(completion.content);
            
            // Store generated datapoints in database
            for (const datapoint of result.datapoints) {
                await this.room.collection('datapoints').create({
                    type: datapoint.type,
                    value: datapoint.value,
                    rarity: datapoint.rarity,
                    metadata: datapoint.metadata
                });
            }

            console.log(`Generated ${result.datapoints.length} new datapoints`);
        } catch (error) {
            console.error('Error generating datapoints:', error);
        } finally {
            this.generationInProgress = false;
        }
    }

    async createUserAvatar(superpowerDescription) {
        try {
            const imageResult = await websim.imageGen({
                prompt: `A mystical cosmic being representing: ${superpowerDescription}. 
                Ethereal, glowing, powerful, fantasy art style, magical aura, 
                centered portrait, cosmic background`,
                aspect_ratio: "1:1"
            });

            await this.room.collection('users').upsert({
                id: this.currentUser.id,
                base_image_url: imageResult.url,
                superpower_description: superpowerDescription,
                evolution_level: 1
            });

            return imageResult.url;
        } catch (error) {
            console.error('Error creating avatar:', error);
            throw error;
        }
    }

    async assignRandomDatapoint() {
        try {
            // Get all available datapoints
            const allDatapoints = await this.room.collection('datapoints').getList();
            if (allDatapoints.length === 0) return null;

            // Get user's existing datapoints
            const userDatapoints = await this.room.collection('user_datapoints')
                .filter({ id: this.currentUser.id })
                .getList();

            const userDatapointIds = new Set(userDatapoints.map(ud => ud.datapoint_id));
            
            // Filter to datapoints user doesn't have
            const availableDatapoints = allDatapoints.filter(dp => !userDatapointIds.has(dp.id));
            
            if (availableDatapoints.length === 0) {
                // Generate more datapoints if none available
                await this.generateDatapoints();
                return null;
            }

            // Randomly select a datapoint (weighted by rarity)
            const rarityWeights = { common: 0.5, rare: 0.3, epic: 0.15, legendary: 0.05 };
            const randomValue = Math.random();
            let cumulativeWeight = 0;
            
            const sortedByRarity = availableDatapoints.sort((a, b) => {
                const aWeight = rarityWeights[a.rarity] || 0.5;
                const bWeight = rarityWeights[b.rarity] || 0.5;
                return bWeight - aWeight;
            });

            const selectedDatapoint = sortedByRarity[0]; // For now, just take the first

            // Assign to user
            await this.room.collection('user_datapoints').create({
                id: `${this.currentUser.id}-${selectedDatapoint.id}`,
                datapoint_id: selectedDatapoint.id,
                visual_intensity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
                acquired_at: new Date().toISOString()
            });

            return selectedDatapoint;
        } catch (error) {
            console.error('Error assigning datapoint:', error);
            return null;
        }
    }

    startEvolutionCycle() {
        // Generate datapoints periodically
        setInterval(() => {
            this.generateDatapoints();
        }, 30000); // Every 30 seconds

        // Assign datapoints to users periodically
        setInterval(() => {
            this.assignRandomDatapoint();
        }, 45000); // Every 45 seconds
    }

    calculateEvolutionLevel(userDatapoints) {
        const totalPower = userDatapoints.reduce((sum, ud, datapoint) => {
            return sum + (datapoint?.value || 0) * ud.visual_intensity;
        }, 0);

        return Math.floor(totalPower / 100) + 1;
    }
}

window.SuperpowerGame = SuperpowerGame;

