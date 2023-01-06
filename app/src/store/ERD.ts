import {defineStore} from 'pinia'
import {GraphNode} from "@vue-flow/core/dist/types/node"
import {GraphEdge} from "@vue-flow/core/dist/types/edge"
import {Edge, Node} from "@vue-flow/core/dist/types"
import {dbml} from '../components/ERD/demo-dbml'
import {mergeWith} from 'lodash-es'

type Filters = {
    tags: Object
}

interface ErdState {
    tables: GraphNode[]
    edges: GraphEdge[]
    singleModeTable: GraphNode|null
    _activeTableInfo: GraphNode|null,
    dbmlRaw: string,
    extraData: Object,
    filters: Filters,
    editMode: Boolean
}

export const useErdStore = defineStore('ERD', {
    state: (): ErdState => ({
        dbmlRaw: dbml,
        extraData: {
            nodes: {},
            edges: {},
        }, // объект конфигурации из yaml
        tables: [],
        edges: [],
        singleModeTable: null,
        _activeTableInfo: null,
        filters: {
            tags: {}
        },
        editMode: true
    }),

    getters: {
        tablesByTags: (state) => {
            let activeTagCount = 0
            // @ts-ignore
            for (const [_, isActive] of Object.entries(state.filters.tags)) {
                isActive && activeTagCount++
            }

            if (activeTagCount === 0) {
                return state.tables
            }

            // фильтры через OR, не через AND
            const tags = state.filters.tags
            return state.tables.filter(table => {
                // Теги у таблиц
                const tableHasTag = table.data.tags.find(t => tags[t])
                if (tableHasTag) {
                    return true;
                }

                // Теги у полей
                // @ts-ignore
                for (const [_, field] of Object.entries(table.data.fields || {})) {
                    if (field.tags.find(t => tags[t])) {
                        return true
                    }
                }

                return false
            })
        },
        tags: (state) => state.filters.tags,
        visibleTables: (state) => state.tables.filter(t => !t.hidden),
        activeTableInfo: (state) => {
            let table = state._activeTableInfo || state.tables[0] || null
            if (table === null) {
                return null
            }

            const t = table.data.dbmlTable;

            return {
                name: t.name,
                note: t.note,
                tags: t.tags || [],
                fields: t.fields.map((field) => {
                    return {
                        name: field.name,
                        note: field.note,
                        type: field.type.schemaName ? field.type.schemaName + '.' + field.type.type_name : field.type.type_name,
                        tags: field.tags || []
                    }
                })
            }
        },
    },

    actions: {
        initTags(nodes: Node[]): void {
            nodes.forEach((node: Node) => {
                node.data.tags.forEach(tag => {
                    this.filters.tags[tag] = false
                })

                node.data.fields ??= {}
                // @ts-ignore
                for (const [_, data] of Object.entries(node.data.fields)) {
                    data.tags.forEach(tag => {
                        this.filters.tags[tag] = false
                    })
                }
            })
        },
        applyExtraData(nodes: Node[], edges: Edge[]): void {
            nodes.forEach((node: Node) => {
                mergeWith(node, this.extraData.nodes?.[node.id], (destValue, sourceValue, key: String, dest, source, stack: Number) => {
                    if (Array.isArray(destValue) && Array.isArray(sourceValue)) {
                        // @todo custom for any cases, для ряда кейсов нужно объединять
                        return destValue.concat(sourceValue);
                    }
                })
            })
        },
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