import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants/index";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 定义窗口状态类型
interface WindowState {
  isOpen: boolean;
  zIndex: number;
  data: unknown;
}

// 定义所有窗口的类型
interface WindowsConfig {
  [key: string]: WindowState;
}

// 定义 Store 的状态类型
interface WindowStore {
  windows: WindowsConfig;
  nextZIndex: number;
  openWindow: (windowKey: string, data?: unknown) => void;
  closeWindow: (windowKey: string) => void;
  focusWindow: (windowKey: string) => void;
}

const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey: string, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (win) {
          win.isOpen = true;
          win.zIndex = state.nextZIndex;
          win.data = data ?? win.data;
          state.nextZIndex++;
        }
      }),
    closeWindow: (windowKey: string) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (win) {
          win.isOpen = false;
          win.zIndex = INITIAL_Z_INDEX;
          win.data = null;
        }
      }),
    focusWindow: (windowKey: string) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (win) {
          win.zIndex = state.nextZIndex++;
        }
      }),
  }))
);

export default useWindowStore;
