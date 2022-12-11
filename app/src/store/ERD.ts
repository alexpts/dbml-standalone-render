import { defineStore } from 'pinia'
import {GraphNode} from "@vue-flow/core/dist/types/node";
import {GraphEdge} from "@vue-flow/core/dist/types/edge";

interface ErdState {
    tables: GraphNode[]
    edges: GraphEdge[]
    singleModeTable: GraphNode|null
}

export const useErdStore = defineStore('ERD', {
    state: (): ErdState => ({
        tables: [],
        edges: [],
        singleModeTable: null,
    }),

    getters: {
        // visibleTables: (state) => state.tables.filter(t => !t.hidden)
    },

    actions: {
        /**
         * Скрывает все таблицы, кроме table и прямую связь на 1 шаг по графу
         */
        actionModeSingleTable(table: GraphNode): void {
            console.log(this.singleModeTable)

            this.singleModeTable = this.singleModeTable?.id === table.id ? null : table
            const hideAll = this.singleModeTable !== null

            this.tables.forEach((t: GraphNode) => t.hidden = hideAll)
            table.hidden = false

            if (this.singleModeTable) {
                this.edges.forEach((edge: GraphEdge) => {
                    if (edge.sourceNode.id === table.id || edge.targetNode?.id === table.id) {
                        edge.sourceNode.hidden = false
                        edge.targetNode.hidden = false
                    }
                })
            }
        },
    },
})