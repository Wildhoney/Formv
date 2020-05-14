import { useTrackedState } from '../components/Store';

export default function useState() {
    const state = useTrackedState();
    return state;
}
