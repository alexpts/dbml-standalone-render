<script setup lang="ts">
import {GraphNode} from "@vue-flow/core/dist/types/node";
import {vBTooltip as vTooltip} from "bootstrap-vue-3"

import {ref, computed} from "vue";
import {useErdStore} from "../store/ERD.js"

const store = useErdStore()

const search = ref('')
const searchMode = ref('Тег')
const showFieldsMap = ref({})

const filterByTableId = (t: GraphNode) => t.id.includes(search.value)
const filterByTag = (t: GraphNode) => t.data.tags.indexOf(search.value) !== -1
const filterByField = (t: GraphNode) => {
    const foundField = t.data.fields.find(f => f.name === search.value)
    return foundField !== undefined
}

// Вычисляет список отфильтрованных таблиц
const filteredTables = computed(() => {
    if (search.value.length == 0) {
        return store.tables
    }

    switch (searchMode.value) {
        case 'Тег':
            return store.tables.filter(filterByTag)
        case 'Поле':
            return store.tables.filter(filterByField)
        default:
            return store.tables.filter(filterByTableId)
    }
})

const changeSearchMode = (mode: string) => searchMode.value = mode

const toggleChildList = (table) => {
    showFieldsMap.value[table.id] = !showFieldsMap.value[table.id]
}

</script>

<template>
    <aside class="aside-panel">
        Таблицы:
        <!--        <input class="form-control search" placeholder="поиск" v-model="search"/>-->

        <div class="input-group input-group-sm search-group">
            <input placeholder="поиск" type="text" class="form-control search" v-model="search"/>
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ searchMode }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a @click.prevent="changeSearchMode('Таблица')" class="dropdown-item" href="#">Таблица</a></li>
                <li><a @click.prevent="changeSearchMode('Тег')" class="dropdown-item" href="#">Тег</a></li>
                <li><a @click.prevent="changeSearchMode('Поле')" class="dropdown-item" href="#">Поле</a></li>
            </ul>
        </div>

        <div class="tables invisible-scrollbar">
            <div class="table-item" :class="{hide: table.hidden}"
                 v-for="(table) in filteredTables" :key="table.id"
                 @click="table.hidden = !table.hidden"
            >
                <i @click.stop="toggleChildList(table)" :class="[showFieldsMap[table.id] ? 'i-folder-open' : 'i-folder']"></i>
                <span class="flex-grow-1">{{ table.label || table.id }}</span>

                <i class="i-target" :class="{singleMode: store.singleModeTable?.id === table.id}" @click.stop="store.actionModeSingleTable(table)" v-tooltip.hover.top="'Режим таблицы'"></i>
                <i :class="[table.hidden ? 'i-eye-off' : 'i-eye']" v-tooltip.hover.top="table.hidden ? 'Показать' : 'Скрыть'"></i>

                <div class="fields">
                    <div
                        @click.stop="field.hidden = ! field.hidden"
                        class="field"
                        :class="{isSearch: searchMode === 'Поле' && search === field.name, hide: field.hidden }"
                        v-if="showFieldsMap[table.id]"
                        v-for="(field) in table.data.fields"
                    >
                        {{ field.name }}
                        <i :class="[field.hidden ? 'i-eye-off' : 'i-eye']" v-tooltip.hover.top="field.hidden ? 'Показать' : 'Скрыть'"> </i>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped lang="sass">
.search-group
    flex-wrap: nowrap
    margin: 12px auto 20px
    width: calc(100% - 20px)

.search-group .dropdown-toggle
    color: #ccc
    border: 1px solid #ccc

.aside-panel input.search::placeholder
    color: #ddd

.tables
    overflow-y: scroll
    height: 100%
    flex-grow: 1

.table-item
    padding: 0 0 0 10px
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    cursor: pointer

.table-item i
    cursor: pointer

.table-item i.singleMode
    color: #000
    font-weight: bold

.table-item i.i-eye, .table-item i.i-eye-off
    margin: 0 8px 0 auto

.table-item i.i-folder, .table-item i.i-folder-open
    margin: 0 4px 0 0

.table-item.hide, .table-item .field.hide
    opacity: 0.4

.table-item .fields
    width: 100%
    margin: 6px 0

.table-item .field
    padding: 4px 0 4px 8px
    display: flex
    cursor: pointer
    border-radius: 3px 0 0 3px
    margin-left: 20px

.table-item .field.isSearch
    background: #e1e4e7

.table-item .field:hover
    background: #c7d1d9
    color: #777

</style>
