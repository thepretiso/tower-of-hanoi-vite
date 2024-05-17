export type Props = {
    timeCountdown?: { // TODO - implement countdown feature
        startCountdownAtMs: number,
        onTimesUp: () => void,
    }
}
