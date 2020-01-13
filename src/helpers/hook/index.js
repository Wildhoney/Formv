import { useState, useCallback, useMemo, useContext } from 'react';
import _ from 'lodash';
import { Context } from '../../components/Context';

export function useFormMap(initialState) {
    const fns = useMemo(() => new Map(), []);
    const [state, setState] = useState(initialState);

    const get = useCallback(name => _.get(state, name), [state]);
    const set = useCallback((name, value) => {
        const setter = value => setState(state => _.cloneDeep(_.set(state, name, value)));

        if (value) return setter(value);
        !fns.get(name) && fns.set(name, setter);
        return fns.get(name);
    }, []);

    const remove = useCallback(name => setState(state => ({ ..._.unset(state, name) })), [state]);

    const reset = useCallback(() => setState(initialState), [state]);

    return [state, { get, remove, reset, set }];
}

export const useFormContext = () => {
    return useContext(Context);
};
