<script setup>
import {Position, VueFlow, useVueFlow} from '@vue-flow/core'
import {Background, BackgroundVariant, ControlButton, Controls, MiniMap} from '@vue-flow/additional-components'
import {ref} from "vue"

import ConnectionLine from './SnappableConnectionLine.vue'
import DbTable from "./DbTable.vue"
import DbGroup from "./DbGroup.vue"

const fields = [
    {name: 'order_id', type: 'int(10)'},
    // {name: 'title', type: 'varchar(255)', ref: {id: "3", type: "source" }},
    {name: 'title', type: 'varchar(255)'},
    {name: 'creAt', type: 'datetime'},
    {name: 'upAt', type: 'datetime'},
];


// https://vueflow.dev/guide/vue-flow/config.html#global-edge-options
let {fitView, nodes, onConnect, addEdges, onEdgeUpdate, updateEdge, autoConnect, onConnectEnd, edges, onNodeDoubleClick, onNodeDragStop, onNodeDrag, findNode, getIncomers, getRectOfNodes, dimensions, updateNodePositions, onEdgeUpdateEnd } = useVueFlow({
    id: 'flow-1',
    onlyRenderVisibleElements: true, // в DOM только то что на экране видно
    zoomOnScroll: false,
    connectionMode: 'loose', // можно соединят между собой и source/target <-> source/target без проверки типа
    autoConnect: true, // дефолтный обрабочтик для соединения 2 точек
    defaultEdgeOptions: {
        type: 'smoothstep',
        updatable: true,
        animated: true,
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
    nodes: [
        //{ id: 'gr-1', selectable: false, zIndex: 0, draggable: true, type: 'group', label: 'group mp', position: { x: 0, y: 0 }, style: {width: '10px', height: '10px'}},
        // { id: 't-1', position: { x: 350, y: 5 }, parentNode: 'gr-1'},
        // { id: 't-2', position: { x: 350, y: 50 }, parentNode: 'gr-1'},
        { id: 'lot', expandParent: true, type: 'table', label: 'lot', connectable:true, position: { x: 300, y: 100 }, data: { fields }},
        { id: 'lot_offer', expandParent: true, type: 'table', label: 'ecomm_core.order_items', connectable:true, position: { x: 100, y: 100 }, data: { fields }},
    ],
    edges: [
        { id: "e1", source: "lot_offer", sourceHandle: "order_id-right", target: 'lot', targetHandle: "creAt-left", updatable: true, animated: true},
    ]
})

onConnect((params) => {
    let sourceNode = findNode(params.source)
    let targetNode = findNode(params.target)
    console.log(params)

    // создать коннект на все поле, и подменять на  скрытые варианты left/right
    if (sourceNode.position.x + sourceNode.dimensions.width > targetNode.position.x) {
        alert('1-2')
    } else {
        alert('2-1')
    }

    addEdges([params])
})
// onNodeDragStop((event) => {
//     // @todo проверить все связи на ноде, вычислить относительно других связей положение и пересоздать ряд связей, поменять left/rigth у связей для коннекта
//     console.log(event.node);
// })

// Обновляем связь при перетаскивании связи
onEdgeUpdate (({ edge, connection }) => {
    updateEdge(edge, connection)
})
</script>

<template>
    <VueFlow id="flow-1">
        <Controls position="top-right">
<!--            <ControlButton>-->
<!--                <i class="fa fa-plus">112</i>-->
<!--            </ControlButton>-->
        </Controls>

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
//.vue-flow__container, .vue-flow__pane.draggable
//    cursor: initial
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
</style>