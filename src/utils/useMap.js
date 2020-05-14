import { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';

export default function useMap(initialState) {
    const fns = useMemo(() => new Map(), []);
    const [state, setState] = useState(initialState);

    const get = useCallback((name) => _.get(state, name), [state]);
    const set = useCallback(
        (name, value) => {
            const setter = (value) => setState((state) => _.cloneDeep(_.set(state, name, value)));

            if (value == null) return setter(value);
            !fns.get(name) && fns.set(name, setter);
            return fns.get(name);
        },
        [state],
    );

    const remove = useCallback((name) => setState((state) => ({ ..._.unset(state, name) })), [
        state,
    ]);

    const reset = useCallback(() => setState(initialState), [state]);

    return [state, { get, remove, reset, set }];
}
