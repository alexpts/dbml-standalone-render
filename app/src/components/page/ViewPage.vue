<script setup lang="ts">

import ERD from '../ERD/Flow.vue'
import TableList from '../TablesList.vue'
import TagsTableList from '../TagsTableList.vue'
import Settings from '../Settings.vue'

import {useErdStore} from "../../store/ERD";
import convertor, {parseDBMLToJSON} from '../ERD/dbml-convertor'
import ActiveTableInfo from "../ActiveTableInfo.vue"
import ProjectInfo from "../ProjectInfo.vue"

const store = useErdStore()

// @todo
// 1 dbml
// 2 yaml (dbml yaml parser format)
// 3 yaml custom layer extend

const createVueFlowData = (dbmlRaw: String) => {
    try {
        return parseDBMLToJSON.parse(dbmlRaw)
    } catch (e) {
        console.error('Can`t parse dbml', e)
    }
}

const db = createVueFlowData(store.dbmlRaw)

const [initialNodes, initialEdges] = convertor.convertDbmlStructToVueFlow(db)
store.applyExtraData(initialNodes, initialEdges)
store.initTags(initialNodes)

console.log(initialNodes)
</script>

<template>
    <div class="middle" :class="{'edit-mode': store.settings.editMode}">
        <div class="aside-panel comp-layer f-col">
            <TagsTableList class="widget" />
            <TableList class="widget" />
            <Settings class="widget" />
        </div>
        <div class="content comp-layer f-col">
            <ProjectInfo :name="db.project?.name" :note="db.project?.note || ''" />
            <ActiveTableInfo />

            <ERD :initialNodes="initialNodes" :initialEdges="initialEdges"></ERD>
        </div>
    </div>
</template>


<style lang="sass">
.aside-panel
    overflow-y: auto

    .widget
        border-bottom: 1px solid #eee
        padding: 4px
        .w-title
            cursor: pointer
            padding: 8px
            margin: 0
            font-size: 14px

</style>>