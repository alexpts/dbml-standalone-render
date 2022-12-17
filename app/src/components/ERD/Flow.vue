<script setup>
import {VueFlow, useVueFlow, ConnectionMode} from '@vue-flow/core'

import {Controls} from "@vue-flow/controls"
import '@vue-flow/controls/dist/style.css'
import {Background} from "@vue-flow/background"
import {MiniMap} from "@vue-flow/minimap"

import {useErdStore} from "../../store/ERD"

import DbTable from "./DbTable.vue"
import DbGroup from "./DbGroup.vue"
import CustomConnectionLine from "./CustomConnectionLine.vue";
import CustomEdge from "./CustomEdge.vue";

const store = useErdStore()

const props = defineProps({
    initialNodes: {
        type: Array,
        required: true,
    },
    initialEdges: {
        type: Array,
        required: true,
    }
})


// https://vueflow.dev/guide/vue-flow/config.html#global-edge-options
let {
    edges, nodes, fitView, onNodeDragStop, onConnect, addEdges, onEdgeUpdate, updateEdge, autoConnect,
    updateNodePositions, onNodeMouseEnter, onNodeMouseLeave, onEdgeMouseEnter
} = useVueFlow({
    //onlyRenderVisibleElements: true, // в DOM только то что на экране видно
    zoomOnScroll: false,
    connectionMode: ConnectionMode.Loose, // можно соединят между собой и source/target <-> source/target без проверки типа
    autoConnect: true, // дефолтный обрабочтик для соединения 2 точек
    defaultEdgeOptions: {
        type: 'custom_edge_1',
        updatable: true,
        animated: false,
        selectable: true,
    },
    edgeUpdaterRadius: 10,
    connectOnClick: false, // создает edge последовательным кликом на 2 Handle точки межжу ними
    panOnScroll: true,
    //fitViewOnInit: true,
    maxZoom: 5,
    minZoom: 0.1,
    panOnDrag: false, // можно ли тянуть полотно через клиек(зажим) и перемещение мыши
    panOnScrollSpeed: 1.8,
    elevateEdgesOnSelect: false, // поднимает z-index edge связям активным
    elementsSelectable: false,
    //panOnDrag: false,
    //snapGrid: [50, 50],
    snapToGrid: false, // перетягиваем шагами
    //noDragClassName: 'nodrag',
    //nodesDraggable: false,
    nodes: props.initialNodes,
    edges: props.initialEdges,
})

// через store nodes/edges шарим между компонентами приложения
store.$patch({
    tables: nodes,
    edges: edges,
})

// @todo options
onNodeMouseEnter(({connectedEdges, event, node}) => {
    connectedEdges.forEach(e => e.selected = true)
})

// @todo options
onNodeMouseLeave(({connectedEdges, event, node}) => {
    connectedEdges.forEach(e => e.selected = false)
})

// Добавляем edge при коннекте 2 точек
onConnect(params => {
    addEdges([params])
})

// Обновляем связь при перетаскивании связи
// onEdgeUpdate(({edge, connection}) => {
//     updateEdge(edge, connection)
// })


const onEnter = function() {
    console.log('111', arguments)
    debugger
}
</script>

<template>
    <VueFlow class="erd">
        <Controls position="top-right"/>

        <Background variant="lines" pattern-color="rgb(79 137 224 / 0.2)" gap="40" size="0.5"/>
        <MiniMap nodeColor="#17d8b8" nodeStrokeColor="#333" :pannable="true" :zoomable="true"/>

        <!-- классный пример анимации для FK - https://vueflow.dev/examples/transition.html -->

        <template #node-group="node">
            <DbGroup :group="node"/>
        </template>
        <template #node-table="node">
            <DbTable :table="node"/>
        </template>

<!--        <template #connection-line="connectionLineProps">-->
<!--            <CustomConnectionLine v-bind="connectionLineProps" />-->
<!--        </template>-->

        <template #edge-custom_edge_1="props">
            <CustomEdge v-bind="props" />
        </template>
    </VueFlow>
</template>


<style lang="sass">
.erd
    flex-grow: 1
    padding: 20px
    margin-top: 40px
    min-height: 94vh
    border: 1px solid #eee
    border-radius: 4px
    background: #fff

.vue-flow__edge-path
    stroke: #7cadd5

.vue-flow__controls
    opacity: 0.5

.vue-flow__edge-textwrapper
    opacity: 0.3
</style>

