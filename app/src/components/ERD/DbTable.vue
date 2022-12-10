<template>
    <div class="db-table">
        <div class="title" v-tooltip.hover.top="'Хранит <b>доступа</b>'">{{ table.id || table.id }}</div>

        <template v-for="(field) in table.data.fields" :key="field.name">
            <div v-if="!field.hidden" class="field nodrag" >
                <div class="name">{{ field.name }}</div>
                <div class="type" v-tooltip.hover.right="'Хранит время <b>доступа</b>'">{{ field?.type  }}</div>
                <Handle type="target" :position="Position.Right" :connectable="true" :id="`${field.name}-right`" />
                <Handle type="source" :position="Position.Left" :connectable="true" :id="`${field.name}-left`" />
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

</script>

<style lang="sass" scoped>
\:root
    --vf-handle: #ccc

.vue-flow__handle
    opacity: 0
    width: 10px
    height: 10px
    border: 4px solid #fff


.db-table
    color: #6f6f6f
    min-width: 140px
    background: #fcfcfc
    font-size: 12px
    border: 1px solid #fff
    border-radius: 2px
    //opacity: 0.9

.db-table .title
    padding: 4px 8px
    font-size: 14px
    //border-radius: 4px 4px 0 0
    background: #316896
    color: #f3f3f3
    font-weight: bold
    cursor: move

.db-table:hover .title
    color: #fff

.field
    margin: 0
    padding: 6px 8px
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