<template>
    <div class="db-group">
        {{ group.label }}
    </div>
</template>

<script setup>
import {toRefs, defineProps, ref} from 'vue'

defineProps({
    group: {
        type: Object,
        required: true,
    }
})
</script>

<style lang="sass">
.vue-flow__node-group
    display: flex

.db-group
    text-align: center
    color: #ccc
    background: rgba(98, 255, 66, 0.1)
    flex-grow: 1
</style>