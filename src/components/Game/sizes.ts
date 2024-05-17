import { RodTypes } from './Rod';

export const DICS_HEIGHT = 60;
export const DISC_MIN_WIDTH = 120;
export const DISC_MAX_WIDTH = 350;
export const DISC_ROD_BOTTOM = 30;
export const DISC_GAP = 5;
export const ROD_DIMENSIONS: Record<RodTypes, {
    centerPx: number,
    bottomPx: number,
    widthPx: number,
}> = {
    'source': { centerPx: 400, bottomPx: 120, widthPx: 40 },
    'temporary': { centerPx: 960, bottomPx: 120, widthPx: 40 },
    'destination': { centerPx: 1520, bottomPx: 120, widthPx: 40 },
}
