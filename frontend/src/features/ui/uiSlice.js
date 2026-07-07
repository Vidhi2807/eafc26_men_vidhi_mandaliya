import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('eafc_theme') || 'dark';
const storedSidebarState = localStorage.getItem('eafc_sidebar_collapsed') === 'true';

const initialState = {
  theme: storedTheme,
  sidebarCollapsed: storedSidebarState,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('eafc_sidebar_collapsed', state.sidebarCollapsed.toString());
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('eafc_sidebar_collapsed', state.sidebarCollapsed.toString());
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('eafc_theme', state.theme);
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, toggleTheme, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
