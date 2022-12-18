<template>
        <div class="db-table">
            <div id="title" :style="{background: table.data.color} " class="title" v-tooltip:table.hover.top="{title: table.data.dbmlTable.note || ''}">{{ getTableNameWithNamespace(table) }}</div>
            <template v-for="(field) in table.data.dbmlTable.fields" :key="field.name">
                <div v-if="!field.hidden" class="field nodrag">
                    <Handle type="source" :position="Position.Left" :connectable="true" :id="field.name" />
                    <div class="name">{{ field.name }}</div>
                    <div class="type" v-tooltip.hover.right="{title: field.note || ''}">{{ field?.type?.type_name  }}</div>
                </div>
            </template>
        </div>
</template>

<script setup lang="ts">

import { Handle, Position } from '@vue-flow/core'

// не работает t-shaking у bootstrap-vue-3 (@todo разобраться)
import  {vBTooltip as vTooltip} from "bootstrap-vue-3"
import {GraphNode} from "@vue-flow/core/dist/types/node";

// можно по именам props обращаться без присваивания props и декларации (props = defineProps(), props.table -> можно просто table)
let props = defineProps<{
    table: GraphNode
}>()

// Getter
const getTableNameWithNamespace = (table: GraphNode): string => {
    let prefix = table.data.dbmlTable.schemaName
    prefix = prefix ? prefix + '.' : ''

    return prefix + (table.label || table.id)
}

</script>

<style lang="sass" scoped>
\:root
    --vf-handle: #ccc

.vue-flow__handle
    opacity: 0
    width: 10px
    height: 10px
    border: 4px solid #fff
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

.selected > .db-table
    outline: 1px solid #839fd2

.db-table
    color: #6f6f6f
    min-width: 160px
    background: #fcfcfc
    font-size: 12px
    border: 1px solid #fff
    border-radius: 2px
    //opacity: 0.7

    .title
        padding: 4px 8px
        font-size: 14px
        background: #316896
        color: #f3f3f3
        font-weight: bold
        cursor: move
        border-radius: 3px 3px 0 0

    &:hover .title
        color: #fff

    .field
        margin: 0
        padding: 4px 8px
        position: relative
        background: #f2f2f2
        //box-shadow: inset 0px -2px 0px -2px #000
        border-top: 1px solid #fff
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center

    .field .type
        color: #ccc
        font-size: 10px
        padding: 0 0 0 8px

    .field:hover .vue-flow__handle
        opacity: 1
        //visibility: visible

    .field:hover
        color: #555
        background: #d8e7f3
        //background: #fcfcfc
</style>