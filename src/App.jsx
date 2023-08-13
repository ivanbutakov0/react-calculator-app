import { useReducer } from 'react'
import { ACTIONS } from './ACTIONS'
import DigitBtn from './components/DigitBtn'
import OperandBtn from './components/OperandBtn'
import './style.css'

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOperand: payload.digit,
				}
			}
			if (payload.digit === '0' && state.currentOperand === '0') {
				return state
			}
			if (payload.digit === '.' && state.currentOperand == null) {
				return state
			}
			if (payload.digit === '.' && state.currentOperand.includes('.')) {
				return state
			}
			return {
				...state,
				currentOperand: `${state.currentOperand || ''}${payload.digit}`,
			}

		case ACTIONS.CHOOSE_OPERATION:
			if (state.previousOperand == null && state.currentOperand == null) {
				return state
			}
			if (state.previousOperand == null) {
				return {
					...state,
					previousOperand: state.currentOperand,
					operation: payload.operand,
					currentOperand: null,
				}
			}

			if (state.currentOperand == null) {
				return {
					...state,
					operation: payload.operand,
				}
			}
			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operand,
				currentOperand: null,
			}

		case ACTIONS.CLEAR:
			return {}

		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOperand: null,
				}
			}
			if (state.currentOperand == null) {
				return state
			}
			if (state.currentOperand.length == 1) {
				return {
					...state,
					currentOperand: null,
				}
			}

			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1),
			}

		case ACTIONS.EVALUATE:
			if (
				state.currentOperand == null ||
				state.previousOperand == null ||
				state.operation == null
			) {
				return state
			}

			return {
				...state,
				overwrite: true,
				previousOperand: null,
				operation: null,
				currentOperand: evaluate(state),
			}
	}
}

function evaluate({ currentOperand, previousOperand, operation }) {
	const prev = parseFloat(previousOperand)
	const current = parseFloat(currentOperand)
	if (isNaN(prev) || isNaN(current)) return ''
	let computation = ''
	switch (operation) {
		case '+':
			computation = prev + current
			break
		case '–':
			computation = prev - current
			break
		case '*':
			computation = prev * current
			break
		case '/':
			computation = prev / current
			break
	}
	return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
	maximumFractionDigits: 0,
})

function formatOperand(operand) {
	if (operand == null) return
	const [integer, decimal] = operand.split('.')
	if (decimal == null) return INTEGER_FORMATTER.format(integer)
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
		reducer,
		{}
	)
	console.log(currentOperand)

	return (
		<div className='calculator-grid'>
			<div className='screen'>
				<div className='previous-operand'>
					{formatOperand(previousOperand)} {operation}
				</div>
				<div className='current-operand'>{formatOperand(currentOperand)}</div>
			</div>
			<button
				className='clr-primary'
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}
			>
				AC
			</button>
			<OperandBtn className='clr-primary' operand={'÷'} dispatch={dispatch} />
			<OperandBtn className='clr-primary' operand={'×'} dispatch={dispatch} />
			<button
				className='bg-primary'
				onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
			>
				DEL
			</button>
			<DigitBtn digit={'7'} dispatch={dispatch} />
			<DigitBtn digit={'8'} dispatch={dispatch} />
			<DigitBtn digit={'9'} dispatch={dispatch} />
			<OperandBtn className='bg-primary' operand={'–'} dispatch={dispatch} />
			<DigitBtn digit={'4'} dispatch={dispatch} />
			<DigitBtn digit={'5'} dispatch={dispatch} />
			<DigitBtn digit={'6'} dispatch={dispatch} />
			<OperandBtn className='bg-primary' operand={'+'} dispatch={dispatch} />
			<DigitBtn digit={'1'} dispatch={dispatch} />
			<DigitBtn digit={'2'} dispatch={dispatch} />
			<DigitBtn digit={'3'} dispatch={dispatch} />
			<button
				className='row-span-two bg-primary'
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
			>
				=
			</button>
			<DigitBtn digit={'.'} dispatch={dispatch} />
			<DigitBtn className='col-span-two' digit={'0'} dispatch={dispatch} />
		</div>
	)
}

export default App
