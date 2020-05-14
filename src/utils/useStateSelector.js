import { useSelector } from '../components/Store';

export default function useStateSelector() {
    const state = useSelector();
    return state;
}
