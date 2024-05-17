import React, { createRef } from 'react';
import { formatMilisecondsHHMMSS } from '../../../utils/formatTime';
import { Props } from './interface';

const DEFAULT_TIME = '00:00:00';
const CLOCK_UPDATE_MS = 1000;

export class Clock extends React.PureComponent<Props> {
    clockRef = createRef<HTMLDivElement>();

    secondInterval: number = 0;

    startTimestamp = 0;

    currentTimeMs: number = 0;

    running = false;

    componentWillUnmount(): void {
        this.resetClock();
    }

    updateClock = () => {
        this.currentTimeMs = Date.now() - this.startTimestamp;
        this.clockRef.current!.textContent = formatMilisecondsHHMMSS(this.currentTimeMs);
    }

    startClock() {
        if (this.running) return;
        this.running = true;
        this.startTimestamp = Date.now();
        this.secondInterval = setInterval(this.updateClock, CLOCK_UPDATE_MS);
    }

    resetClock() {
        this.stopClock();
        this.currentTimeMs = 0;
        this.clockRef.current!.textContent = DEFAULT_TIME;
    }

    stopClock() {
        this.running = false;
        clearInterval(this.secondInterval);
    }

    getCurrentTimeMs = () => {
        return this.currentTimeMs;
    }

    render() {
        return (
            <div
                ref={this.clockRef}
                className="clock"
            >
                {DEFAULT_TIME}
            </div>
        );
    }
}
