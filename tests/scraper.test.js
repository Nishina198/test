const scrapeGoogle = require('../server/scraper');

jest.setTimeout(30000);

test('Scrapes Google search results', async () => {
    const results = await scrapeGoogle('test query');
    
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
        expect(results[0]).toHaveProperty('title');
        expect(results[0]).toHaveProperty('link');
    }
});


afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
});
