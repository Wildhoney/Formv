import test from 'ava';
import { withPage } from '../helpers/puppeteer';

test(
    'It should be able to show the validation messages;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);
        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="name"]', 'Adam');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="email"]', 'example.org');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="email"]', 'adam@example.org');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());
    },
);

test(
    'It should be able to handle the reset which clears validation messages;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);
        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        const resetButton = await page.waitFor('button[type="reset"]');
        await resetButton.click();
        t.snapshot(await helpers.getValidationMessages());
    },
);

test(
    'It should be able to handle API validation messages;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);
        const enableAnchor = await page.waitFor('a.enable.api');
        await enableAnchor.click();

        await page.type('input[name="name"]', 'Adam');
        await page.type('input[name="email"]', 'adam@example.org');
        await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());

        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();
        await page.waitFor(
            () => document.querySelectorAll('.formv-messages li').length > 0,
        );

        t.snapshot(await helpers.getValidationMessages());
    },
);

test(
    'It should be able to handle generic validation messages;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);
        const enableAnchor = await page.waitFor('a.enable.generic');
        await enableAnchor.click();

        await page.type('input[name="name"]', 'Adam');
        await page.type('input[name="email"]', 'adam@example.org');
        await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());

        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();
        await page.waitFor(
            () => document.querySelectorAll('.formv-messages li').length > 0,
        );

        t.snapshot(await helpers.getValidationMessages());
    },
);

function getHelpers(page) {
    async function getValidationMessages() {
        return page.$$eval('.formv-messages li', items => {
            return Array.from(items).map(item => item.innerHTML);
        });
    }

    return { getValidationMessages };
}
