import { RodTypes } from '../Rod';

export type HanoiSolverStep = {
    disc: number,
    fromRod: RodTypes,
    toRod: RodTypes,
}

export const hanoiSolver = (
    discs: number,
    fromRod: RodTypes,
    tempRod: RodTypes,
    toRod: RodTypes,
    solverSteps: HanoiSolverStep[],
) => {
    if (discs == 0) return;
    hanoiSolver(discs - 1, fromRod, toRod, tempRod, solverSteps);
    solverSteps.push({ disc: discs, fromRod, toRod });
    hanoiSolver(discs - 1, tempRod, fromRod, toRod, solverSteps);
};
