<script setup lang="ts">
import {GraphNode} from "@vue-flow/core/dist/types/node";
import {vBTooltip as vTooltip} from "bootstrap-vue-3"

import {ref, computed} from "vue";
import {useErdStore} from "../store/ERD.js"

const store = useErdStore()

const search = ref('')
const searchMode = ref('Таблица')
const showFieldsMap = ref({}) // @todo save to local storage

const filterByTableId = (t: GraphNode) => t.id.includes(search.value)
const filterByTag = (t: GraphNode) => t.data.tags.indexOf(search.value) !== -1
const filterByField = (t: GraphNode) => {
    const foundField = t.data.dbmlTable.fields.find(f => f.name === search.value)
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

// Getter
const getTableNameWithNamespace = (table: GraphNode): string => {
    return table.id
    // let prefix = table.data.dbmlTable.schemaName
    // prefix = prefix ? prefix + '.' : ''
    //
    // return prefix + (table.label || table.id)
}

</script>

<template>
    <div class="input-group input-group-sm search-group">
        <input placeholder="поиск" type="text" class="form-control search" v-model="search"/>
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {{ searchMode }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
            <li><a @click.prevent.passive="changeSearchMode('Таблица')" class="dropdown-item" href="#">Таблица</a></li>
            <li><a @click.prevent.passive="changeSearchMode('Тег')" class="dropdown-item" href="#">Тег</a></li>
            <li><a @click.prevent.passive="changeSearchMode('Поле')" class="dropdown-item" href="#">Поле</a></li>
        </ul>
    </div>

    <div class="tables">
        <div class="table-item" :class="{hide: table.hidden}"
             v-for="(table) in filteredTables" :key="table.id"
        >
            <i @click.stop="toggleChildList(table)" :class="[showFieldsMap[table.id] ? 'i-folder-open' : 'i-folder']"></i>
            <span class="title invisible-scrollbar">{{ getTableNameWithNamespace(table) }}</span>

            <i class="i-target" :class="{singleMode: store.singleModeTable?.id === table.id}" @click.stop="store.actionModeSingleTable(table)" v-tooltip.hover.top="'Режим таблицы'"></i>
            <i @click="table.hidden = !table.hidden" :class="[table.hidden ? 'i-eye-off' : 'i-eye']" v-tooltip.hover.top="table.hidden ? 'Показать' : 'Скрыть'"></i>

            <div class="fields">
                <div
                    @click.stop="field.hidden = ! field.hidden"
                    class="field"
                    :class="{isSearch: searchMode === 'Поле' && search === field.name, hide: field.hidden }"
                    v-if="showFieldsMap[table.id]"
                    v-for="(field) in table.data.dbmlTable.fields"
                >
                    {{ field.name }}
                    <i :class="[field.hidden ? 'i-eye-off' : 'i-eye']" v-tooltip.hover.top="field.hidden ? 'Показать' : 'Скрыть'"> </i>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="sass">
.search-group
    flex-wrap: nowrap
    margin: 12px auto 20px
    width: calc(100% - 20px)

.search-group .dropdown-toggle
    color: #ccc
    border: 1px solid #ccc

input.search::placeholder
    color: #ddd


.tables
  overflow-y: auto
  font-size: 14px

.table-item
    padding: 0 0 0 10px
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    cursor: pointer

    .title
        flex-grow: 1
        max-width: calc(var(--left-panel-width) - 84px)
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
