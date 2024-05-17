import React, { createRef } from 'react';
import { DEFAULT_DISC_COUNT, MAX_DISC_COUNT, MIN_DISC_COUNT } from '../../constants';
import { formatMilisecondsHHMMSS } from '../../utils/formatTime';
import { TRANSLATIONS } from '../../translations';
import { IFocusable } from '../../interface';
import { Navigation, NavigationType } from '../Navigation';
import { Interactable } from '../Interactable';
import { messageService } from '../Message';
import { Score } from '../Game';
import { Props } from './interface';
import './Menu.css';

export class Menu extends React.PureComponent<Props> implements IFocusable {

    domRef = createRef<HTMLDivElement>();

    startButton = createRef<HTMLDivElement>();

    aboutButton = createRef<HTMLDivElement>();

    increaseDiscCountButton = createRef<HTMLDivElement>();

    decreaseDiscCountButton = createRef<HTMLDivElement>();

    discCountText = createRef<HTMLDivElement>();

    highestScoreText = createRef<HTMLDivElement>();

    menuNavigation = createRef<Navigation>();

    discCountNavigation = createRef<Navigation>();

    discCount = DEFAULT_DISC_COUNT;

    componentDidMount(): void {
        this.menuNavigation.current!.setFocusIndex(1); // focus starts on start button
    }

    onIncreaseDiscCount = () => {
        if (this.discCount >= MAX_DISC_COUNT) return;
        this.discCount += 1;
        this.discCountText.current!.textContent = this.discCount.toString();
    }

    onDecreaseDiscCount = () => {
        if (this.discCount <= MIN_DISC_COUNT) return;
        this.discCount -= 1;
        this.discCountText.current!.textContent = this.discCount.toString();
    }

    onStartButton = () => {
        const { onStartButton } = this.props;
        onStartButton(this.discCount);
    }

    onInfoButton = () => {
        messageService.current!.open({
            title: TRANSLATIONS.info,
            text: TRANSLATIONS.infoMessage,
        });
    }

    setHighestScore({ movesCount, gameTimeMs }: Score) {
        let scoreText = TRANSLATIONS.highestScore;
        scoreText = scoreText.replace('{moves}', movesCount.toString());
        scoreText = scoreText.replace('{time}', formatMilisecondsHHMMSS(gameTimeMs));
        this.highestScoreText.current!.textContent = scoreText;
    }

    show() {
        this.domRef.current!.classList.add('visible');
    }

    hide() {
        this.domRef.current!.classList.remove('visible');
    }

    focus() {
        this.menuNavigation.current!.focus();
    }

    render() {
        return (
            <div ref={this.domRef} className="menu visible">
                <div className="game-title">
                    {TRANSLATIONS.gameTitle}
                </div>
                <Navigation
                    ref={this.menuNavigation}
                    navigationType={NavigationType.VERTICAL}
                    focusableChildren={
                        [this.discCountNavigation, this.startButton, this.aboutButton]
                    }
                >
                    <div className="disc-count-title">
                        {TRANSLATIONS.discCountTitle}
                    </div>
                    <Navigation
                        ref={this.discCountNavigation}
                        navigationType={NavigationType.HORIZONTAL}
                        className="disc-count-controls"
                        focusableChildren={
                            [this.decreaseDiscCountButton, this.increaseDiscCountButton]
                        }
                    >
                        <Interactable
                            ref={this.decreaseDiscCountButton}
                            className="button decrease-button"
                            onPress={this.onDecreaseDiscCount}
                        >
                            {TRANSLATIONS.decrease}
                        </Interactable>
                        <div
                            className="disc-count-value"
                            ref={this.discCountText}
                        >
                            {this.discCount}
                        </div>
                        <Interactable
                            ref={this.increaseDiscCountButton}
                            className="button increase-button"
                            onPress={this.onIncreaseDiscCount}
                        >
                            {TRANSLATIONS.increase}
                        </Interactable>
                    </Navigation>
                    <Interactable
                        ref={this.startButton}
                        className="button start-button"
                        onPress={this.onStartButton}
                    >
                        {TRANSLATIONS.startGame}
                    </Interactable>
                    <Interactable
                        ref={this.aboutButton}
                        className="button about-button"
                        onPress={this.onInfoButton}
                    >
                        {TRANSLATIONS.info}
                    </Interactable>
                </Navigation>
                <div ref={this.highestScoreText} className="highest-score" />
            </div>
        );
    }
}
