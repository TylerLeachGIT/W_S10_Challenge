import React, { useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitOrder, fetchOrders, selectOrderInProgress, selectOrderError } from '../state/pizzaSlice'

const TOPPINGS = [
  { id: '1', name: 'Pepperoni' },
  { id: '2', name: 'Green peppers' },
  { id: '3', name: 'Pineapple' },
  { id: '4', name: 'Mushrooms' },
  { id: '5', name: 'Ham' }
];

const initialFormState = {
  fullName: '',
  size: '',
  toppings: []
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
    return { ...state, [action.field]: action.value };
    case 'TOGGLE_TOPPING':
      return {
        ...state,
        toppings: state.toppings.includes(action.topping)
        ? state.toppings.filter(t => t !== action.topping)
        : [...state.toppings, action.topping]
      };
      case 'RESET':
        return initialFormState;
        default:
          return state;
  }
}


export default function PizzaForm() {
  const dispatch = useDispatch();
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const orderInProgress = useSelector(selectOrderInProgress);
  const orderError = useSelector(selectOrderError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(submitOrder(formState));
      if (result.meta.requestStatus === 'fulfilled') {
        formDispatch({ type: 'RESET' });
        await dispatch(fetchOrders());
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className='pizza-form'>
      <h2>Pizza Form</h2>
      {orderInProgress && <div className='pending'>Order in progress...</div>}
      {orderError && <div className='failure'>{orderError}</div>}


      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={formState.fullName}
            onChange={e => formDispatch({
              type: 'SET_FIELD',
              field: 'fullName',
              value: e.target.value
            })}
          />
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
           data-testid="sizeSelect"
           id="size"
           name="size"
           value={formState.size}
           onChange={e => formDispatch({
            type: 'SET_FIELD',
            field: 'size',
            value: e.target.value
           })}
           >
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>

      <div className="input-group">
  {TOPPINGS.map(topping => (
    <label key={topping.id}>
      <input
        data-testid={`check${topping.name === 'Green peppers' ? 'Greenpeppers' : topping.name}`}
        name={topping.id}
        type="checkbox"
        checked={formState.toppings.includes(topping.id)}
        onChange={() => formDispatch({
          type: 'TOGGLE_TOPPING',
          topping: topping.id
        })}
      />
      {topping.name}<br />
    </label>
  ))}
</div>
      <input
       data-testid="submit"
       type="submit"
       disabled={orderInProgress}
      />
    </form>
  )
}
