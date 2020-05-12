import puppeteer from 'puppeteer';
import getPort from 'get-port';
import execa from 'execa';
import delay from 'delay';

export function withPage(debug = false) {
    return async (t, run) => {
        const port = await getPort();
        const browser = await puppeteer.launch({
            headless: !debug,
            devtools: debug,
            defaultViewport: null,
        });
        const page = await browser.newPage();

        execa('yarn', ['start'], {
            env: {
                PORT: port,
            },
        });

        try {
            await delay(2000);
            await page.goto(`http://0.0.0.0:${port}`, {
                waitUntil: 'load',
            });
            await run(t, page);
        } catch (error) {
            console.error(`Puppeteer: ${error}.`);
            t.fail();
        } finally {
            await page.close();
            await browser.close();
        }
    };
}

export function getHelpers(page) {
    async function getSuccessMessage() {
        await page.waitFor('.formv-message');
        return page.$eval('.formv-message', (node) => node.innerHTML);
    }

    function getValidationMessages() {
        return page.$$eval('.formv-messages li', (nodes) => {
            return Array.from(nodes).map((node) => node.innerHTML);
        });
    }

    async function getGenericMessages() {
        await page.waitFor('.formv-message');
        return page.$eval('.formv-message', (node) => node.innerHTML);
    }

    async function includesClassName(selector, className) {
        return page.evaluate(
            ({ selector, className }) => {
                const node = document.querySelector(selector);
                return node.classList.contains(className);
            },
            { selector, className },
        );
    }

    return { getGenericMessages, getSuccessMessage, getValidationMessages, includesClassName };
}
