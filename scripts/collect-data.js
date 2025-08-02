const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { getDatabase, initializeDatabase } = require('../utils/database');

class DovesdaleDataCollector {
    constructor() {
        this.baseUrl = 'https://www.dovedaleprimary.co.uk';
        this.collectedData = [];
    }
    
    async collectAllData() {
        console.log('🔍 Starting comprehensive data collection...');
        
        await initializeDatabase();
        
        try {
            // Collect from main pages
            await this.collectFromMainPage();
            await this.collectFromKeyPages();
            await this.findAndProcessPDFs();
            
            // Save to database
            await this.saveToDatabase();
            
            console.log('✅ Data collection completed!');
            console.log(`📊 Collected ${this.collectedData.length} documents`);
            
        } catch (error) {
            console.error('❌ Data collection failed:', error.message);
        }
    }
    
    async collectFromMainPage() {
        console.log('📖 Collecting from main page...');
        
        try {
            const response = await axios.get(this.baseUrl, { timeout: 10000 });
            const $ = cheerio.load(response.data);
            
            // Extract main content sections
            $('main, .content, .page-content').each((i, element) => {
                const content = $(element).text().replace(/\s+/g, ' ').trim();
                
                if (content.length > 100) {
                    this.collectedData.push({
                        title: 'School Information - Home Page',
                        content: content.substring(0, 2000),
                        category: 'general',
                        source_url: this.baseUrl,
                        checksum: crypto.createHash('md5').update(content).digest('hex')
                    });
                }
            });
            
        } catch (error) {
            console.log('⚠️ Could not access main page:', error.message);
        }
    }
    
    async collectFromKeyPages() {
        const keyPages = [
            '/about',
            '/admissions', 
            '/curriculum',
            '/policies',
            '/contact',
            '/news',
            '/calendar'
        ];
        
        for (const page of keyPages) {
            await this.collectFromPage(page);
            await this.delay(1000); // Be respectful to the server
        }
    }
    
    async collectFromPage(pagePath) {
        try {
            const url = `${this.baseUrl}${pagePath}`;
            console.log(`📄 Collecting from: ${url}`);
            
            const response = await axios.get(url, { timeout: 10000 });
            const $ = cheerio.load(response.data);
            
            const pageTitle = $('title').text() || $('h1').first().text() || `Page: ${pagePath}`;
            const content = $('body').text().replace(/\s+/g, ' ').trim();
            
            if (content.length > 50) {
                this.collectedData.push({
                    title: pageTitle,
                    content: content.substring(0, 3000),
                    category: this.categorizeContent(pagePath, content),
                    source_url: url,
                    checksum: crypto.createHash('md5').update(content).digest('hex')
                });
            }
            
        } catch (error) {
            console.log(`⚠️ Could not access ${pagePath}:`, error.message);
        }
    }
    
    async findAndProcessPDFs() {
        console.log('📋 Looking for PDF documents...');
        
        try {
            const response = await axios.get(this.baseUrl);
            const $ = cheerio.load(response.data);
            
            const pdfLinks = [];
            $('a[href$=".pdf"], a[href*=".pdf"]').each((i, el) => {
                const href = $(el).attr('href');
                const linkText = $(el).text().trim();
                
                if (href) {
                    const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`;
                    pdfLinks.push({
                        url: fullUrl,
                        title: linkText || 'PDF Document',
                        category: this.categorizePDF(linkText)
                    });
                }
            });
            
            console.log(`📄 Found ${pdfLinks.length} PDF links`);
            
            // For now, just store PDF metadata
            // In the future, you could add PDF text extraction here
            pdfLinks.forEach(pdf => {
                this.collectedData.push({
                    title: pdf.title,
                    content: `PDF Document: ${pdf.title}. Download from: ${pdf.url}`,
                    category: pdf.category,
                    source_url: pdf.url,
                    checksum: crypto.createHash('md5').update(pdf.url).digest('hex')
                });
            });
            
        } catch (error) {
            console.log('⚠️ Could not collect PDF info:', error.message);
        }
    }
    
    categorizeContent(path, content) {
        const categories = {
            '/about': 'general',
            '/admissions': 'admissions',
            '/curriculum': 'curriculum', 
            '/policies': 'policies',
            '/contact': 'contact',
            '/news': 'news',
            '/calendar': 'calendar'
        };
        
        return categories[path] || 'general';
    }
    
    categorizePDF(filename) {
        const lowerName = filename.toLowerCase();
        
        if (lowerName.includes('menu')) return 'meals';
        if (lowerName.includes('uniform')) return 'uniform';
        if (lowerName.includes('policy')) return 'policies';
        if (lowerName.includes('term') || lowerName.includes('calendar')) return 'calendar';
        if (lowerName.includes('newsletter')) return 'news';
        
        return 'documents';
    }
    
    async saveToDatabase() {
        const db = getDatabase();
        
        console.log('💾 Saving to database...');
        
        for (const item of this.collectedData) {
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
                        
                        resolve();
                    }
                );
            });
        }
    }
    
function extractKeywords(text) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .slice(0, 20);
}
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Run if called directly
if (require.main === module) {
    const collector = new DovesdaleDataCollector();
    collector.collectAllData();
}

module.exports = { DovesdaleDataCollector };