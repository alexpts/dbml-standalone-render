<script setup lang="ts">
import {useErdStore} from "../store/ERD.js"
const store = useErdStore()

const toggleTag = (tags: string[], tagId: string): void => {
    const pos = tags.indexOf(tagId)
    pos === -1
        ? tags.push(tagId)
        : tags.splice(pos, 1)
}
</script>

<template>
    <div class="table-fields" v-if="store.activeTableInfo">
        <h4>Таблица: {{ store.activeTableInfo.id }}</h4>
        <!-- add `refs` column -->
        <b-table
            style="font-size: 12px" striped="" hover=""
            :fields="['name', 'type', 'tags']"
            :items="store.activeTableInfo.data.fields"
        >
            <template v-slot:cell(type)="data">
                {{ data.value.type_name }}
            </template>

<!--            <template #cell(note)="data">-->
<!--                <b-form-textarea size="sm" v-if="store.settings.editMode"-->
<!--                    v-model="data.value"-->
<!--                    placeholder="note..."-->
<!--                    rows="1"-->
<!--                    max-rows="6"-->
<!--                />-->
<!--                <template v-else>{{ data.value["value"] }}</template>-->
<!--            </template>-->

            <template v-slot:cell(tags)="data">
                <span class="tag" @click="toggleTag(data.value, tag.id)" :class="{active: data.value.indexOf(id) !== -1}" v-for="(tag, id) in store.tags" :key="id">
                    {{ tag.label || tag.id }}
                </span>
            </template>

        </b-table>
    </div>
</template>

<style scoped lang="sass">
.tag
    margin: 0 4px
    padding: 0 6px
    border-radius: 8px
    font-size: 14px
    background: #fff
    color: #777
    cursor: pointer
    display: inline-block
    border: 1px solid #e7e7e7

    &:hover
        border: 1px solid #ddd
    &.active
        background: #316997
        color: #eee
</style>
