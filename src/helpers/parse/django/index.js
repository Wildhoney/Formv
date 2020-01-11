import * as R from 'ramda';

export const flattenValidationMessages = (validationMessages, context = '') => {
    const isArray = R.is(Array);
    const isObject = R.is(Object);
    const isNestedObject = a => isObject(a) && !isArray(a);
    const isArrayOfObjects = R.compose(isObject, R.head);

    return Object.entries(validationMessages).reduce((accum, [key, value]) => {
        if (isArray(value) && isArrayOfObjects(value)) {
            return flattenArrayValidationMessages(value, key, accum);
        }

        if (isNestedObject(value)) {
            return flattenNestedValidationMessages(value, key, accum);
        }

        return { ...accum, [`${context}${key}`]: value };
    }, {});
};

export const flattenArrayValidationMessages = (value, key, accum = {}) => {
    const accumSub = value.reduce((accum, value, index) => {
        const subKey = `${key}.${index}.`;
        return {
            ...accum,
            ...flattenValidationMessages(value, subKey),
        };
    }, {});
    return { ...accum, ...accumSub };
};

export const flattenNestedValidationMessages = (value, key, accum = {}) => {
    const accumSub = Object.entries(value).reduce((accum, [key_, value]) => {
        const subKey = `${key}.${key_}`;
        return { ...accum, [subKey]: value };
    }, {});
    return { ...accum, ...accumSub };
};
