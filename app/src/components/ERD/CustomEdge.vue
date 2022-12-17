<script>
export default {
    inheritAttrs: false
}
</script>

<script setup>
import {computed} from "vue";
import {getSmoothStepPath, BaseEdge, getBezierPath} from "@vue-flow/core";
import {useErdStore} from "../../store/ERD.ts";

const store = useErdStore()

// all props - https://github.com/bcakmakoglu/vue-flow/blob/master/docs/src/guide/edge.md
let props = defineProps({
    id: {
        type: String,
        required: true,
    },
    sourceX: {
        type: Number,
        required: true,
    },
    sourceY: {
        type: Number,
        required: true,
    },
    targetX: {
        type: Number,
        required: true,
    },
    targetY: {
        type: Number,
        required: true,
    },
    sourcePosition: {
        type: String,
        required: true,
    },
    targetPosition: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: false,
    },
    style: {
        type: Object,
        required: false,
    },
    offset: {
        type: Number,
        required: false,
    }
})

const socketW = 10; // ширина точки соединения, рисуется слева от точки по дефолту

// точку соединения рисуем 1 в центре поля. Компенсируем path на ширину блока и ширину точки соединения (position.left)
let state = computed(() => {
    let edge = store.edges.find((e) => e.id === props.id)

    const sourceIsLeft = props.sourceX > props.targetX
    const sourceXCompensation = sourceIsLeft ? -edge.sourceNode.dimensions.width / 2 : edge.sourceNode.dimensions.width / 2 + socketW;
    const targetXCompensation = sourceIsLeft ? edge.targetNode.dimensions.width / 2 + socketW : -edge.targetNode.dimensions.width / 2;

    const path = getSmoothStepPath({
        ...props, offset: 4,
        sourcePosition: sourceIsLeft ? 'left' : 'right',
        targetPosition: sourceIsLeft ? 'right' : 'left',
        sourceX: props.sourceX + sourceXCompensation,
        targetX: props.targetX + targetXCompensation,
    })

    return {
        path,
        sourceXCompensation,
        targetXCompensation,
        sourceIsLeft,
        sourceRelation: edge.data.sourceRelation,
        targetRelation: edge.data.targetRelation
    }
})

// to right-bottom
// (q s,0,s,s)  (l x y)  (q 0,s,s,s)
// если высота минимальная,то перейти с getSmoothStepPath() на getBezierPath()
// beizer - (m 0 0 c 100 0 100 20 200 20)
// x, y, x2, y2 (m x y c avg(x,x2) 0 avg(x,x2) y2 x2 y2))
</script>
<!--
Рисуем точку в середине поля или на все поле для соединения
Далее делаем опрелеляем в какую сторону должна идти линия, делаем сдвиг на половину ширины таблицы у линии в M${sourceX +- offset}, sourceY
Рисуем линию в точку назначения минус компенсация на половину ширины target таблицы `L ${targetX +- offset2} ${targetY}`
Потом уже красоту наведем из заготовленных линий
-->
<template>
    <text font-size="11px" fill="#ccc" :x="sourceX + state.sourceXCompensation + (state.sourceIsLeft ? -6 : 0)"
          :y="sourceY - 6">{{ state.sourceRelation }}
    </text>
    <text font-size="11px" fill="#ccc" :x="targetX + state.targetXCompensation + (state.sourceIsLeft ? 0 : -6)"
          :y="targetY - 6">{{ state.targetRelation }}
    </text>

    <BaseEdge :id="id" :style="style" :path="state.path[0]"/>
</template>
