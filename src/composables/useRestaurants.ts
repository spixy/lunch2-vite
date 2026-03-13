import { ref } from "vue";
import { useStore } from "vuex";
import { key, type SavedRestaurant } from "../store";
import { Direction, type Restaurant, type RestaurantDay } from "../types/Restaurant";
import { restaurantToRestaurantDay } from "../services/restaurantServices";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const baseUrl = import.meta.env.VITE_API_URL;

export function useRestaurants() {
  const store = useStore(key);
  const menus = ref<RestaurantDay[]>([]);
  const selectedDay = ref(new Date().getDay());

  const getRestaurantIndex = (id: number): number | undefined =>
    store.state.restaurantOrder.find((item) => item.id === id)?.index;

  const getRestaurantIdByIndex = (index: number): number | undefined =>
    store.state.restaurantOrder.find((item) => item.index === index)?.id;

  const isRestaurantHidden = (id: number): boolean =>
    store.state.restaurantOrder.find((item) => item.id === id)?.isHidden ?? false;

  const updateRestaurantOrder = (restaurants: Restaurant[]) => {
    const currentOrder: SavedRestaurant[] = [...store.state.restaurantOrder];

    for (const restaurant of restaurants) {
      if (!currentOrder.find((item) => item.id === restaurant.id)) {
        currentOrder.push({ id: restaurant.id, index: currentOrder.length, isHidden: false });
      }
    }

    const restaurantIds = new Set(restaurants.map((res) => res.id));
    const filteredOrder = currentOrder
      .filter((item) => restaurantIds.has(item.id))
      .sort((a, b) => a.index - b.index)
      .map((item, index) => ({ ...item, index }));

    store.commit("setRestaurantOrder", filteredOrder);
  };

  const sortRestaurantDays = (restaurants: RestaurantDay[]): RestaurantDay[] => {
    const getIndex = (id: number) =>
      store.state.restaurantOrder.find((item) => item.id === id)?.index ?? 0;
    return [...restaurants].sort((a, b) => getIndex(a.id) - getIndex(b.id));
  };

  const getRestaurantsForDay = async (day: number) => {
    selectedDay.value = day;
    let response: Restaurant[] = await fetch(`${baseUrl}/get?day=${days[day]}`).then((r) =>
      r.json(),
    );
    if (store.state.filipMode) {
      response = response.filter((res) => res.restaurant === "Padagali");
    }
    updateRestaurantOrder(response);
    menus.value = sortRestaurantDays(restaurantToRestaurantDay(response));
  };

  const swapRestaurants = (id: number, direction: Direction) => {
    const oldIndex = getRestaurantIndex(id);
    if (oldIndex === undefined) return;

    const newIndex = oldIndex + (direction === Direction.LEFT ? -1 : 1);
    if (newIndex < 0 || newIndex >= menus.value.length) return;

    const swapId = getRestaurantIdByIndex(newIndex);
    if (swapId === undefined) return;

    const tmp = menus.value[newIndex];
    menus.value[newIndex] = menus.value[oldIndex];
    menus.value[oldIndex] = tmp;
    store.commit("updateRestaurantOrder", { id, newIndex, oldIndex, swapId });
  };

  const saveOrderAfterDrag = () => {
    const newOrder: SavedRestaurant[] = menus.value.map(({ id }, index) => {
      const existing = store.state.restaurantOrder.find((item) => item.id === id);
      return { id, index, isHidden: existing?.isHidden ?? false };
    });
    store.commit("setRestaurantOrder", newOrder);
  };

  store.subscribe((mutation) => {
    if (mutation.type === "toggleFilipMode" || mutation.type === "toggleRetardMode") {
      getRestaurantsForDay(selectedDay.value);
    }
  });

  return { menus, selectedDay, getRestaurantsForDay, swapRestaurants, isRestaurantHidden, saveOrderAfterDrag };
}
