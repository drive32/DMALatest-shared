import { create } from 'zustand';

interface SidebarStore {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  removeCollapse: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: true,
  toggleCollapse: () => set((state) => ({ isCollapsed: false })),
  removeCollapse: () => set((state) => ({ isCollapsed: true })),
}));