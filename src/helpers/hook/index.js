import { useState, useCallback } from 'react';
import _ from 'lodash';

export default function useForm(initialState) {
    const [state, setState] = useState(initialState);

    const get = useCallback(name => _.get(state, name), [state]);

    const set = useCallback((name, value) => {
        const setter = value =>
            setState(state =>
                Array.isArray(state)
                    ? [..._.set(state, name, value)]
                    : { ..._.set(state, name, value) },
            );
        return value ? setter(value) : useCallback(setter, []);
    }, []);

    const remove = useCallback(name => setState(state => ({ ..._.unset(state, name) })), [state]);

    const reset = useCallback(() => setState(initialState), [state]);

    return [state, { get, remove, reset, set }];
}
