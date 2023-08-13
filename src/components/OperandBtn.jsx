import { ACTIONS } from '../ACTIONS'

export default function OperandBtn({ operand, className, dispatch }) {
	return (
		<button
			className={className}
			onClick={() =>
				dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operand } })
			}
		>
			{operand}
		</button>
	)
}
