const { VectorDatabase } = require('../utils/vector-db');
const { addSchoolData } = require('./add-school-data');

async function setupVectorDatabase() {
    console.log('🚀 Setting up vector database for DoveBot...');
    
    try {
        // Initialize vector database
        const vectorDB = new VectorDatabase();
        
        // Wait for connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get school data
        const schoolData = [
            {
                title: 'School Term Dates 2024-2025',
                content: `Autumn Term 2024:
- Start: Monday 2nd September 2024
- Half Term: Monday 28th October - Friday 1st November 2024
- End: Friday 20th December 2024

Spring Term 2025:
- Start: Monday 6th January 2025
- Half Term: Monday 17th February - Friday 21st February 2025
- End: Friday 4th April 2025

Summer Term 2025:
- Start: Monday 21st April 2025
- Half Term: Monday 26th May - Friday 30th May 2025
- End: Friday 18th July 2025

INSET Days (School closed to pupils):
- Monday 2nd September 2024
- Friday 20th December 2024
- Monday 6th January 2025
- Friday 4th April 2025
- Monday 21st April 2025`,
                category: 'calendar',
                source_url: 'https://www.dovedaleprimary.co.uk',
                checksum: 'term-dates-2024-2025'
            },
            {
                title: 'School Meals and Lunch Information',
                content: `School Meals:
- Hot meals provided daily by school kitchen
- Cost: £2.40 per meal for Key Stage 2 pupils
- Free school meals available for eligible families
- Weekly menu rotates every 3 weeks

Current Week's Menu:
Monday: Roast chicken with potatoes and vegetables
Tuesday: Pasta bolognese with garlic bread
Wednesday: Fish fingers with chips and peas
Thursday: Shepherd's pie with vegetables
Friday: Pizza with salad

Special Dietary Requirements:
- Vegetarian options available daily
- Allergies and special diets accommodated
- Contact the office to discuss requirements
- Halal options available

Packed Lunches:
- Children can bring packed lunches
- No nuts or nut products allowed
- Healthy eating encouraged
- Water bottles provided by school

Snacks:
- Fruit provided daily for all children
- Milk available for younger children`,
                category: 'meals',
                source_url: 'https://www.dovedaleprimary.co.uk',
                checksum: 'school-meals-lunch'
            },
            {
                title: 'School Uniform Policy',
                content: `School Uniform Requirements:

Boys:
- Grey trousers or shorts
- White polo shirt or white shirt
- School jumper (navy blue with school logo)
- Black shoes (no trainers)
- Grey socks

Girls:
- Grey skirt, pinafore, or trousers
- White polo shirt or white blouse
- School jumper (navy blue with school logo)
- Black shoes (no trainers)
- Grey socks or tights

PE Kit:
- White t-shirt
- Black shorts
- Black pumps or trainers
- School tracksuit (optional for winter)

All uniform items available from:
- School office
- Local uniform suppliers
- Online suppliers

Second-hand uniform available through PTA`,
                category: 'uniform',
                source_url: 'https://www.dovedaleprimary.co.uk',
                checksum: 'uniform-policy'
            },
            {
                title: 'After School Clubs and Activities',
                content: `After School Clubs Available:

Sports Clubs:
- Football (Years 3-6)
- Netball (Years 4-6)
- Athletics (Years 3-6)
- Multi-sports (Years 1-2)

Creative Clubs:
- Art Club (Years 3-6)
- Drama Club (Years 4-6)
- Music Club (Years 2-6)
- Choir (Years 3-6)

Academic Support:
- Homework Club (Years 4-6)
- Reading Club (Years 1-3)
- Maths Club (Years 3-6)

Other Activities:
- Gardening Club (Years 2-6)
- Chess Club (Years 4-6)
- Science Club (Years 3-6)

Club Information:
- Most clubs run 3:15 PM - 4:15 PM
- Some clubs available until 5:00 PM
- Small charge for some clubs
- Contact office for current availability
- Clubs change each term`,
                category: 'activities',
                source_url: 'https://www.dovedaleprimary.co.uk',
                checksum: 'after-school-clubs'
            }
        ];
        
        // Add data to vector database
        await vectorDB.addSchoolData(schoolData);
        
        console.log('✅ Vector database setup complete!');
        console.log('💡 You can now use RAG search in your application');
        
    } catch (error) {
        console.error('❌ Vector database setup failed:', error.message);
        console.log('💡 Make sure ChromaDB is running: pip install chromadb && chroma run --host localhost --port 8000');
    }
}

// Run if called directly
if (require.main === module) {
    setupVectorDatabase();
}

module.exports = { setupVectorDatabase }; 