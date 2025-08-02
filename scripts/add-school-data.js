const { getDatabase, initializeDatabase } = require('../utils/database');
const crypto = require('crypto');

async function addSchoolData() {
    console.log('📚 Adding comprehensive school data...');
    
    await initializeDatabase();
    const db = getDatabase();
    
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
            title: 'School Hours and Timings',
            content: `School Hours:
- Gates open: 8:35 AM
- Registration: 8:45 AM
- School day ends: 3:15 PM

Break Times:
- Morning break: 10:30 AM - 10:45 AM
- Lunch break: 12:00 PM - 1:00 PM

After School Clubs:
- Most clubs run from 3:15 PM - 4:15 PM
- Some clubs available until 5:00 PM
- Contact the office for current club availability

Late Collection:
- Children must be collected by 3:25 PM
- After 3:25 PM, children will be taken to the office
- Contact the office if you will be late: 0151 722 3877`,
            category: 'general',
            source_url: 'https://www.dovedaleprimary.co.uk',
            checksum: 'school-hours-timings'
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
            title: 'Contact Information',
            content: `Dovedale Primary School Contact Details:

Address:
Dovedale Primary School
Herondale Road
Liverpool
L18 1JN

Phone Numbers:
- Main Office: 0151 722 3877
- Fax: 0151 722 3878
- Emergency Contact: 0151 722 3877

Email:
- General enquiries: office@dovedaleprimary.co.uk
- Headteacher: headteacher@dovedaleprimary.co.uk

Office Hours:
- Monday to Friday: 8:30 AM - 4:00 PM
- During term time only

School Website:
- www.dovedaleprimary.co.uk

Social Media:
- Facebook: Dovedale Primary School
- Twitter: @DovedalePrimary

Emergency Procedures:
- In case of emergency, school will contact parents
- Please ensure contact details are always up to date
- For school closures, check website and local radio`,
            category: 'contact',
            source_url: 'https://www.dovedaleprimary.co.uk',
            checksum: 'contact-information'
        },
        {
            title: 'Admissions and Enrollment',
            content: `Admissions Information:

Reception Class:
- Children start in September after their 4th birthday
- Applications open in September of previous year
- Deadline: 15th January
- Apply through Liverpool City Council

In-Year Admissions:
- Contact school office for availability
- Complete application form
- Provide proof of address
- Transfer from other schools possible

Required Documents:
- Birth certificate
- Proof of address (utility bill)
- Immunization records
- Previous school records (if applicable)

School Tours:
- Available by appointment
- Contact office to arrange
- Tours available during school hours

Waiting Lists:
- Maintained for oversubscribed year groups
- Contact office for current position`,
            category: 'admissions',
            source_url: 'https://www.dovedaleprimary.co.uk',
            checksum: 'admissions-enrollment'
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
        },
        {
            title: 'School Policies and Procedures',
            content: `Important School Policies:

Attendance:
- Excellent attendance expected
- Contact school by 9:00 AM if child absent
- Medical certificates required for 5+ days
- Holidays during term time not permitted

Behavior:
- Positive behavior policy
- Clear expectations for all children
- Rewards for good behavior
- Consequences for poor behavior
- Anti-bullying policy in place

Safeguarding:
- Designated safeguarding lead: Headteacher
- All staff trained in safeguarding
- Visitors must sign in at office
- No unauthorised adults on site

Health and Safety:
- First aid trained staff
- Medical conditions must be reported
- Medication administered with permission
- Regular fire drills

Homework:
- Reading daily (all ages)
- Spellings weekly (Years 1-6)
- Maths homework (Years 3-6)
- Project work (Years 4-6)`,
            category: 'policies',
            source_url: 'https://www.dovedaleprimary.co.uk',
            checksum: 'school-policies'
        },
        {
            title: 'PTA and Parent Involvement',
            content: `Parent Teacher Association (PTA):

PTA Activities:
- Regular fundraising events
- School discos and fairs
- Second-hand uniform sales
- Parent coffee mornings
- Family fun days

How to Get Involved:
- Attend PTA meetings
- Volunteer for events
- Join WhatsApp group
- Contact PTA chairperson

Fundraising:
- All funds go directly to school
- Recent purchases: playground equipment, books
- Annual target: £5,000
- Events: Summer fair, Christmas fair, quiz nights

Parent Volunteers:
- Reading helpers needed
- Trip chaperones
- Event helpers
- DBS check required for some roles

Communication:
- PTA newsletter monthly
- WhatsApp group for parents
- Notice board in reception
- Email updates available`,
            category: 'pta',
            source_url: 'https://www.dovedaleprimary.co.uk',
            checksum: 'pta-parent-involvement'
        }
    ];
    
    console.log(`📝 Adding ${schoolData.length} documents to database...`);
    
    for (const item of schoolData) {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT OR REPLACE INTO documents (title, content, category, source_url, checksum) VALUES (?, ?, ?, ?, ?)`,
                [item.title, item.content, item.category, item.source_url, item.checksum],
                function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        reject(err);
                        return;
                    }
                    
                    // Add keywords
                    const keywords = extractKeywords(item.content + ' ' + item.title);
                    keywords.forEach(keyword => {
                        db.run(
                            `INSERT OR IGNORE INTO keywords (document_id, keyword) VALUES (?, ?)`,
                            [this.lastID, keyword]
                        );
                    });
                    
                    console.log(`✅ Added: ${item.title}`);
                    resolve();
                }
            );
        });
    }
    
    console.log('🎉 School data added successfully!');
}

function extractKeywords(text) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .slice(0, 20);
}

// Run if called directly
if (require.main === module) {
    addSchoolData().catch(console.error);
}

module.exports = { addSchoolData };