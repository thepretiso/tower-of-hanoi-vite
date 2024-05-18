import React, { createRef, KeyboardEvent } from 'react';
import { IFocusable } from '../../interface';
import { MAX_DISC_COUNT } from '../../constants';
import { TRANSLATIONS } from '../../translations';
import { stopEvent } from '../../utils/stopEvent';
import { hanoiSolver, HanoiSolverStep } from './utils/hanoiSolver';
import { formatMilisecondsHHMMSS } from '../../utils/formatTime';
import { Navigation, NavigationType } from '../Navigation';
import { messageService } from '../Message';
import { Interactable } from '../Interactable';
import { getDiscWidth } from './utils/getDiscWidth';
import { Rod, RodTypes } from './Rod';
import { Disc } from './Disc';
import { Props } from './interface';
import { Clock } from './Clock';
import './Game.css';

const RODS: RodTypes[] = ['source', 'temporary', 'destination'];

const AUTO_RESOLVING_STEP_MS = 600;
const WIN_GAME_DIALOG_TIMEOUT_MS = 600;

export class Game extends React.PureComponent<Props> implements IFocusable {
    domRef = createRef<HTMLDivElement>();

    gameNavigation = createRef<Navigation>();

    headerControlsNavigation = createRef<Navigation>();

    gameContainerNavigation = createRef<Navigation>();

    clock = createRef<Clock>();

    backButton = createRef<HTMLDivElement>();

    restartButton = createRef<HTMLDivElement>();

    solveButton = createRef<HTMLDivElement>();

    movesCounterText = createRef<HTMLDivElement>();

    allDiscRefs: React.RefObject<Disc>[] = [];

    discRefs: React.RefObject<Disc>[] = [];

    activeDisc: React.RefObject<Disc> | null = null;

    activeRod: React.RefObject<Rod> | null = null;

    movesCounter = 0;

    isAutoSolving = false;

    autoSolvingUsed = false;

    autoSolveFirstTry = true;

    autoSolvingInterval = 0;

    rodRefs: Record<RodTypes, React.RefObject<Rod>> = {
        source: createRef<Rod>(),
        temporary: createRef<Rod>(),
        destination: createRef<Rod>(),
    };

    onRestartPress = () => {
        this.resetGame();
        this.startGame(this.discRefs.length);
        this.gameContainerNavigation.current!.focus();
    }

    onAutoSolvePress = () => {
        if (!this.isAutoSolving) {
            this.autoSolve();
        } else {
            this.stopAutoSolving();
        }
    }

    onDiscPress = (value: number, currentRod: RodTypes) => {
        this.startMove(value, currentRod);
    }

    onRodPress = (type: RodTypes) => {
        this.finishMove(type);
    }

    onGameContainerKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Backspace') {
            this.deactivateMove();
            stopEvent(event);
        }
    }

    getTopDiscs() {
        const topDiscs: React.RefObject<Disc>[] = [];
        RODS.forEach((type) => {
            const rod = this.rodRefs[type];
            const topDisk = rod.current!.getTopDisc();
            if (topDisk) topDiscs.push(topDisk);
        });
        return topDiscs;
    }

    useDiscs(discCount: number) {
        this.discRefs = [];
        for (let i = 0; i < discCount; i++) {
            const disc = this.allDiscRefs[i];
            disc.current!.setWidth(getDiscWidth(i, discCount));
            this.discRefs.push(disc);
        }
        for (let i = discCount; i < this.allDiscRefs.length; i++) {
            const disc = this.allDiscRefs[i];
            disc.current!.update(-1000, -1000, 'source');
        }
    }

    checkForFullDiscsOnRod(type: RodTypes) {
        const rod = this.rodRefs[type];
        return rod.current!.getDiscRefs().length === this.discRefs.length;
    }

    startGame(discCount: number) {
        const sourceRod = this.rodRefs.source;
        this.useDiscs(discCount);
        for (let i = discCount - 1; i >= 0; i--) {
            sourceRod.current!.pushDisc(this.discRefs[i]);
        }
        this.disableMouseOnRods();
        this.enableMouseOnDiscs();
        this.gameContainerNavigation.current!.updateFocusableChildren(
            [...this.getTopDiscs()]
        );
        this.gameNavigation.current!.setFocusIndex(1);
    }

    resetGame() {
        this.autoSolvingUsed = false;
        RODS.forEach((type) => {
            this.rodRefs[type].current!.clear();
        });
        this.updateMovesCounter(0);
        this.clock.current!.resetClock();
        this.stopAutoSolving();
        this.disableMouseOnRods();
        this.enableMouseOnDiscs();
    }

    startMove(discValue: number, currentRod: RodTypes) {
        this.activeDisc = this.discRefs[discValue];
        this.activeRod = this.rodRefs[currentRod];
        const rodRefsArray = RODS.map((type) => {
            const rod = this.rodRefs[type];
            return rod;
        });
        this.enableMouseOnRods();
        this.disableMouseOnDiscs();
        this.gameContainerNavigation.current!.updateFocusableChildren(
            [...rodRefsArray]
        );
        this.gameContainerNavigation.current!.setFocusIndex(
            RODS.findIndex((type) => type === currentRod)
        );
        this.gameContainerNavigation.current!.focus();
        this.clock.current!.startClock();
    }

    finishMove(selectedRod: RodTypes) {
        const rod = this.rodRefs[selectedRod];
        if (rod.current!.pushDisc(this.activeDisc!)) {
            this.updateMovesCounter(this.movesCounter + 1);
            this.activeRod!.current!.popDisc();
        }
        this.deactivateMove();
        this.determineEndGame();
    }

    deactivateMove() {
        this.disableMouseOnRods();
        this.enableMouseOnDiscs();
        this.gameContainerNavigation.current!.updateFocusableChildren(
            [...this.getTopDiscs()]
        );
        if (this.activeDisc) {
            this.activeDisc.current!.deactivate();
            this.gameContainerNavigation.current!.focusChild(this.activeDisc);
        } else {
            this.gameContainerNavigation.current!.focus();
        }
        this.gameNavigation.current!.setFocusIndex(1);
        this.activeDisc = null;
        this.activeRod = null;
    }

    determineEndGame() {
        if (!this.checkForFullDiscsOnRod('destination')) return;
        const { onGameWin } = this.props;
        this.clock.current!.stopClock();
        setTimeout(() => { // it is not pleasant when dialog pops up immediately, this gives user a little pause before game ends
            if (this.autoSolvingUsed) {
                messageService.current!.open({
                    title: TRANSLATIONS.towerIsComplete,
                    text: TRANSLATIONS.autoSolveWin,
                    onConfirm: () => {
                        onGameWin();
                    }
                });
            } else {
                const gameTimeMs = this.clock.current!.getCurrentTimeMs();
                let winMessage = TRANSLATIONS.winMessage;
                winMessage = winMessage.replace('{moves}', this.movesCounter.toString());
                winMessage = winMessage.replace('{time}', formatMilisecondsHHMMSS(gameTimeMs));
                messageService.current!.open({
                    title: TRANSLATIONS.towerIsComplete,
                    text: winMessage,
                    onConfirm: () => {
                        onGameWin({
                            movesCount: this.movesCounter,
                            gameTimeMs,
                        });
                    }
                });
            }
        }, WIN_GAME_DIALOG_TIMEOUT_MS);
    }
    
    autoSolve() {
        if (this.checkForFullDiscsOnRod('source')) {
            if (this.autoSolveFirstTry) {
                messageService.current!.open({
                    title: TRANSLATIONS.autoSolve,
                    text: TRANSLATIONS.autoSolveFirstTryMessage,
                    onConfirm: () => {
                        this.startAutoSolving();
                    }
                });
            } else {
                this.startAutoSolving();
            }
        } else {
            messageService.current!.open({
                title: TRANSLATIONS.oops,
                text: TRANSLATIONS.autoSolveErrorMessage,
                onConfirm: () => {
                    this.headerControlsNavigation.current!.focus();
                }
            });
        }
    }

    startAutoSolving() {
        let index = 0;
        this.isAutoSolving = true;
        this.autoSolvingUsed = true;
        this.autoSolveFirstTry = false;
        this.disableMouseOnRods();
        this.disableMouseOnDiscs();
        this.gameContainerNavigation.current!.updateFocusableChildren([]);
        this.solveButton.current!.classList.add('resolving');
        this.clock.current!.startClock();
        const solverSteps: HanoiSolverStep[] = [];
        hanoiSolver(
            this.discRefs.length, 'source', 'temporary', 'destination', solverSteps,
        );
        this.autoSolvingInterval = setInterval(() => {
            if (index === solverSteps.length - 1) {
                this.stopAutoSolving();
                return;
            }
            const step = solverSteps[index];
            const fromRod = this.rodRefs[step.fromRod];
            const toRod = this.rodRefs[step.toRod];
            toRod.current!.pushDisc(fromRod.current!.popDisc()!);
            this.updateMovesCounter(this.movesCounter + 1);
            index += 1;
        }, AUTO_RESOLVING_STEP_MS);
    }

    stopAutoSolving() {
        this.isAutoSolving = false;
        this.solveButton.current!.classList.remove('resolving');
        clearInterval(this.autoSolvingInterval);
        this.deactivateMove();
    }

    enableMouseOnRods() {
        RODS.forEach((type) => {
            const rod = this.rodRefs[type];
            rod.current!.enableMouseFocus();
        });
    }

    disableMouseOnRods() {
        RODS.forEach((type) => {
            const rod = this.rodRefs[type];
            rod.current!.disableMouseFocus();
        });
    }

    enableMouseOnDiscs() {
        const topDiscs = this.getTopDiscs();
        const restDiscs = this.discRefs.filter(
            (disc) => topDiscs.indexOf(disc) === -1
        );
        topDiscs.forEach((disc) => {
            disc.current!.enableMouseFocus();
        });
        restDiscs.forEach((disc) => {
            disc.current!.disableMouseFocus();
        });
    }

    disableMouseOnDiscs() {
        this.discRefs.forEach((disc) => {
            disc.current!.disableMouseFocus();
        });
    }

    show() {
        this.domRef.current!.classList.add('visible');
    }

    hide() {
        this.domRef.current!.classList.remove('visible');
    }

    focus() {
        this.gameContainerNavigation.current!.focus();
    }

    updateMovesCounter(movesCounter: number) {
        this.movesCounter = movesCounter;
        this.movesCounterText.current!.textContent = `${TRANSLATIONS.moves}: ${movesCounter}`;
    }

    renderRods() {
        const rods: JSX.Element[] = [];
        RODS.forEach((type) => {
            rods.push(
                <Rod
                    ref={this.rodRefs[type]}
                    type={type}
                    onPress={this.onRodPress}
                />
            );
        });
        return rods;
    }

    renderDiscs() {
        const discs: JSX.Element[] = [];
        for (let i = 0; i < MAX_DISC_COUNT; i++) {
            const ref = createRef<Disc>();
            discs.push(
                <Disc
                    ref={ref}
                    value={i}
                    currentRod="source"
                    onPress={this.onDiscPress}
                />
            );
            this.allDiscRefs.push(ref);
        }
        return discs;
    }

    render() {
        const { onBackButton } = this.props;
        return (
            <div ref={this.domRef} className="game">
                <Navigation
                    ref={this.gameNavigation}
                    navigationType={NavigationType.VERTICAL}
                    focusableChildren={
                        [this.headerControlsNavigation, this.gameContainerNavigation]
                    }
                >
                    <Navigation
                        ref={this.headerControlsNavigation}
                        className="header-controls"
                        navigationType={NavigationType.HORIZONTAL}
                        focusableChildren={
                            [this.backButton, this.restartButton, this.solveButton]
                        }
                    >
                        <Interactable
                            ref={this.backButton}
                            className="button"
                            onPress={onBackButton}
                        >
                            {TRANSLATIONS.back}
                        </Interactable>
                        <Interactable
                            ref={this.restartButton}
                            className="button"
                            onPress={this.onRestartPress}
                        >
                            {TRANSLATIONS.restart}
                        </Interactable>
                        <Interactable
                            ref={this.solveButton}
                            className="button auto-solve-button"
                            onPress={this.onAutoSolvePress}
                        >
                            {TRANSLATIONS.autoSolve}
                        </Interactable>
                        <div
                            ref={this.movesCounterText}
                            className="moves-counter"
                        >
                            {`${TRANSLATIONS.moves}: 0`}
                        </div>
                        <Clock ref={this.clock} />
                    </Navigation>
                    <div
                        className="game-container"
                        onKeyDown={this.onGameContainerKeyDown}
                    >
                        <Navigation
                            ref={this.gameContainerNavigation}
                            navigationType={NavigationType.HORIZONTAL}
                            focusableChildren={[]}
                        >
                            {this.renderRods()}
                            {this.renderDiscs()}
                        </Navigation>
                    </div>
                </Navigation>
            </div>
        )
    }
}
