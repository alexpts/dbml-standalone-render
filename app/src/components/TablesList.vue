<script setup lang="ts">
import {GraphNode} from "@vue-flow/core/dist/types/node";
import {vBTooltip} from "bootstrap-vue-3"

import {ref, computed} from "vue";
import {useErdStore} from "../store/ERD.js"

const store = useErdStore()

const search = ref('')
const searchMode = ref('Таблица')
const showTableMap = ref({}) // @todo save to local storage

const filterByTableId = (t: GraphNode) => t.id.includes(search.value)
const filterByField = (t: GraphNode) => {
    return t.data.fields[search.value]
}

// Вычисляет список отфильтрованных таблиц
const filteredTables = computed(() => {
    if (search.value.length == 0) {
        return store.tablesByTags
    }

    switch (searchMode.value) {
        case 'Поле':
            return store.tablesByTags.filter(filterByField)
        default:
            return store.tablesByTags.filter(filterByTableId)
    }
})

const changeSearchMode = (mode: string) => searchMode.value = mode

const toggleChildList = (table) => {
    showTableMap.value[table.id] = !showTableMap.value[table.id]
}

</script>

<template>
    <div>
        <h6 class="w-title">Таблицы:</h6>
        <div class="input-group input-group-sm search-group">
            <input placeholder="поиск" type="text" class="form-control search" v-model="search"/>
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ searchMode }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a @click.prevent.passive="changeSearchMode('Таблица')" class="dropdown-item" href="#">Таблица</a></li>
                <li><a @click.prevent.passive="changeSearchMode('Поле')" class="dropdown-item" href="#">Поле</a></li>
            </ul>
        </div>

        <div class="tables">
            <div class="table-item" :class="{hide: table.hidden}"
                 v-for="(table) in filteredTables" :key="table.id"
            >
                <i @click.stop="toggleChildList(table)" :class="[showTableMap[table.id] ? 'i-folder-open' : 'i-folder']"></i>
                <span @click="store._activeTableInfo = table" class="title invisible-scrollbar">{{ table.label || table.id }}</span>

                <i class="i-target" :class="{singleMode: store.singleModeTable?.id === table.id}" @click.stop="store.actionModeSingleTable(table)" v-b-tooltip.hover.top="'Режим таблицы'"></i>
                <i @click="table.hidden = !table.hidden" :class="[table.hidden ? 'i-eye-off' : 'i-eye']" v-b-tooltip.hover.top="table.hidden ? 'Показать' : 'Скрыть'"></i>

                <div class="fields" v-if="showTableMap[table.id]" >
                    <template v-for="(field) in table.data.fields">
                        <div
                            @click.stop="field.hidden = ! field.hidden"
                            class="field"
                            :class="{isSearch: searchMode === 'Поле' && search === field.name, hide: field.hidden }"
                            v-if="!(searchMode === 'Поле'&& search !== field.name)"
                        >
                            {{ field.name }}
                            <i :class="[field.hidden ? 'i-eye-off' : 'i-eye']" v-b-tooltip.hover.top="field.hidden ? 'Показать' : 'Скрыть'"> </i>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped lang="sass">
.search-group
    flex-wrap: nowrap
    margin: 0 auto 12px
    width: calc(100% - 20px)

.search-group .dropdown-toggle
    color: #ccc
    border: 1px solid #ccc

input.search::placeholder
    color: #ddd


.tables
  //overflow-y: auto
  font-size: 14px

.table-item
    padding: 1px 0 1px 10px
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    cursor: pointer

    .title
        flex-grow: 1
        max-width: calc(var(--left-panel-width) - 92px)
        overflow: auto

    i
        cursor: pointer

    i.singleMode
        color: #000
        font-weight: bold


    i.i-eye, i.i-eye-off
        margin: 0 4px 0 auto

    i.i-folder, i.i-folder-open
        margin: 0 4px 0 0

    &.hide, .field.hide
        opacity: 0.4

    .fields
        width: 100%
        margin: 3px 0

        .field
            padding: 2px 0 2px 8px
            display: flex
            cursor: pointer
            border-radius: 3px 0 0 3px
            margin-left: 20px

            &:hover
                background: #c7d1d9
                color: #777

        .field.isSearch
            background: #e1e4e7

</style>
