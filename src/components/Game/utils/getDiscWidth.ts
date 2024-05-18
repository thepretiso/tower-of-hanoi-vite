import { DISC_MIN_WIDTH, DISC_MAX_WIDTH } from '../sizes';

export const getDiscWidth = (value: number, discCount: number) => {
    return DISC_MIN_WIDTH + (
        value / discCount * (DISC_MAX_WIDTH - DISC_MIN_WIDTH)
    ) || DISC_MIN_WIDTH;
}
