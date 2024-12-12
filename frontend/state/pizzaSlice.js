import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const BASE_URL = 'http://localhost:9009/api/pizza'

export const fetchOrders = createAsyncThunk(
    'pizza/fetchOrders',
    async () => {
        const response = await axios.get(`${BASE_URL}/history`);
        // Transform the data to match expected format
        const transformedData = response.data.map(order => {
            return {
                ...order,
                fullName: order.customer,
                toppings: order.toppings || [] // Ensure toppings is always an array
            };
        });
        return transformedData;
    }
);

export const submitOrder = createAsyncThunk(
    'pizza/submitOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/order`, orderData)
            // Instead of transforming toppings to names, keep the IDs
            return {
                ...response.data,
                toppings: orderData.toppings || [] // Keep the original toppings array
            }
        } catch (err) {
            if (err.response?.status === 422) {
                return rejectWithValue(err.response.data)
            }
            throw err;
        }
    }
);

const initialState = {
    orders: [],
    sizeFilter: 'All',
    isLoading: false,
    error: null,
    orderInProgress: false,
    orderError: null
};

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        setSizeFilter: (state, action) => {
            state.sizeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchOrders.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
            state.error = null;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(submitOrder.pending, (state) => {
            state.orderInProgress = true;
            state.orderError = null;
        })
        .addCase(submitOrder.fulfilled, (state) => {
            state.orderInProgress = false;
            state.orderError = null;
        })
        .addCase(submitOrder.rejected, (state, action) => {
            state.orderInProgress = false;
            state.orderError = action.payload?.message || action.error.message;
        });
    }
});

export const { setSizeFilter } = pizzaSlice.actions;
export const pizzaReducer = pizzaSlice.reducer;

export const selectOrders = state => state.pizza.orders;
export const selectSizeFilter = state => state.pizza.sizeFilter;
export const selectFilteredOrders = state => {
    const filter = state.pizza.sizeFilter;
    return filter === 'All'
    ? state.pizza.orders
    : state.pizza.orders.filter(order => order.size === filter);
};
export const selectOrderInProgress = state => state.pizza.orderInProgress;
export const selectOrderError = state => state.pizza.orderError;