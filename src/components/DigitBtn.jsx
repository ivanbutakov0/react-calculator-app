import { ACTIONS } from '../ACTIONS'

export default function DigitBtn({ digit, className, dispatch }) {
	return (
		<button
			className={className}
			onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
		>
			{digit}
		</button>
	)
}
