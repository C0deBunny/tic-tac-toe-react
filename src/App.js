import { useState } from "react"

function Square({ value, onSquareClick, className }) {
	//Adds class to winningTiles
	return (
		<button className={"square " + className} onClick={onSquareClick}>
			{value}
		</button>
	)
}

// function Board({ xIsNext, squares, onPlay }) {
// 	function handleClick(i) {
// 		if (squares[i] || calculateWinner(squares)) return

// 		const nextSquares = squares.slice()
// 		if (xIsNext) {
// 			nextSquares[i] = "X"
// 		} else {
// 			nextSquares[i] = "O"
// 		}
// 		onPlay(nextSquares)
// 	}

// 	const winner = calculateWinner(squares)
// 	let status
// 	if (winner) {
// 		status = `Winner: ${winner}`
// 	} else {
// 		status = `Next player: ${xIsNext ? "X" : "O"}`
// 	}

// 	return (
// 		<>
// 			<div className="status">{status}</div>
// 			<div className="board-row">
// 				<Square
// 					value={squares[0]}
// 					onSquareClick={() => handleClick(0)}
// 				/>
// 				<Square
// 					value={squares[1]}
// 					onSquareClick={() => handleClick(1)}
// 				/>
// 				<Square
// 					value={squares[2]}
// 					onSquareClick={() => handleClick(2)}
// 				/>
// 			</div>
// 			<div className="board-row">
// 				<Square
// 					value={squares[3]}
// 					onSquareClick={() => handleClick(3)}
// 				/>
// 				<Square
// 					value={squares[4]}
// 					onSquareClick={() => handleClick(4)}
// 				/>
// 				<Square
// 					value={squares[5]}
// 					onSquareClick={() => handleClick(5)}
// 				/>
// 			</div>
// 			<div className="board-row">
// 				<Square
// 					value={squares[6]}
// 					onSquareClick={() => handleClick(6)}
// 				/>
// 				<Square
// 					value={squares[7]}
// 					onSquareClick={() => handleClick(7)}
// 				/>
// 				<Square
// 					value={squares[8]}
// 					onSquareClick={() => handleClick(8)}
// 				/>
// 			</div>
// 		</>
// 	)
// }

function NewBoard({ xIsNext, squares, onPlay }) {
	// Destructuring of winner calculation with defaults to no winner
	const { winner = null, winningTiles = [] } = calculateWinner(squares) || {}

	function handleClick(i) {
		if (squares[i] || winner) return

		const nextSquares = squares.slice()
		if (xIsNext) {
			nextSquares[i] = "X"
		} else {
			nextSquares[i] = "O"
		}
		onPlay(nextSquares)
	}

	let status
	if (winner) {
		status = `Winner: ${winner}`
	} else {
		status = `Next player: ${xIsNext ? "X" : "O"}`
	}

	const grid = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
	]

	// Gives className to squares that include winningTiles
	return (
		<>
			<div className="status">{status}</div>
			{grid.map((row, rowIndex) => (
				<div key={rowIndex} className="board-row">
					{row.map((num, numIndex) => (
						<Square
							key={numIndex}
							value={squares[num]}
							onSquareClick={() => handleClick(num)}
							className={
								winningTiles.includes(num) ? "winningTile" : ""
							}
						/>
					))}
				</div>
			))}
		</>
	)
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState(0)
	const [ascending, setAscending] = useState(true)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove]

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove)
	}

	const moves = history.map((squares, move) => {
		let description
		if (move > 0) {
			description = `Go to move #${move}`
		} else {
			description = "Go to game start"
		}

		// Ternary to replace current move button with "You are at move #" text
		return (
			<li key={move}>
				{move === currentMove ? (
					<div>You are at move #{move + 1}</div>
				) : (
					<button onClick={() => jumpTo(move)}>{description}</button>
				)}
			</li>
		)
	})

	const sortedMoves = ascending ? moves : [...moves].reverse()

	return (
		<div className="game">
			<div className="game-board">
				<NewBoard
					xIsNext={xIsNext}
					squares={currentSquares}
					onPlay={handlePlay}
				/>
			</div>
			<div className="game-info">
				<button
					className="sort-button"
					onClick={() => setAscending((a) => !a)}
				>
					{ascending ? "descending" : "ascending"} order
				</button>
				<ul>{sortedMoves}</ul>
			</div>
		</div>
	)
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
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[c] === squares[a]
		) {
			// Changed to object to give information about winner and winningTiles
			return { winner: squares[a], winningTiles: lines[i] }
		}
	}

	return null
}
