import test from 'ava';
import { withPage, getHelpers } from '../helpers/puppeteer';

test('It should be able to show the validation messages;', withPage(), async (t, page) => {
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
});

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

test('It should be able to handle API validation messages;', withPage(), async (t, page) => {
    const helpers = getHelpers(page);

    const enableAnchor = await page.waitFor('a.enable.api');
    await enableAnchor.click();

    await page.type('input[name="name"]', 'Adam');
    await page.type('input[name="email"]', 'adam@example.org');
    await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());

    const submitButton = await page.waitFor('button[type="submit"]');
    await submitButton.click();
    await page.waitFor(() => document.querySelectorAll('.formv-messages li').length > 0);

    t.snapshot(await helpers.getValidationMessages());
});

test('It should be able to handle generic validation messages;', withPage(), async (t, page) => {
    const helpers = getHelpers(page);

    const enableAnchor = await page.waitFor('a.enable.generic');
    await enableAnchor.click();

    await page.type('input[name="name"]', 'Adam');
    await page.type('input[name="email"]', 'adam@example.org');
    await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());

    const submitButton = await page.waitFor('button[type="submit"]');
    await submitButton.click();
    await page.waitFor(() => document.querySelectorAll('.formv-messages li').length > 0);

    t.snapshot(await helpers.getValidationMessages());
});

test(
    'It should be able to bypass validation with `formNoValidate` attribute;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);

        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        await page.evaluate(() => {
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.setAttribute('formnovalidate', true);
        });

        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());
    },
);

test(
    'It should be able to show validation messages from the custom validator;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);

        await page.type('input[name="name"]', 'Bot');
        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="email"]', 'adam@example.org');
        await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());
        await submitButton.click();
        t.snapshot(await helpers.getValidationMessages());
    },
);

test(
    'It should be adding the "invalid" class name to the invalid fields;',
    withPage(),
    async (t, page) => {
        const helpers = getHelpers(page);

        const submitButton = await page.waitFor('button[type="submit"]');
        await submitButton.click();

        t.true(await helpers.includesClassName('input[name="name"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="email"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="message"]', 'invalid'));
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="name"]', 'Adam');
        await submitButton.click();
        t.false(await helpers.includesClassName('input[name="name"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="email"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="message"]', 'invalid'));
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="email"]', 'adam');
        await submitButton.click();
        t.false(await helpers.includesClassName('input[name="name"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="email"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="message"]', 'invalid'));
        t.snapshot(await helpers.getValidationMessages());

        await page.type('input[name="email"]', 'adam@example.org');
        await submitButton.click();
        t.false(await helpers.includesClassName('input[name="name"]', 'invalid'));
        t.false(await helpers.includesClassName('input[name="email"]', 'invalid'));
        t.true(await helpers.includesClassName('input[name="message"]', 'invalid'));
        t.snapshot(await helpers.getValidationMessages());

        await page.type('textarea[name="message"]', 'blah '.repeat(20).trim());
        await submitButton.click();
        t.false(await helpers.includesClassName('input[name="name"]', 'invalid'));
        t.false(await helpers.includesClassName('input[name="email"]', 'invalid'));
        t.false(await helpers.includesClassName('input[name="message"]', 'invalid'));
        t.snapshot(await helpers.getValidationMessages());
    },
);
