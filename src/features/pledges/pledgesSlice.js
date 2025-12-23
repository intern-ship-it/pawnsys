import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pledges: [],
  selectedPledge: null,
  currentStep: 1,
  draftPledge: {
    customer: null,
    items: [],
    valuation: null,
    payoutMethod: null,
    signature: null,
  },
  loading: false,
  error: null,
}

const pledgesSlice = createSlice({
  name: 'pledges',
  initialState,
  reducers: {
    setPledges: (state, action) => {
      state.pledges = action.payload
    },
    addPledge: (state, action) => {
      state.pledges.push(action.payload)
    },
    updatePledge: (state, action) => {
      const index = state.pledges.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.pledges[index] = action.payload
      }
    },
    setSelectedPledge: (state, action) => {
      state.selectedPledge = action.payload
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    updateDraftPledge: (state, action) => {
      state.draftPledge = { ...state.draftPledge, ...action.payload }
    },
    resetDraftPledge: (state) => {
      state.draftPledge = initialState.draftPledge
      state.currentStep = 1
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  setPledges,
  addPledge,
  updatePledge,
  setSelectedPledge,
  setCurrentStep,
  updateDraftPledge,
  resetDraftPledge,
  setLoading,
} = pledgesSlice.actions
export default pledgesSlice.reducer
