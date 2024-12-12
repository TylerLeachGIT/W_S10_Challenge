import React, { useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrders, setSizeFilter, selectFilteredOrders, selectSizeFilter } from '../state/pizzaSlice'

const TOPPINGS = {
  '1': 'Pepperoni',
  '2': 'Green Peppers',
  '3': 'Pineapple',
  '4': 'Mushrooms',
  '5': 'Ham'
};

export default function OrderList() {
  const dispatch = useDispatch()
  const orders = useSelector(selectFilteredOrders)
  const currentFilter = useSelector(selectSizeFilter)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const formatToppings = (toppings) => {
    if (!toppings?.length) return 'no toppings';
    if (toppings.length > 3) {
        return `${toppings.length} toppings`;
    }
    return toppings.map(id => TOPPINGS[id]).join(', ');
  };

  return (
    <div className="order-list">
      <h2>Pizza Orders</h2>
      <div className='size-filters'>
        <button
          data-testid="filterBtnAll"
          onClick={() => dispatch(setSizeFilter('All'))}
          className={currentFilter === 'All' ? 'active' : ''}
        >
          All
        </button>
        <button
          data-testid="filterBtnS"
          onClick={() => dispatch(setSizeFilter('S'))}
          className={currentFilter === 'S' ? 'active' : ''}
        >
          S
        </button>
        <button
          data-testid="filterBtnM"
          onClick={() => dispatch(setSizeFilter('M'))}
          className={currentFilter === 'M' ? 'active' : ''}
        >
          M
        </button>
        <button
          data-testid="filterBtnL"
          onClick={() => dispatch(setSizeFilter('L'))}
          className={currentFilter === 'L' ? 'active' : ''}
        >
          L
        </button>
      </div>
      <div className='orders'>
        {orders.map((order, idx) => (
          <div key={idx} className='order'>
              <p>
                {order.fullName} ordered a size {order.size} with {formatToppings(order.toppings)}
              </p>
          </div>
        ))}
      </div>
    </div>
  );
}