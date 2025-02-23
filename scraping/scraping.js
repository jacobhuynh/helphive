const puppeteer = require("puppeteer-extra");
const fs = require('fs');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeDescription(page) {
    try {
        // Step 2: Wait for description content to be present
        await page.waitForSelector('#short_desc', { timeout: 10000, visible: true });

        // Step 3: Get all text content with proper formatting
        const descriptionText = await page.evaluate(() => {
            const descriptionDiv = document.querySelector('#short_desc');
            if (!descriptionDiv) return null;

            // Clone the div to modify without affecting the page
            const clone = descriptionDiv.cloneNode(true);

            // Remove images and figures
            clone.querySelectorAll('img, figure').forEach(el => el.remove());

            // Convert HTML to formatted text
            const convertToText = (node) => {
                // Handle lists
                if (node.tagName === 'UL' || node.tagName === 'OL') {
                    return Array.from(node.children).map(li => `• ${li.textContent.trim()}`).join('\n');
                }

                // Handle paragraphs and headings
                if (node.tagName === 'P' || node.tagName.match(/H[1-6]/)) {
                    return `\n${node.textContent.trim()}\n`;
                }

                // Default case
                return node.textContent.replace(/\s+/g, ' ').trim();
            };

            // Process all child nodes
            return Array.from(clone.children).map(child => convertToText(child)).join('\n').trim();
        });

        return descriptionText || 'No description found';
    } catch (error) {
        console.error('Description scraping error:', error);
        return null;
    }
}

async function get_scholarships() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    let volunteer_data = [];

    // Initial navigation with network idle wait
    let location = 'Charlottesville%2C+VA%2C+USA';
    await page.goto('https://www.volunteermatch.org/search?l=' + location + '&v=false');

    while (true) {
        await new Promise(r => setTimeout(r, 10000));

        // Process current page
        const listItems = await page.$$('div.pub-srp-opps ul li');
        console.log(`Found ${listItems.length} opportunities`);

        for (let i = 0; i < listItems.length; i++) {
            const li = listItems[i];

            // Get the href from the anchor tag
            const link = await li.$eval(
                'h3 a.pub-srp-opps__title', // CSS selector for the anchor
                el => el.getAttribute('href') // Get the href attribute
            );

            // Get text from the nested div.pub-srp-opps__loc
            const locationText = await li.$eval(
                'div.pub-srp-opps__info div.pub-srp-opps__loc',
                el => el.textContent.trim()
            );

            let fullLink = 'https://www.volunteermatch.org' + link;
            console.log(`Item ${i + 1} Location: ${locationText}`);

            // if the location doesn't contain "Charlottesville", skip this opportunity
            if (!locationText.toLowerCase().includes('charlottesville')) {
                console.log('Skipping opportunity not in Charlottesville');
                continue;
            }

            // open new page and go to the fullLink
            const newPage = await browser.newPage();
            await newPage.goto(fullLink, { waitUntil: 'domcontentloaded' });
            console.log(`Opened ${fullLink}`);

            let descriptionDiv = 'div[id="short_desc"]';
            await newPage.waitForSelector(descriptionDiv, { timeout: 5000 });

            // open click the read more div it exists
            let readMore = "div[class='ddd-toggle ddd-label']";
            let readMoreButton = await newPage.$(readMore);
            if (readMoreButton) {
                await readMoreButton.click();
            }

            const description = await scrapeDescription(newPage);
            console.log('Full Description:', description);

            // get inner text of the causes div (it is just a line of text)
            let causesDiv = "div[class='logistics__causes-list']";
            let causesText = await newPage.$eval(causesDiv, el => el.innerText);

            // split the causesText by comma into a list and remove whitespace from start and end of each item in list
            let causesList = causesText.split(',').map(item => item.trim());
            console.log('Causes List:', causesList);

            const goodFor = await newPage.evaluate(() => {
                // Find the h3 with exact text "GOOD FOR"
                const header = Array.from(document.querySelectorAll('h3.title'))
                    .find(h3 => h3.textContent.trim() === 'GOOD FOR');

                if (!header) return null;

                // Find the next UL with class 'list' in the same section
                const list = header.closest('section').querySelector('ul.list');

                if (!list) return null;

                // Extract all list items with class 'item'
                return Array.from(list.querySelectorAll('li.item'))
                    .map(li => li.textContent.trim())
                    .filter(text => text);
            });

            console.log('Good For:', goodFor);

            const skills = await newPage.evaluate(() => {
                // Find the h3 with exact text "SKILLS"
                const header = Array.from(document.querySelectorAll('h3.title'))
                    .find(h3 => h3.textContent.trim() === 'SKILLS');

                if (!header) return null;

                // Find the UL with class 'list' in the same section
                const list = header.closest('section').querySelector('ul.list');

                if (!list) return null;

                // Extract all list items (including those with 'last' class)
                return Array.from(list.querySelectorAll('li.item'))
                    .map(li => li.textContent.trim())
                    .filter(text => text);
            });

            console.log('Skills:', skills);

            const getMissionStatement = async (page) => {
                return await page.evaluate(() => {
                    const missionHeader = Array.from(document.querySelectorAll('h4.opp-dtl__moi-title'))
                        .find(h4 => h4.textContent.trim() === 'Mission Statement');

                    if (!missionHeader) return null;

                    // Find the next paragraph after the header
                    let nextElement = missionHeader.nextElementSibling;
                    while (nextElement) {
                        if (nextElement.tagName === 'P') {
                            return nextElement.textContent.replace(/\s+/g, ' ').trim();
                        }
                        nextElement = nextElement.nextElementSibling;
                    }
                    return null;
                });
            };

            const getDescription = async (page) => {
                return await page.evaluate(() => {
                    const descHeader = Array.from(document.querySelectorAll('h4.opp-dtl__moi-title'))
                        .find(h4 => h4.textContent.trim() === 'Description');

                    if (!descHeader) return null;

                    // Find the next paragraph after the header
                    let nextElement = descHeader.nextElementSibling;
                    while (nextElement) {
                        if (nextElement.tagName === 'P') {
                            // Handle <br> tags by replacing with newlines
                            const clone = nextElement.cloneNode(true);
                            clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
                            return clone.textContent.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
                        }
                        nextElement = nextElement.nextElementSibling;
                    }
                    return null;
                });
            };

            const { title, organization } = await newPage.evaluate(() => {
                // Get title text while ignoring the favorite button
                const titleElement = document.querySelector('h1.opp-dtl__title--main');
                const title = titleElement ? titleElement.childNodes[0].textContent.trim() : null;

                // Get organization name from the anchor tag
                const orgElement = document.querySelector('h2.opp-dtl__org-name a');
                const organization = orgElement ? orgElement.textContent.trim() : null;

                return { title, organization };
            });

            console.log('Title:', title);
            console.log('Organization:', organization);

            // Usage
            const missionStatement = await getMissionStatement(newPage);
            const companyDescription = await getDescription(newPage);
            console.log('Mission Statement:', missionStatement);
            console.log('Company Description:', companyDescription);

            let opp = {
                title: title,
                organization: organization,
                location: locationText,
                description: description,
                causes: causesList,
                goodFor: goodFor,
                skills: skills,
                missionStatement: missionStatement,
                organizationDescription: companyDescription,
                url: fullLink
            }

            volunteer_data.push(opp);

            // close the tab
            await newPage.close();
        }

        // Extract current and last page numbers
        const paginationInfo = await page.evaluate(() => {
            const currentPage = document.querySelector('.pub-srp-pag__num--curr')?.innerText.trim();
            const allPages = [...document.querySelectorAll('.pub-srp-pag__num')].map(el => el.innerText.trim());
            const lastPage = allPages[allPages.length - 1];

            return { currentPage: Number(currentPage), lastPage: Number(lastPage) };
        });

        console.log(`Current Page: ${paginationInfo.currentPage} | Last Page: ${paginationInfo.lastPage}`);

        // Stop if we are on the last page
        if (paginationInfo.currentPage >= paginationInfo.lastPage) {
            console.log("Reached the last page. Exiting...");
            break;
        }

        // Find the next page number and click it
        try {
            const nextPageNumber = paginationInfo.currentPage + 1;
            console.log(`Trying to click page number: ${nextPageNumber}`);

            // Wait for all page numbers to load
            await page.waitForSelector(".pub-srp-pag__num", { timeout: 5000 });

            const nextPageButton = await page.evaluateHandle((nextPage) => {
                return Array.from(document.querySelectorAll(".pub-srp-pag__num"))
                    .find(span => span.innerText.trim() === nextPage.toString());
            }, nextPageNumber);

            if (nextPageButton) {
                await nextPageButton.click();
            } else {
                console.log(`Page number ${nextPageNumber} not found. Exiting...`);
                break;
            }
        } catch (error) {
            console.log("Error finding or clicking next page number. Exiting...");
            break;
        }
    }

    fs.writeFileSync('volunteer_opportunities.json', JSON.stringify(volunteer_data, null, 2));
    // await browser.close();
}

get_scholarships();