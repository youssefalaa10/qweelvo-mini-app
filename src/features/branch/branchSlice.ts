import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Branch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  isOpen: boolean;
  distance?: string;
}

interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
}

const initialState: BranchState = {
  branches: [
    { id: '1', name: 'Downtown Branch', nameAr: 'فرع وسط المدينة', address: '123 Main St', addressAr: 'شارع الرئيسي 123', isOpen: true, distance: '1.2 km' },
    { id: '2', name: 'Mall Branch', nameAr: 'فرع المول', address: '456 Mall Ave', addressAr: 'شارع المول 456', isOpen: true, distance: '3.5 km' },
    { id: '3', name: 'Airport Branch', nameAr: 'فرع المطار', address: '789 Airport Rd', addressAr: 'طريق المطار 789', isOpen: false, distance: '12 km' },
  ],
  selectedBranch: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    selectBranch(state, action: PayloadAction<Branch>) {
      state.selectedBranch = action.payload;
    },
  },
});

export const { selectBranch } = branchSlice.actions;
export default branchSlice.reducer;
