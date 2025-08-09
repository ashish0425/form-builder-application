import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema, FormField, FormState } from '../../types/form';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/localStorage';

const initialState: FormState = {
  currentForm: null,
  savedForms: loadFromLocalStorage('savedForms') || [],
  previewData: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    createNewForm: (state) => {
      state.currentForm = {
        id: Date.now().toString(),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      };
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      if (state.currentForm) {
        const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.currentForm.fields[index] = { ...state.currentForm.fields[index], ...action.payload.field };
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      }
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const [removed] = state.currentForm.fields.splice(fromIndex, 1);
        state.currentForm.fields.splice(toIndex, 0, removed);
      }
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        const existingIndex = state.savedForms.findIndex(f => f.id === state.currentForm!.id);
        if (existingIndex !== -1) {
          state.savedForms[existingIndex] = state.currentForm;
        } else {
          state.savedForms.push(state.currentForm);
        }
        saveToLocalStorage('savedForms', state.savedForms);
      }
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = form;
      }
    },
    updatePreviewData: (state, action: PayloadAction<Record<string, any>>) => {
      state.previewData = { ...state.previewData, ...action.payload };
    },
  },
});

export const { createNewForm, addField, updateField, deleteField, reorderFields, saveForm, loadForm, updatePreviewData } = formSlice.actions;
export default formSlice.reducer;