import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export type SavedRestaurant = {
  id: number;
  index: number;
  isHidden: boolean;
};

export interface State {
  darkTheme: boolean;
  retardMode: boolean;
  filipMode: boolean;
  retardScale: number;
  restaurantOrder: SavedRestaurant[];
  awpVisible: boolean;
  awpCorner: string;
  backgroundFlashing: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

const restaurantOrderFromLocalStorage = (order: string | null): SavedRestaurant[] => {
  if (!order) {
    return [];
  }
  try {
    const parsed = JSON.parse(order);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item: Partial<SavedRestaurant>, index: number) => ({
      id: typeof item.id === "number" ? item.id : -1,
      index: typeof item.index === "number" ? item.index : typeof index === "number" ? index : 0,
      isHidden: typeof item.isHidden === "boolean" ? item.isHidden : false,
    }));
  } catch {
    return [];
  }
};

const storeRestaurantOrder = (order: SavedRestaurant[]): void => {
  globalThis.localStorage.setItem("restaurantOrder", JSON.stringify(order));
};

export const store = createStore<State>({
  state: {
    darkTheme: globalThis.localStorage.getItem("darkTheme") === "true" || false,
    retardMode: globalThis.localStorage.getItem("retardMode") === "true" || false,
    filipMode: globalThis.localStorage.getItem("filipMode") === "true" || false,
    retardScale: (() => {
      const value = globalThis.localStorage.getItem("retardScale");
      if (value === null) {
        return 1;
      }
      return parseFloat(value);
    })(),
    restaurantOrder: restaurantOrderFromLocalStorage(globalThis.localStorage.getItem("restaurantOrder")),
    awpVisible: false,
    awpCorner: "bottom-left",
    backgroundFlashing: false,
  },
  mutations: {
    setAwpVisible(state: State, value: boolean) {
      state.awpVisible = value;
    },
    setAwpCorner(state: State, corner: string) {
      state.awpCorner = corner;
    },
    setBackgroundFlashing(state: State, value: boolean) {
      state.backgroundFlashing = value;
    },
    toggleDarkTheme(state: State) {
      state.darkTheme = !state.darkTheme;
      globalThis.localStorage.setItem("darkTheme", state.darkTheme ? "true" : "false");
    },
    toggleRetardMode(state: State) {
      state.retardMode = !state.retardMode;
      if (state.retardMode) {
        state.filipMode = false;
        globalThis.localStorage.setItem("filipMode", "false");
      }
      globalThis.localStorage.setItem("retardMode", state.retardMode ? "true" : "false");
    },
    setRetardScale(state: State, value: number) {
      state.retardScale = value;
      globalThis.localStorage.setItem("retardScale", String(value));
    },
    updateRestaurantOrder(
      state: State,
      payload: {
        id: number;
        newIndex: number;
        oldIndex: number;
        swapId: number;
      },
    ) {
      const { id, newIndex, oldIndex, swapId } = payload;
      const target = state.restaurantOrder.find((item) => item.id === id);
      const swapTarget = state.restaurantOrder.find((item) => item.id === swapId);
      if (!target || !swapTarget) {
        return;
      }
      target.index = newIndex;
      swapTarget.index = oldIndex;
      storeRestaurantOrder(state.restaurantOrder);
    },
    setRestaurantOrder(state: State, payload: SavedRestaurant[]) {
      state.restaurantOrder = payload;
      storeRestaurantOrder(state.restaurantOrder);
    },
    setRestaurantHidden(state: State, id: number) {
      const target = state.restaurantOrder.find((item) => item.id === id);
      if (!target) {
        return;
      }
      target.isHidden = true;
      storeRestaurantOrder(state.restaurantOrder);
    },
    setRestaurantVisible(state: State, id: number) {
      const target = state.restaurantOrder.find((item) => item.id === id);
      if (!target) {
        return;
      }
      target.isHidden = false;
      storeRestaurantOrder(state.restaurantOrder);
    },
    toggleFilipMode(state: State) {
      state.filipMode = !state.filipMode;
      if (state.filipMode) {
        state.retardMode = false;
        globalThis.localStorage.setItem("retardMode", "false");
      }
      globalThis.localStorage.setItem("filipMode", state.filipMode ? "true" : "false");
    },
  },
});
