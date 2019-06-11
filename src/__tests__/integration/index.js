import test from 'ava';
import puppeteer from 'puppeteer';

async function withPage(t, run) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await run(t, page);
    } finally {
        await page.close();
        await browser.close();
    }
}

const url = 'http://localhost:3000';

const getValidationMessage = (page, index) => {
    return page.evaluate(index => {
        const field = document.querySelectorAll('main > div');
        const message = field[index].querySelector('.formv-messages > li');
        return message ? message.innerHTML : null;
    }, index);
};

test('It should be able to validate all of the fields;', withPage, async (t, page) => {
    await page.goto(url);
    await page.click('button');
    t.is(await getValidationMessage(page, 0), 'Please enter your first name.');

    await page.type('input[type="text"]', 'Adam');
    await page.click('button');
    t.is(await getValidationMessage(page, 0), 'Please ensure your first name is at least 5 characters.');
    t.is(await getValidationMessage(page, 1), 'Please enter your email address.');
});

test('It should be able to validate only the email field;', withPage, async (t, page) => {
    await page.goto(url);
    await page.type('input[type="text"]', 'Hello Maria');
    await page.click('button');
    t.is(await getValidationMessage(page, 0), null);
    t.is(await getValidationMessage(page, 1), 'Please enter your email address.');

    await page.type('input[type="email"]', 'Adam');
    await page.click('button');
    t.is(await getValidationMessage(page, 1), 'Please enter a valid email address.');
});

test('It should be able to submit the form when validation passes;', withPage, async (t, page) => {
    await page.goto(url);
    await page.type('input[type="text"]', 'Hello Maria');
    await page.type('input[type="email"]', 'maria@example.org');

    page.on('dialog', dialog => dialog.dismiss());
    await page.click('button');
    await page.waitFor('main > div.message');
    t.is(
        await page.evaluate(() => document.querySelector('main > div.message').innerHTML),
        "You've successfully submitted the form!",
    );
});

test('It should be able to handle API validation errors;', withPage, async (t, page) => {
    await page.goto(url);
    await page.type('input[type="text"]', 'Hello Maria');
    await page.type('input[type="email"]', 'maria@example.org');

    page.on('dialog', dialog => dialog.accept());
    await page.click('button');
    await page.waitForSelector('ul li');
    t.is(await getValidationMessage(page, 0), null);
    t.is(
        await getValidationMessage(page, 1),
        'We were unable to validate the supplied e-mail address. Please try again later.',
    );
});
