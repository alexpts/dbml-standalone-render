<script setup lang="ts">
import {GraphNode} from "@vue-flow/core/dist/types/node";

import {ref} from "vue";
import {useErdStore} from "../store/ERD.js"

const store = useErdStore()

const search = ref('')


/**
 * Переключаем отображение таблицы
 * @param {GraphNode} table
 */
const toggleTableHidden = (table) => {
    table.hidden = !table.hidden
}
</script>

<template>
    <aside class="tables">
        <input class="form-control search" placeholder="поиск" v-model="search"/>

        <div @click="toggleTableHidden(table)" class="table-item" v-for="(table) in store.tables" :key="table.id">
            {{ table.label || table.id }}
        </div>
    </aside>
</template>

<style scoped lang="sass">
.tables
    min-width: 240px
    background: #f7f7f7
    border-right: 1px solid #ddd
    color: #999

.tables .search
    margin: 12px auto 20px
    width: 86%

.table-item
    padding: 6px 18px
    cursor: pointer

.table-item:hover
    background: #cedfec
    color: #777
</style>
