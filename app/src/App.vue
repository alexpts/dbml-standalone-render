<script setup>
import {ref} from "vue"
import {VueFlow, useVueFlow} from '@vue-flow/core'
import {Background, BackgroundVariant, ControlButton, Controls, MiniMap} from '@vue-flow/additional-components'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import DbTable from "./DbTable.vue"
import DbGroup from "./DbGroup.vue"

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
    { id: 'lot', expandParent: true, type: 'table', connectable: true, data: { fields }},
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
})

let initialEdges = [
    { id: "e1", markerEnd: {}.ArrowClosed, source: "lot_offer", sourceHandle: "order_id-right", target: 'lot', targetHandle: "creAt-left", updatable: true, animated: true, data: {sourceHandle: 'order_id', targetHandle: 'creAt'}},
];


// https://vueflow.dev/guide/vue-flow/config.html#global-edge-options
let {edges, nodes, fitView, onNodeDragStop, onConnect, addEdges, onEdgeUpdate, updateEdge, autoConnect, onConnectEnd, onNodeDoubleClick, onNodeDrag, findNode, updateNodePositions, onEdgeUpdateEnd } = useVueFlow({
    id: 'flow-1',
    onlyRenderVisibleElements: true, // в DOM только то что на экране видно
    zoomOnScroll: false,
    connectionMode: 'loose', // можно соединят между собой и source/target <-> source/target без проверки типа
    autoConnect: true, // дефолтный обрабочтик для соединения 2 точек

    defaultEdgeOptions: {
        type: 'smoothstep',
        updatable: true,
        animated: false,
        selectable: true,
    },
    edgeUpdaterRadius: 10,
    connectOnClick: false, // создает edge последовательным кликом на 2 Handle точки межжу ними
    panOnScroll: true,
    fitViewOnInit: true,
    maxZoom: 5,
    minZoom: 0.1,
    panOnDrag: false, // можно ли тянуть полотно через клиек(зажим) и перемещение мыши
    panOnScrollSpeed: 1.8,
    connectionLineType: "smoothstep", // deprecated
    elevateEdgesOnSelect: true, // edge связи поверх node делает связанные
    elementsSelectable: false,
    //panOnDrag: false,
    //snapGrid: [50, 50],
    snapToGrid: false, // перетягиваем шагами
    //noDragClassName: 'nodrag',
    //nodesDraggable: false,
    nodes: ref(initialNodes).value,
    edges: ref(initialEdges).value,
})



// Обовляем связи сторонами автоматичеси к ближайшей стороне
onNodeDragStop(({node}) => {
    let relEdges = edges.value.filter(e => node.id === e.source || node.id === e.target)
    relEdges.map(edge => {
        const diffStartX = edge.sourceNode.position.x - edge.targetNode.position.x;
        if (diffStartX < 0) {
            edge.targetHandle = `${edge.data.targetHandle}-left`
            edge.sourceHandle = Math.abs(diffStartX) > edge.sourceNode.dimensions.width
                ? `${edge.data.sourceHandle}-right`
                : `${edge.data.sourceHandle}-left`

            console.log(edge);
            console.log(diffStartX, edge.sourceNode.dimensions.width);
        } else {
            edge.targetHandle = `${edge.data.targetHandle}-right`
            edge.sourceHandle = diffStartX > edge.targetNode.dimensions.width
                ? `${edge.data.sourceHandle}-left`
                : `${edge.data.sourceHandle}-right`
        }
    })
})

onConnect((params) => {
    let sourceSuffix = params.sourceHandle.slice(-5) === '-left' ? -5 : -6; // -left / -right
    let targetSuffix = params.targetHandle.slice(-5) === '-left' ? -5 : -6;

    params.data = {
        sourceHandle: params.sourceHandle.slice(0, sourceSuffix),
        targetHandle: params.targetHandle.slice(0, targetSuffix),
    }
    console.log(params);
    addEdges([params])
})

// Обновляем связь при перетаскивании связи
onEdgeUpdate (({ edge, connection }) => {
    updateEdge(edge, connection)
})
</script>

<template>
<!--    <VueFlow id="flow-1" :nodes="initialNodes" :edges="initialEdges">-->
<!--    <BButton variant="primary">Test</BButton>-->
    <VueFlow id="flow-1">
        <Controls position="top-right" />

        <Background variant="lines" pattern-color="rgb(79 137 224 / 0.2)" gap="40" size="0.4" />
        <MiniMap nodeColor="#17d8b8" nodeStrokeColor="#333" :pannable="true" :zoomable="true"/>

       <!-- классный пример анимации для FK - https://vueflow.dev/examples/transition.html -->

        <template #node-group="node">
            <DbGroup :group="node" />
        </template>
        <template #node-table="node">
            <DbTable :table="node" />
        </template>

    </VueFlow>
</template>

<style lang="sass">
#app
    font-family: "Open Sans",sans-serif
    //-webkit-font-smoothing: antialiased
    //-moz-osx-font-smoothing: grayscale
    //text-align: center

    width: 90vw
    height: 90vh
    //background: #f0f0f0
    margin: auto

    display: flex

.vue-flow__edge-path
    stroke: #7cadd5

svg:hover .vue-flow__edge-path:hover
    stroke: #000
</style>

<style rel="bootstrap/dist/css/bootstrap.css"></style>
<style rel="bootstrap-vue-3/dist/bootstrap-vue-3.css"></style>