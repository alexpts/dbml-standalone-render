<script setup lang="ts">
import {VueFlow, useVueFlow, ConnectionMode} from '@vue-flow/core'

import {ControlButton, Controls} from "@vue-flow/controls"
import '@vue-flow/controls/dist/style.css'
import {Background} from "@vue-flow/background"
import {MiniMap} from "@vue-flow/minimap"

import {useErdStore} from "../../store/ERD"

import DbTable from "./DbTable.vue"
import DbGroup from "./DbGroup.vue"
// import CustomConnectionLine from "./CustomConnectionLine.vue";
import CustomEdge from "./CustomEdge.vue";
import {GraphNode} from "@vue-flow/core/dist/types/node";
import {ref, Ref} from "vue";
import {debounce} from '../../utils.js'

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

let isScrollPane: Ref<boolean> = ref(false)
const erdElement = ref('')


// https://vueflow.dev/guide/vue-flow/config.html#global-edge-options
// https://reactflow.dev/docs/api/react-flow-props/
let {
    edges, nodes, fitView, onNodeDragStop, onConnect, addEdges, onEdgeUpdate, updateEdge, autoConnect,
    updateNodePositions, onNodeMouseEnter, onNodeMouseLeave, onEdgeMouseEnter, onNodesInitialized,
    onPaneScroll, onNodeDoubleClick, panOnDrag, panOnScroll, panOnScrollSpeed
} = useVueFlow({
    //onlyRenderVisibleElements: false, // в DOM только то что на экране видно
    disableKeyboardA11y: false,
    zoomOnScroll: false,
    connectionMode: ConnectionMode.Loose, // можно соединят между собой и source/target <-> source/target без проверки типа
    autoConnect: true, // дефолтный обработчик для соединения 2 точек
    defaultEdgeOptions: {
        type: 'custom_edge_1',
        updatable: true,
        animated: false,
        selectable: true,
    },
    edgeUpdaterRadius: 10,
    connectOnClick: false, // создает edge последовательным кликом на 2 Handle точки между ними
    panOnScroll: store.settings.vueFlow.panOnScroll,
    //fitViewOnInit: true,
    maxZoom: 5,
    minZoom: 0.1,
    panOnDrag: store.settings.vueFlow.panOnDrag, // можно ли тянуть полотно через клик(зажим) и перемещение мыши
    panOnScrollSpeed: store.settings.vueFlow.panOnScrollSpeed, // 1.0 скорость скрола полотна
    elevateEdgesOnSelect: false, // поднимает z-index edge связям активным
    elementsSelectable: true,
    //panOnDrag: false,
    //snapGrid: [50, 50],
    snapToGrid: false, // перетягиваем шагами
    //noDragClassName: 'nodrag',
    //nodesDraggable: false,
    nodes: props.initialNodes,
    edges: props.initialEdges,
})

// Расчитываем позиции таблиц на холсте по геометрии таблиц и наличию связей
let initPosition = (nodes: Ref<GraphNode[]>): void => {
    // @todo добавить логику основанную на наличии связей
    let x = 0
    let y = 0
    let offset = 80
    const maxY = document.documentElement.clientHeight - 200
    let maxWidthInColumn = 0

    nodes.value.forEach((table: GraphNode) => {
        //console.log(x, table.dimensions.width)
        table.position.x = x
        table.position.y = y

        const newY = y + table.dimensions.height
        if (newY > maxY) {
            y = 0
            x +=  table.dimensions.width > maxWidthInColumn ? table.dimensions.width : maxWidthInColumn
            x += offset
            maxWidthInColumn = 0
        } else {
            y = newY + offset
            maxWidthInColumn = table.dimensions.width > maxWidthInColumn ? table.dimensions.width : maxWidthInColumn
        }
    })
}

// через store nodes/edges шарим между компонентами приложения
store.$patch({
    tables: nodes,
    edges: edges,
    settings: {
        vueFlow: {
            panOnDrag,
            panOnScroll,
            panOnScrollSpeed,
        },
    }
})

const paneScrollHandler = debounce(function () {
    isScrollPane.value = true
}, 2000, true, () => {
    isScrollPane.value = false
})
onPaneScroll(paneScrollHandler)

onNodesInitialized(() => {
    initPosition(nodes)
})

// @todo options
// onNodeMouseEnter(({connectedEdges, event, node}) => {
//     connectedEdges.forEach(e => e.selected = true)
// })

//  @todo options
// onNodeMouseLeave(({connectedEdges, event, node}) => {
//     connectedEdges.forEach(e => e.selected = false)
// })

onNodeDoubleClick(({connectedEdges, event, node}) => {
    debugger
    console.log(node)
})

// Добавляем edge при коннекте 2 точек
onConnect(params => {
    addEdges([params])
})

const fullscreen = function() {
    if (!document.fullscreenElement) {
        document.querySelector('#erd-container').requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

// Обновляем связь при перетаскивании связи
// onEdgeUpdate(({edge, connection}) => {
//     updateEdge(edge, connection)
// })

</script>

<template>
    <VueFlow ref="erdElement" class="erd" :class="{isScrollPane}">
        <Controls position="top-right" v-slot:top>
            <ControlButton @click="fullscreen"><i class="i-resize-full-alt" /></ControlButton>
        </Controls>

        <Background variant="lines" pattern-color="rgb(79 137 224 / 0.2)" gap="40" size="0.5"/>
        <MiniMap nodeColor="#17d8b8" nodeStrokeColor="#333" :pannable="true" :zoomable="true"/>

        <template #node-group="node">
            <DbGroup :group="node"/>
        </template>
        <template #node-table="node">
            <DbTable :class="{isScrollPane}" :table="node"/>
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

.isScrollPane .vue-flow__nodes, .isScrollPane .db-table
    pointer-events: none!important
</style>

