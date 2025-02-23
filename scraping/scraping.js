const puppeteer = require("puppeteer-extra");
const fs = require('fs');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeDescription(page) {
    try {
        await page.waitForSelector('#short_desc', { timeout: 10000, visible: true });

        const descriptionText = await page.evaluate(() => {
            const descriptionDiv = document.querySelector('#short_desc');
            if (!descriptionDiv) return null;

            const clone = descriptionDiv.cloneNode(true);
            clone.querySelectorAll('img, figure').forEach(el => el.remove());

            const convertToText = (node) => {
                if (node.tagName === 'UL' || node.tagName === 'OL') {
                    return Array.from(node.children).map(li => `• ${li.textContent.trim()}`).join('\n');
                }
                if (node.tagName === 'P' || node.tagName.match(/H[1-6]/)) {
                    return `\n${node.textContent.trim()}\n`;
                }
                return node.textContent.replace(/\s+/g, ' ').trim();
            };

            return Array.from(clone.children).map(child => convertToText(child)).join('\n').trim();
        });

        return descriptionText || 'No description found';
    } catch (error) {
        console.error('Description scraping error:', error);
        return null;
    }
}

async function saveData(volunteer_data) {
    try {
        fs.writeFileSync('volunteer_opportunities.json', JSON.stringify(volunteer_data, null, 2));
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function get_scholarships() {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--window-size=1920,1080']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        let volunteer_data = [];

        const cities_to_search = [
            'Charlottesville%2C+VA%2C+USA',
            'New+York%2C+NY%2C+USA',
            'Los+Angeles%2C+CA%2C+USA',
            'Chicago%2C+IL%2C+USA',
            'Houston%2C+TX%2C+USA',
            'Phoenix%2C+AZ%2C+USA',
            'Philadelphia%2C+PA%2C+USA',
            'San+Antonio%2C+TX%2C+USA',
            'San+Diego%2C+CA%2C+USA',
            'Dallas%2C+TX%2C+USA',
            'San+Jose%2C+CA%2C+USA',
            'Austin%2C+TX%2C+USA',
            'Jacksonville%2C+FL%2C+USA',
            'Fort+Worth%2C+TX%2C+USA',
            'Columbus%2C+OH%2C+USA',
            'Charlotte%2C+NC%2C+USA',
            'Indianapolis%2C+IN%2C+USA',
            'San+Francisco%2C+CA%2C+USA',
            'Seattle%2C+WA%2C+USA',
            'Denver%2C+CO%2C+USA',
            'Washington%2C+DC%2C+USA',
            'Boston%2C+MA%2C+USA',
        ];

        for (let x = 0; x < cities_to_search.length; x++) {
            try {
                const location = cities_to_search[x];
                console.log(`\nProcessing city: ${decodeURIComponent(location)}`);

                try {
                    await page.goto('https://www.volunteermatch.org/search?l=' + location + '&v=false', {
                        waitUntil: 'domcontentloaded',
                        timeout: 30000
                    });
                } catch (error) {
                    console.error(`Navigation error for ${location}:`, error.message);
                    continue;
                }

                let currentPageNumber = 1;
                let hasMorePages = true;

                while (hasMorePages) {
                    try {
                        await page.waitForSelector('div.pub-srp-opps ul li', { timeout: 15000 });
                        const listItems = await page.$$('div.pub-srp-opps ul li');
                        console.log(`Found ${listItems.length} opportunities on page ${currentPageNumber}`);

                        for (let i = 0; i < listItems.length; i++) {
                            try {
                                const li = listItems[i];
                                let link, locationText;

                                try {
                                    link = await li.$eval('h3 a.pub-srp-opps__title', el => el.getAttribute('href'));
                                    locationText = await li.$eval('div.pub-srp-opps__info div.pub-srp-opps__loc', el => el.textContent.trim());
                                } catch (error) {
                                    console.error('Error getting link/location:', error.message);
                                    continue;
                                }

                                const fullLink = 'https://www.volunteermatch.org' + link;
                                console.log(`Processing item ${i + 1}: ${fullLink}`);

                                const currentCity = decodeURIComponent(location.split('%2C')[0])
                                    .replace(/\+/g, ' ')
                                    .toLowerCase()
                                    .trim();

                                const normalizedLocation = locationText.toLowerCase()
                                    .replace(/[^a-z0-9 ]/g, ' ')
                                    .replace(/\s+/g, ' ')
                                    .trim();

                                if (!normalizedLocation.includes(currentCity)) {
                                    console.log('Skipping non-matching location');
                                    continue;
                                }

                                const newPage = await browser.newPage();
                                try {
                                    await newPage.goto(fullLink, { 
                                        waitUntil: 'domcontentloaded',
                                        timeout: 20000 
                                    });
                                } catch (error) {
                                    console.error('Error loading opportunity page:', error.message);
                                    await newPage.close();
                                    continue;
                                }

                                let description, causesList, goodFor, skills, missionStatement, companyDescription, title, organization;

                                try {
                                    description = await scrapeDescription(newPage);
                                    
                                    const causesText = await newPage.$eval("div[class='logistics__causes-list']", el => el.innerText);
                                    causesList = causesText.split(',').map(item => item.trim());

                                    goodFor = await newPage.evaluate(() => {
                                        const header = Array.from(document.querySelectorAll('h3.title'))
                                            .find(h3 => h3.textContent.trim() === 'GOOD FOR');
                                        return header ? Array.from(header.closest('section').querySelectorAll('li.item'))
                                            .map(li => li.textContent.trim()) : null;
                                    });

                                    skills = await newPage.evaluate(() => {
                                        const header = Array.from(document.querySelectorAll('h3.title'))
                                            .find(h3 => h3.textContent.trim() === 'SKILLS');
                                        return header ? Array.from(header.closest('section').querySelectorAll('li.item'))
                                            .map(li => li.textContent.trim()) : null;
                                    });

                                    missionStatement = await newPage.evaluate(() => {
                                        const header = Array.from(document.querySelectorAll('h4.opp-dtl__moi-title'))
                                            .find(h4 => h4.textContent.trim() === 'Mission Statement');
                                        if (!header) return null;
                                        let nextElement = header.nextElementSibling;
                                        while (nextElement && nextElement.tagName !== 'P') {
                                            nextElement = nextElement.nextElementSibling;
                                        }
                                        return nextElement?.textContent.replace(/\s+/g, ' ').trim();
                                    });

                                    companyDescription = await newPage.evaluate(() => {
                                        const descHeader = Array.from(document.querySelectorAll('h4.opp-dtl__moi-title'))
                                            .find(h4 => h4.textContent.trim() === 'Description');
                                        if (!descHeader) return null;
                                        let nextElement = descHeader.nextElementSibling;
                                        while (nextElement && nextElement.tagName !== 'P') {
                                            nextElement = nextElement.nextElementSibling;
                                        }
                                        return nextElement?.textContent.replace(/\s+/g, ' ').trim();
                                    });

                                    const titleOrg = await newPage.evaluate(() => ({
                                        title: document.querySelector('h1.opp-dtl__title--main')?.childNodes[0]?.textContent?.trim(),
                                        organization: document.querySelector('h2.opp-dtl__org-name a')?.textContent?.trim()
                                    }));
                                    title = titleOrg.title;
                                    organization = titleOrg.organization;
                                } catch (error) {
                                    console.error('Error scraping opportunity details:', error.message);
                                }

                                volunteer_data.push({
                                    title: title || 'N/A',
                                    organization: organization || 'N/A',
                                    location: locationText,
                                    description: description || 'N/A',
                                    causes: causesList || [],
                                    goodFor: goodFor || [],
                                    skills: skills || [],
                                    missionStatement: missionStatement || 'N/A',
                                    organizationDescription: companyDescription || 'N/A',
                                    url: fullLink
                                });

                                await newPage.close();

                            } catch (error) {
                                console.error(`Error processing opportunity ${i + 1}:`, error.message);
                            }
                        }

                        try {
                            const paginationInfo = await page.evaluate(() => {
                                const current = document.querySelector('.pub-srp-pag__num--curr');
                                const pages = Array.from(document.querySelectorAll('.pub-srp-pag__num'));
                                return {
                                    currentPage: current ? Number(current.textContent) : 1,
                                    lastPage: pages.length > 0 ? Number(pages[pages.length - 1].textContent) : 1
                                };
                            });

                            if (paginationInfo.currentPage >= paginationInfo.lastPage) {
                                hasMorePages = false;
                                console.log('Reached last page for city');
                            } else {
                                currentPageNumber++;
                                const nextPageButton = await page.evaluateHandle((nextPage) => 
                                    Array.from(document.querySelectorAll(".pub-srp-pag__num"))
                                        .find(span => span.textContent.trim() === nextPage.toString()), 
                                    currentPageNumber
                                );
                                
                                if (nextPageButton) {
                                    await nextPageButton.click();
                                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
                                } else {
                                    hasMorePages = false;
                                }
                            }
                        } catch (error) {
                            console.error('Pagination error:', error.message);
                            hasMorePages = false;
                        }

                    } catch (error) {
                        console.error('Page processing error:', error.message);
                        hasMorePages = false;
                    }
                }

                try {
                    await saveData(volunteer_data);
                } catch (error) {
                    console.error('Error saving after city:', error.message);
                }

            } catch (error) {
                console.error(`Error processing city ${location}:`, error.message);
            }
        }

    } catch (error) {
        console.error('Critical error:', error.message);
    } finally {
        if (browser) {
            try {
                await browser.close();
                console.log('Browser closed successfully');
            } catch (error) {
                console.error('Error closing browser:', error.message);
            }
        }
    }
}

get_scholarships();