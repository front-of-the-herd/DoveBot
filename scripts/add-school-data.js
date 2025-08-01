const { getDatabase, initializeDatabase } = require('../utils/database');
const crypto = require('crypto');

async function addSchoolData() {
    await initializeDatabase();
    const db = getDatabase();
    
    const schoolData = [
        // Term Dates
        {
            title: "Term Dates 2024-2025",
            content: "Autumn Term: 4th September 2024 - 20th December 2024. Spring Term: 6th January 2025 - 4th April 2025. Summer Term: 22nd April 2025 - 23rd July 2025. INSET Days: 2nd September 2024, 22nd October 2024, 3rd January 2025, 24th February 2025, 21st July 2025.",
            category: "term-dates",
            source_url: "https://www.dovedaleprimary.co.uk"
        },
        
        // School Meals
        {
            title: "School Meals Information",
            content: "Hot meals are provided daily by our kitchen. Cost: £2.40 per meal for Key Stage 2 pupils. Free school meals available for eligible families. Weekly menu rotates every 3 weeks. Special dietary requirements can be accommodated - contact the office.",
            category: "meals",
            source_url: "https://www.dovedaleprimary.co.uk"
        },
        
        // Absence Reporting
        {
            title: "Reporting Absence",
            content: "To report your child absent, call the school office on 0151 722 3877 before 9:30 AM on the first day of absence. You can also email admin@dovedaleprimary.co.uk. For medical appointments, please provide appointment cards where possible.",
            category: "absence",
            source_url: "https://www.dovedaleprimary.co.uk"
        },
        
        // After School Clubs
        {
            title: "After School Clubs",
            content: "Various clubs available including Football Club (Monday & Wednesday), Art Club (Tuesday), Choir (Thursday), and Computing Club (Friday). Clubs run from 3:30-4:30 PM. Booking required through the school office. Some clubs may have small charges.",
            category: "clubs",
            source_url: "https://www.dovedaleprimary.co.uk"
        },
        
        // Parent Evenings
        {
            title: "Parent Evenings",
            content: "Parent consultation evenings are held twice yearly - usually October and March. Appointments can be booked through the online booking system or by calling the school office. 10-minute slots available. Reports are sent home before parent evenings.",
            category: "parents",
            source_url: "https://www.dovedaleprimary.co.uk"
        },
        
        // Homework Policy
        {
            title: "Homework Policy",
            content: "Homework is set weekly. Reception and Year 1: 10 minutes reading daily. Year 2: 15 minutes daily including reading and phonics. Years 3-6: 30 minutes daily including reading, spellings, and subject-specific tasks. Homework handed out on Friday, due back Wednesday.",
            category: "homework",
            source_url: "https://www.dovedaleprimary.co.uk"
        },
        
        // Emergency Contacts
        {
            title: "Emergency Procedures",
            content: "In case of emergency, the school will contact parents using the emergency contact details provided. Please ensure these are always up to date. If we cannot reach parents, we will contact emergency contacts. For school closures due to weather, check the school website and local radio.",
            category: "emergency",
            source_url: "https://www.dovedaleprimary.co.uk"
        }
    ];
    
    // Insert data
    for (const item of schoolData) {
        const checksum = crypto.createHash('md5').update(item.content).digest('hex');
        
        db.run(
            `INSERT OR REPLACE INTO documents (title, content, category, source_url, checksum) VALUES (?, ?, ?, ?, ?)`,
            [item.title, item.content, item.category, item.source_url, checksum],
            function(err) {
                if (err) {
                    console.error('Error inserting:', err);
                    return;
                }
                
                console.log(`✅ Added: ${item.title}`);
                
                // Add keywords
                const keywords = extractKeywords(item.content + ' ' + item.title);
                keywords.forEach(keyword => {
                    db.run(
                        `INSERT INTO keywords (document_id, keyword) VALUES (?, ?)`,
                        [this.lastID, keyword]
                    );
                });
            }
        );
    }
    
    console.log('🚀 School data added successfully!');
}

function extractKeywords(text) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']);
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .slice(0, 15);
}

// Run the script
addSchoolData().catch(console.error);