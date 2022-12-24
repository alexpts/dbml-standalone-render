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

//let fields = []
//
// let initialNodes = [
//     //{ id: 'gr-1', selectable: false, zIndex: 0, draggable: true, type: 'group', label: 'group mp', position: { x: 0, y: 0 }, style: {width: '10px', height: '10px'}},
//     // { id: 't-1', position: { x: 350, y: 5 }, parentNode: 'gr-1'},
//     // { id: 't-2', position: { x: 350, y: 50 }, parentNode: 'gr-1'},
//     { id: 'lot', expandParent: true, type: 'table', connectable: true, data: {
//         fields, hide: true, color: "#4b9631"
//     }},
//     { id: 'lot_offer', expandParent: true, type: 'table', connectable: true, data: { fields }},
//     { id: 'event_raw', type: 'table', data: {
//             fields: [
//                 {name: 'id', type: 'int8', increment: true, pk: true},
//                 {name: 'name', type: 'int2', not_null: true, note: 'Имя события'},
//                 {name: 'payload', type: 'json', not_null: true, note: 'json с payload'},
//                 {name: 'status', type: 'int2', not_null: true, note: 'статусы 0-new'},
//                 {name: 'created_at', type: 'timestamptz', not_null: true, note: 'Дата созданиям'},
//                 {name: 'updated_at', type: 'timestamptz', not_null: true, note: 'Дата обновления'},
//                 {
//                     name: 'idempotent_key',
//                     type: 'timestamptz',
//                     not_null: true,
//                     unique: true,
//                     note: 'Ключ идемпотентности'
//                 },
//             ],
//             tags: ['event', 'databus']
//         }
//     }
// ];
//
// initialNodes.map((node, index) => {
//     node.position ??= { x: index * 180, y: 0 }
//     node.data ??= {}
//     node.data.tags ??= []
// })

// let initialEdges = [
//     //{ id: "e1", markerEnd: {}.ArrowClosed, source: "lot_offer", sourceHandle: "order_id-right", target: 'lot', targetHandle: "creAt-left", updatable: true, animated: true, data: {sourceHandle: 'order_id', targetHandle: 'creAt'}},
// ];
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

            <!--            <div class="active-table">{{ erdStore.activeTableInfo }}</div>-->
            <ERD :initialNodes="initialNodes" :initialEdges="initialEdges"></ERD>
        </div>
    </div>
</template>


<style lang="sass">

</style>>