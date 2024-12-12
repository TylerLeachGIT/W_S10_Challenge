import { configureStore } from '@reduxjs/toolkit';
import { pizzaReducer } from './pizzaSlice'


export const resetStore = () => configureStore({
  reducer: {
    pizza: pizzaReducer
  }
})

export const store = resetStore()