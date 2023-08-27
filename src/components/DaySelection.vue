<template>
    <nav aria-label="...">
        <ul class="pagination">
            <li :class="'page-item ' + (selectedDay == 1 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(1)">Po</a>
            </li>
            <li :class="'page-item ' + (selectedDay == 2 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(2)">Út</a>
            </li>
            <li :class="'page-item ' + (selectedDay == 3 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(3)">St</a>
            </li>
            <li :class="'page-item ' + (selectedDay == 4 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(4)">Čt</a>
            </li>
            <li :class="'page-item ' + (selectedDay == 5 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(5)">Pá</a>
            </li>
            <li :class="'page-item ' + (selectedDay == 6 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(6)">So</a>
            </li>
            <li :class="'page-item ' + (selectedDay == 0 ? 'active' : '')">
                <a href="#" class="page-link" @click="callFunc(0)">Ne</a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
const props = defineProps<{selected: number, updateFunc: (n: number) => void }>()
let selectedDay = props.selected;

const callFunc = (day: number): void => {
    selectedDay = day;
    props.updateFunc(day);
}
</script>