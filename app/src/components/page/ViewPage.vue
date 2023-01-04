<script setup lang="ts">

import ERD from '../ERD/Flow.vue'
import TableList from '../TablesList.vue'
import TagsTableList from '../TagsTableList.vue'
import {useErdStore} from "../../store/ERD";
import convertor, {parseDBMLToJSON} from '../ERD/dbml-convertor'

const erdStore = useErdStore()

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

const db = createVueFlowData(erdStore.dbmlRaw)


const [initialNodes, initialEdges] = convertor.convertDbmlStructToVueFlow(db)
erdStore.applyExtraData(initialNodes, initialEdges)
erdStore.initTags(initialNodes)
// init tags

console.log(initialNodes)
</script>

<template>
    <div class="middle">
        <div class="aside-panel comp-layer f-col">
            <TagsTableList class="widget"></TagsTableList>
            <TableList class="widget"></TableList>
        </div>
        <div class="content comp-layer f-col">
            <div class="project">
                <h4>Проект: {{ db.project?.name || "Новый проект" }}</h4>
                {{db.project?.note}}
            </div>
            <div class="table-fields" v-if="erdStore.activeTableInfo">
                <h4>Таблица: {{ erdStore.activeTableInfo.name }}</h4>
                <b-table style="font-size: 12px" striped="" hover="" :fields="['name', 'type', 'note']" :items="erdStore.activeTableInfo.fields"></b-table>
            </div>

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
            padding: 8px
            margin: 0
            font-size: 14px

</style>>