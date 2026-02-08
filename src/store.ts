import { InjectionKey } from "vue";
import { createStore, Store } from 'vuex';

export interface State {
    darkTheme: boolean
    retardMode: boolean
    restaurantOrder: Map<number, number>
}

export const key: InjectionKey<Store<State>> = Symbol();

const restaurantOrderFromLocalStorage = (order: string | null): Map<number, number> => {
    const map = new Map<number, number>();
    if (!order) {
        return map;
    }
    const entries = order.split(',');
    for (let i = 0; i < entries.length; i += 2) {
        const key = parseInt(entries[i]);
        const value = parseInt(entries[i + 1]);
        map.set(key, value);
    }
    return map;
}

const storeRestaurantOrder = (order: Map<number, number>): void => {
    let resultString = "";
    for (const [key, value] of order.entries()) {
        resultString += key.toString() + "," + value.toString() + ","
    }
    resultString = resultString.substring(0, resultString.length - 1);
    window.localStorage.setItem("restaurantOrder", resultString);
}

export const store = createStore<State>({
    state: {
        darkTheme: window.localStorage.getItem("darkTheme") === "true" ?? false,
        retardMode: window.localStorage.getItem("retardMode") === "true" ?? false,
        restaurantOrder: restaurantOrderFromLocalStorage(window.localStorage.getItem("restaurantOrder"))
    },
    mutations: {
        toggleDarkTheme(state: State) {
            state.darkTheme = !state.darkTheme;
            window.localStorage.setItem("darkTheme", state.darkTheme ? "true" : "false");
        },
        toggleRetardMode(state: State) {
            state.retardMode = !state.retardMode;
            window.localStorage.setItem("retardMode", state.retardMode ? "true" : "false");
        },
        updateRestaurantOrder(state: State, payload: { id: number, newIndex: number, oldIndex: number, swapId: number }) {
            const { id, newIndex, oldIndex, swapId } = payload;
            state.restaurantOrder.set(swapId, oldIndex!);
            state.restaurantOrder.set(id, newIndex);
            storeRestaurantOrder(state.restaurantOrder);
        },
        setRestaurantOrder(state: State, payload: Map<number, number>) {
            state.restaurantOrder = payload
            storeRestaurantOrder(state.restaurantOrder);
        }
    }
})