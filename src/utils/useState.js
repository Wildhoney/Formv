import { useTracked } from '../components/Store';

export default function useState() {
    const [state] = useTracked();
    return state;
}
