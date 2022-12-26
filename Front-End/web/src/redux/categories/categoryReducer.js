/* eslint-disable camelcase */
/* eslint-disable max-len */
// categoryReducer.js
import { createAsyncThunk } from '@reduxjs/toolkit';

//const baseURL = "http://localhost:3001/api"; //localhost
const baseURL = "https://pacientesmongo-back.vercel.app/api";

// Actions... types
const GET_CATEGORIES = 'spaceTravelHub/categories/GET_CATEGORIES';
const JOIN_CATEGORIES = 'spaceTravelHub/categories/JOIN_CATEGORIES';

// Reducer
export default function reducer(state = [], action) {
  switch (action.type) {
    // do reducer stuff
    // GET categories from the API
    case `${GET_CATEGORIES}/fulfilled`:
      return action.payload;
    // Implement category joining
    case JOIN_CATEGORIES: {
      const newState = state.map((mission) => {
        if (mission.mission_id !== action.payload) {
          return mission;
        } if (mission.reserved) {
          return { ...mission, reserved: false };
        }
        return { ...mission, reserved: true };
      });
      return newState; }
    default: return state;
  }
}

// Action Creators
export const getCategories = createAsyncThunk(GET_CATEGORIES, async () => {
  const getCategoriesUrl = baseURL + "/categories";
  const response = await fetch(getCategoriesUrl,
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
      },
    });
  const result = await response.json();

  return result;
}); /* getMissions - createAsyncThunk - API */

export function joinCategories(obj) {
  return { type: JOIN_CATEGORIES, payload: obj };
} /* joinCategories */
