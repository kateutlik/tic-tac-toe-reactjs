import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.winner + " square"}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a] + ' is winner',
                line: lines[i]
            };
        }
    }

    return squares.includes(null) ? null : { winner: 'Draw', line: [] };
}

class Board extends React.Component {
    renderSquare(i, winner) {
        return (
            <Square key={i}
                winner={winner}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        const board = [...Array(this.props.size)].map((value, i) => {
            return (
                <div className="board-row">
                    {[...Array(this.props.size)].map((value, j) => {
                        const index = i * this.props.size + j;
                        const winner = this.props.winnerLine.indexOf(index) !== -1 ? 'winner' : '';

                        return this.renderSquare(index, winner);
                    })}
                </div>
            );
        });

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                move: 0,
                squares: Array(9).fill(null),
                stepPositionX: null,
                stepPositionY: null,
            }],
            sort: true,
            stepNumber: 0,
            xIsNext: true,
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);

        if (winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                move: history.length,
                squares: squares,
                stepPositionX: parseInt(i / 3),
                stepPositionY: parseInt(i % 3),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    sortMoves() {
        this.setState({
            sort: !this.state.sort,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const winnerLine = winner ? winner.line : [];
        const sortedHistory = this.state.sort ? [...history] : [...history].reverse();

        const moves = sortedHistory.map((step, move) => {
            const className = step.move === this.state.stepNumber ? 'bold' : '';
            const desc = step.move ? 'Go to move #' + step.move + ' (' + step.stepPositionY + ',' + step.stepPositionX + ')' : 'Go to game start';

            return (
                <li key={step.move}>
                    <button className={className}
                            onClick={() => this.jumpTo(step.move)}>
                        {desc}
                    </button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Result: ' + winner.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board size={3}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.sortMoves()}>
                        {this.state.sort ? 'ascending ↑' : 'descending ↓'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
