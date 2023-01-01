<script setup lang="ts">
import {useErdStore} from "../store/ERD.js"

const store = useErdStore()

const toggleActive = (tag, oldValue) => {
    store.tags[tag] = !oldValue
}
</script>

<template>
    <div class="tags-list" v-if="Object.entries(store.tags).length">
        <h6 class="w-title">Теги:</h6>
        <div>
            <span @click="toggleActive(tag, value)" class="tag" :class="{active: store.tags[tag]}" v-for="(value, tag) in store.tags" :key="tag">
                {{ tag }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="sass">
    .tags-list
        .tag
            margin: 2px 4px
            padding: 2px 6px
            border-radius: 8px
            font-size: 14px
            box-sizing: border-box
            background: #fff
            color: #777
            cursor: pointer
            display: inline-block
            border: 1px solid #e7e7e7

            &:hover, &.active
                background: #316997
                color: #eee
            &:hover
                background: #3c76a6
                color: #ddd

</style>
