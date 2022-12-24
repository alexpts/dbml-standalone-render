import { defineStore } from 'pinia'
import {GraphNode} from "@vue-flow/core/dist/types/node";
import {GraphEdge} from "@vue-flow/core/dist/types/edge";

interface ErdState {
    tables: GraphNode[]
    edges: GraphEdge[]
    singleModeTable: GraphNode|null
    _activeTableInfo: GraphNode|null,
    dbmlRaw: string
}

export const useErdStore = defineStore('ERD', {
    state: (): ErdState => ({
        dbmlRaw: "",
        tables: [],
        edges: [],
        singleModeTable: null,
        _activeTableInfo: null,
    }),

    getters: {
        visibleTables: (state) => state.tables.filter(t => !t.hidden),
        activeTableInfo: (state) => state._activeTableInfo || state.tables[0] || null,
    },

    actions: {
        /**
         * Скрывает все таблицы, кроме table и прямую связь на 1 шаг по графу
         */
        actionModeSingleTable(table: GraphNode): void {
            this.singleModeTable = this.singleModeTable?.id === table.id ? null : table
            const hideAll = this.singleModeTable !== null

            this.$patch((state) => {
                let size = state.tables.length
                let tables = state.tables
                while (size--) {
                    tables[size].hidden = hideAll // под капотом долгие unmount в vue-flow
                }

                table.hidden = false
                table.data.hide = false
            })

            if (this.singleModeTable) {
                this.edges.forEach((edge: GraphEdge) => {
                    if (edge.sourceNode.id === table.id || edge.targetNode.id === table.id) {
                        edge.sourceNode.hidden = false
                        edge.targetNode.hidden = false
                    }
                })
            }
        },
    },
})