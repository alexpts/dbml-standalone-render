<script setup>

import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import './vendor/fontello/dbml-embedded.css'

import ERD from './components/ERD/Flow.vue'
import TableList from './components/TablesList.vue'

const fields = [
    {name: 'order_id', type: 'int(10)'},
    // {name: 'title', type: 'varchar(255)', ref: {id: "3", type: "source" }},
    {name: 'title', type: 'varchar(255)'},
    {name: 'creAt', type: 'datetime'},
    {name: 'upAt', type: 'datetime'},
];

let initialNodes = [
    //{ id: 'gr-1', selectable: false, zIndex: 0, draggable: true, type: 'group', label: 'group mp', position: { x: 0, y: 0 }, style: {width: '10px', height: '10px'}},
    // { id: 't-1', position: { x: 350, y: 5 }, parentNode: 'gr-1'},
    // { id: 't-2', position: { x: 350, y: 50 }, parentNode: 'gr-1'},
    { id: 'lot', expandParent: true, type: 'table', connectable: true, data: { fields, hide: true}},
    { id: 'lot_offer', expandParent: true, type: 'table', connectable: true, data: { fields }},
    { id: 'event_raw', type: 'table', data: {fields: [
        {name: 'id', type: 'int8', increment: true, pk: true},
        {name: 'name', type: 'int2', not_null: true, note: 'Имя события'},
        {name: 'payload', type: 'json', not_null: true, note: 'json с payload'},
        {name: 'status', type: 'int2', not_null: true, note: 'статусы 0-new'},
        {name: 'created_at', type: 'timestamptz', not_null: true, note: 'Дата созданиям'},
        {name: 'updated_at', type: 'timestamptz', not_null: true, note: 'Дата обновления'},
        {name: 'idempotent_key', type: 'timestamptz', not_null: true, unique: true, note: 'Ключ идемпотентности'},
    ]}}
];

initialNodes.map((node, index) => {
    node.position ??= { x: index * 180, y: 0 }
    node.data ??= {}
    node.data.hide ??= false
})

let initialEdges = [
    { id: "e1", markerEnd: {}.ArrowClosed, source: "lot_offer", sourceHandle: "order_id-right", target: 'lot', targetHandle: "creAt-left", updatable: true, animated: true, data: {sourceHandle: 'order_id', targetHandle: 'creAt'}},
];
</script>

<template>
    <header>DBML Visualizer</header>
    <div class="flex-row flex-grow-1" >
        <TableList></TableList>
        <ERD class="" :initialNodes="initialNodes" :initialEdges="initialEdges"></ERD>
    </div>
</template>


<style lang="sass">
#app
    font-family: "Open Sans",sans-serif
    //-webkit-font-smoothing: antialiased
    //-moz-osx-font-smoothing: grayscale
    //text-align: center

    width: 100vw
    height: 100vh
    margin: auto

    display: flex
    flex-direction: column


header
    box-shadow: 0 -3px 1px -2px #000 inset
    padding: 10px
    background: #316997
    color: #eee
</style>>