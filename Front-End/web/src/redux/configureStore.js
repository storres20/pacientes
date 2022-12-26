import { configureStore } from '@reduxjs/toolkit';
//import logger from 'redux-logger';
//import rockets from './rockets/rocketSlice';
//import missions from './missions/missionSlice';
import categories from './categories/categoryReducer'

const store = configureStore({
  reducer: {
    categories
  },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;