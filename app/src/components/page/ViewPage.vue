<script setup>

import ERD from '../ERD/Flow.vue'
import TableList from '../TablesList.vue'
import {useErdStore} from "../../store/ERD";
import {parseDBMLToJSON, dbml, convertDbmlFormatToVueFlow} from '../ERD/dbml-adapter'

const erdStore = useErdStore()
const dbmlRaw = erdStore.dbmlRaw || dbml

let db
try {
    db = parseDBMLToJSON.parse(dbmlRaw)
    console.log(db)
} catch (e) {
    console.error('Can`t parse dbml', e)
}

const [initialNodes, initialEdges] = convertDbmlFormatToVueFlow(db)
console.log(initialNodes)
</script>

<template>
    <div class="middle">
        <div class="aside-panel comp-layer f-col">
            <TableList></TableList>
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

</style>>