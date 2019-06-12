import test from 'ava';
import * as utils from '../utils';

test('It should be able to set the appropriate class names;', t => {
    t.is(
        utils.getClassNames({ values: [1] }),
        'formv-messages formv-messages-single',
    );
    t.is(
        utils.getClassNames({ values: [1, 2, 3] }),
        'formv-messages formv-messages-multiple',
    );

    t.is(
        utils.getClassNames({ className: 'validity', values: [1] }),
        'formv-messages formv-messages-validity formv-messages-single',
    );
    t.is(
        utils.getClassNames({ className: 'validity', values: [1, 2, 3] }),
        'formv-messages formv-messages-validity formv-messages-multiple',
    );
});
