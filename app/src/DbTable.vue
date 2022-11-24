<template>
    <div class="db-table">
        <div class="title">{{ table.label || table.id }}</div>
        <div class="field nodrag" v-for="(field, index) in table.data.fields" :key="field.name">
            <div class="name">{{ field.name }}</div>
<!--            <div class="type" v-tooltip.hover.right="{title: 'My title', delay: 100}" title="Хранит время доступа">{{ field?.type  }}</div>-->
            <div class="type" v-tooltip.hover.right="'Хранит время <b>доступа</b>'">{{ field?.type  }}</div>
            <Handle type="target" :position="Position.Right" :connectable="true" :id="`${field.name}-right`" />
            <Handle type="source" :position="Position.Left" :connectable="true" :id="`${field.name}-left`" />
            <!-- <Handle id="3" type="target" :position="Position.Right" />-->
        </div>
    </div>
</template>

<script setup>

import { defineProps } from 'vue'
import { Handle, Position } from '@vue-flow/core'
// не работает t-sha
import  {vBTooltip as vTooltip} from "bootstrap-vue-3"

// можно по именам props обращаться без присваивания props и декларации (props = defineProps(), props.table -> можно просто table)
defineProps({
    table: {
        type: Object,
        required: true,
    }
})

</script>

<style lang="sass" scoped>
\:root
    --vf-handle: #ccc

.vue-flow__handle
    width: 6px
    height: 6px
    opacity: 0


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