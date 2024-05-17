import React, { createRef } from 'react';
import { Game, Score } from './components/Game';
import { Message, messageService } from './components/Message';
import { Menu } from './components/Menu';
import './App.css';

export class App extends React.PureComponent {
    menu = createRef<Menu>();

    game = createRef<Game>();

    highestScore: Score | null = null;

    componentDidMount(): void {
        this.menu.current!.focus();
    }

    onStartButton = (discCount: number) => {
        this.startGame(discCount);
    }

    onBackButton = () => {
        this.endGame();
    }

    onGameWin = (score?: Score) => {
        this.gameWin(score);
    }

    startGame(discCount: number) {
        const { menu, game } = this;
        menu.current!.hide();
        game.current!.show();
        game.current!.startGame(discCount);
        game.current!.focus();
    }

    endGame() {
        const { menu, game } = this;
        game.current!.hide();
        game.current!.resetGame();
        menu.current!.show();
        menu.current!.focus();
    }

    gameWin(score?: Score) {
        if (score) this.setHighestScore(score);
        this.endGame();
    }

    setHighestScore(currentScore: Score) {
        const { highestScore } = this;
        if (highestScore) {
            if (currentScore.movesCount < highestScore.movesCount ||
                (
                    currentScore.movesCount < highestScore.movesCount &&
                    currentScore.gameTimeMs < highestScore.gameTimeMs
                )
            ) {
                this.highestScore = currentScore;
            }
        } else {
            this.highestScore = currentScore;
        }
        this.menu.current!.setHighestScore(this.highestScore!);
    }

    render() {
        return (
            <>
                <Menu
                    ref={this.menu}
                    onStartButton={this.onStartButton}
                />
                <Game
                    ref={this.game}
                    onBackButton={this.onBackButton}
                    onGameWin={this.onGameWin}
                />
                <Message ref={messageService} />
            </>
        );
    }
}

export default App;
