<script setup>

//import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import './vendor/fontello/dbml-embedded.css'

import ERD from './components/ERD/Flow.vue'
import TableList from './components/TablesList.vue'
import {useErdStore} from "./store/ERD";
import {Parser, dbml, convertDbmlFormatToVueFlow} from './components/ERD/dbml-adapter'

let db
try {
    db = Parser.parseDBMLToJSON(dbml)
    console.log(db)
} catch (e) {
    console.error('Can`t parse dbml', e)
}

const [initialNodes, initialEdges] = convertDbmlFormatToVueFlow(db)
console.log(initialNodes)

const erdStore = useErdStore()

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
    <header class="comp-layer">
        <span class="logo">DBML Visualizer</span>
        <a href="#" @click.prevent>Таблицы</a>
        <a href="#" @click.prevent>Связи</a>
    </header>
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
\:root
    --left-panel-width: 300px

.f-col
    display: flex
    flex-direction: column

.comp-layer
    will-change: transform

html, body, #app
    overflow: hidden

#app
    font-family: "Open Sans",sans-serif
    //-webkit-font-smoothing: antialiased
    //-moz-osx-font-smoothing: grayscale

    width: 100vw
    height: 100vh

    display: flex
    flex-direction: column

    header
        box-shadow: 0 -3px 1px -2px #000 inset
        padding: 10px
        background: #316997
        color: #ddd
        display: flex
        justify-content: start

        .logo
            color: #fff

        a
            color: inherit
            text-decoration: none
            margin: 0 12px
            border-bottom: 2px solid transparent

            &:hover
                color: #fff
                border-bottom: 2px solid #fff

    .middle
        position: relative
        flex-grow: 1
        display: flex
        flex-direction: row


        .aside-panel
            width: var(--left-panel-width)
            background: #f7f7f7
            border-right: 1px solid #ddd
            color: #999
            position: absolute
            top: 0
            bottom: 0
            left: 0

        .content
            flex-grow: 1
            left: var(--left-panel-width) // compensation for left panel
            right: 0
            top: 0
            bottom: 0
            overflow-y: scroll
            position: absolute
            padding: 20px


// scroll
.invisible-scrollbar::-webkit-scrollbar
    display: none

::-webkit-scrollbar-track
    box-shadow: inset 0 0 1px rgba(0,0,0,.1)
    border-radius: 8px
    background-color: #f0f0f0

::-webkit-scrollbar
    width: 5px

::-webkit-scrollbar-thumb
    border-radius: 10px
    box-shadow: inset 0 0 1px rgba(0,0,0,.2)
    background-color: #c7d1d9
</style>>