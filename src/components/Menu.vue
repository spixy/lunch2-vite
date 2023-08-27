<template>
    <div class="col pt-4">
        <div class="card h-100">
            <div class="card-header">
                <div class="row">
                    <div class="col col-10">
                        {{ menu.restaurant }}
                    </div>
                    <div class="col col-1">
                        <button class="btn w-100" @click="swapFunction(menu.id, Direction.LEFT)" style="padding-left: 0; border: none" :disabled="store.state.restaurantOrder.get(menu.id) === 0">
                            <font-awesome-icon :icon="['fas', 'arrow-left']"/>
                        </button>
                    </div>
                    <div class="col col-1">
                        <button class="btn w-100" @click="swapFunction(menu.id, Direction.RIGHT)" style="padding-left: 0; border: none" :disabled="store.state.restaurantOrder.get(menu.id) === store.state.restaurantOrder.size-1">
                            <font-awesome-icon :icon="['fas', 'arrow-right']"/>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body" style="padding: 0px">
                <ul class="list-group">
                    <li v-for="soup in menu.meals.filter(meal => meal.isSoup)" class="list-group-item active"
                        style="border-radius: 0px; background-color: var(--bs-soup-bg); border-color: var(--bs-soup-bg);">
                        <div class="row">
                            <div class="col col-9">
                                <span :data-bs-toggle="soup.description.length == 0 ? '' : 'tooltip'"
                                    data-bs-placement="top" :data-bs-title="soup.description">
                                    {{ soup.name }}
                                </span>
                            </div>
                            <div class="col col-3 text-end">
                                {{ soup.price < 0 ? '---' : soup.price }} Kč </div>
                            </div>
                    </li>
                    <li v-for="soup in menu.permanentmeals.filter(meal => meal.isSoup)" class="list-group-item active"
                        style="border-radius: 0px; background-color: var(--bs-soup-bg); border-color: var(--bs-soup-bg);">
                        <div class="row">
                            <div class="col col-9">
                                <span :data-bs-toggle="soup.description.length == 0 ? '' : 'tooltip'"
                                    data-bs-placement="top" :data-bs-title="soup.description">
                                    {{ soup.name }}
                                </span>
                            </div>
                            <div class="col col-3 text-end">
                                {{ soup.price < 0 ? '---' : soup.price }} Kč </div>
                            </div>
                    </li>
                    <li v-for="meal in menu.meals.filter(meal => !meal.isSoup)" class="list-group-item"
                        style="border-radius: 0px">
                        <div class="row">
                            <div class="col col-9">
                                <span :data-bs-toggle="meal.description.length == 0 ? '' : 'tooltip'"
                                    data-bs-placement="top" :data-bs-title="meal.description">
                                    {{ meal.name }}
                                </span>
                            </div>
                            <div class="col col-3 text-end">
                                {{ meal.price < 0 ? '---' : meal.price }} Kč </div>
                            </div>
                    </li>
                    <li v-for="meal in menu.permanentmeals.filter(meal => !meal.isSoup)" class="list-group-item"
                        style="border-radius: 0px">
                        <div class="row">
                            <div class="col col-9">
                                <span :data-bs-toggle="meal.description.length == 0 ? '' : 'tooltip'"
                                    data-bs-placement="top" :data-bs-title="meal.description">
                                    {{ meal.name }}
                                </span>
                            </div>
                            <div class="col col-3 text-end">
                                {{ meal.price < 0 ? '---' : meal.price }} Kč </div>
                            </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as bootstrap from 'bootstrap';
import { onMounted, onUpdated } from 'vue';
import { Direction, RestaurantDay } from '../types/Restaurant.ts'
import { useStore } from 'vuex';
import { key } from '../store';

const store = useStore(key);

defineProps<{ menu: RestaurantDay, swapFunction: (id: number, direction: Direction) => void }>()
let tooltips: bootstrap.Tooltip[] = [];

onMounted(() => {
    [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
        .forEach(el => tooltips.push(new bootstrap.Tooltip(el)));
})

onUpdated(() => {
    tooltips.forEach(tooltip => { tooltip.dispose(); });
    tooltips = [];
    [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
        .forEach(el => tooltips.push(new bootstrap.Tooltip(el)));
})

</script>