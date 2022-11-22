<template>
    <div class="db-table">
        <div class="title">{{ table.label }}</div>
        <div class="field nodrag" v-for="(field, index) in table.data.fields" :key="field.name">
            {{ field.name }}
            <Handle type="target" :position="Position.Right" :connectable="true" :id="`${field.name}-right`" />
            <Handle type="source" :position="Position.Left" :connectable="true" :id="`${field.name}-left`" />
            <!-- <Handle id="3" type="target" :position="Position.Right" />-->
        </div>
    </div>
</template>

<script setup>
import {toRefs, defineProps, ref} from 'vue'
import { Handle, Position } from '@vue-flow/core'

defineProps({
    table: {
        type: Object,
        required: true,
    }
})

</script>

<style lang="sass">
\:root
    --vf-handle: #ccc

.vue-flow__handle
    width: 6px
    height: 6px
    opacity: 0.2


.db-table
    color: #6f6f6f
    min-width: 120px
    background: #fcfcfc
    font-size: 0.8rem
    border: 1px solid #fff
    border-radius: 2px
    opacity: 0.9

.db-table .title
    padding: 6px 8px
    font-size: 0.6rem
    //border-radius: 4px 4px 0 0
    background: #316896
    color: #fafafa
    font-weight: bold
    cursor: move

.field
    margin: 0
    padding: 6px 8px
    font-size: 0.6rem
    position: relative
    background: #f2f2f2
    //box-shadow: inset 0px -2px 0px -2px #000
    border-top: 1px solid #fff

.field:hover .vue-flow__handle
    opacity: 1
    //visibility: visible

.field:hover
    color: #555
    background: #d8e7f3
    //background: #fcfcfc
</style>