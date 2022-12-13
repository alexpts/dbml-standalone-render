<script setup>
import {VueFlow, useVueFlow} from '@vue-flow/core'
import {Background, Controls, MiniMap} from '@vue-flow/additional-components'
import {useErdStore} from "../../store/ERD"

import DbTable from "./DbTable.vue"
import DbGroup from "./DbGroup.vue"

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
    updateNodePositions, onEdgeMouseMove,
} = useVueFlow({
    //id: 'flow-1',
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
    nodes: props.initialNodes,
    edges: props.initialEdges,
})

// через store nodes/edges шарим между компонентами приложения
store.$patch({
    tables: nodes,
    edges: edges,
})

// добавить тротлинг
// onEdgeMouseMove(({edge}) => {
//     // @todo tooltip с данными о связи через 1 контейнер в DOM + target https://bootstrap-vue.org/docs/components/tooltip
//     // + pointer-events - http://jsfiddle.net/h2dL07ns/324/
//     console.log(edge)
// })

// Обовляем связи сторонами автоматичеси к ближайшей стороне
onNodeDragStop(({node}) => {
    let relEdges = store.edges.filter(e => node.id === e.source || node.id === e.target)
    relEdges.map(edge => {
        const diffStartX = edge.sourceNode.position.x - edge.targetNode.position.x;
        if (diffStartX < 0) {
            edge.targetHandle = `${edge.data.targetHandle}-left`
            edge.sourceHandle = Math.abs(diffStartX) > edge.sourceNode.dimensions.width
                ? `${edge.data.sourceHandle}-right`
                : `${edge.data.sourceHandle}-left`

            //console.log(edge);
            //console.log(diffStartX, edge.sourceNode.dimensions.width);
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

    addEdges([params])
})

// Обновляем связь при перетаскивании связи
onEdgeUpdate(({edge, connection}) => {
    updateEdge(edge, connection)
})

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
    </VueFlow>
</template>


<style lang="sass">
.erd
    flex-grow: 1
    padding: 20px
    min-height: 94vh
    border: 1px solid #eee
    border-radius: 4px
    background: #fff

.vue-flow__edge-path
    stroke: #7cadd5

svg:hover .vue-flow__edge-path:hover
    stroke: #000

.vue-flow__controls
    opacity: 0.5
</style>

