export type Score = {
    movesCount: number,
    gameTimeMs: number,
}

export type Props = {
    onBackButton: () => void,
    onGameWin: (score?: Score) => void,
}