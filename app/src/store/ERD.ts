import {defineStore} from 'pinia'
import {GraphNode} from "@vue-flow/core/dist/types/node"
import {GraphEdge} from "@vue-flow/core/dist/types/edge"
import {Edge, Node} from "@vue-flow/core/dist/types"
import {dbml} from '../components/ERD/demo-dbml'
import {mergeWith} from 'lodash-es'

class Tag {
    readonly id: string
    label?: string
    isFilterSelected: boolean = false

    constructor(id: string) {
        this.id = id.toString()
    }
}

interface ErdState {
    tables: GraphNode[]
    edges: GraphEdge[]
    singleModeTable: GraphNode|null
    _activeTableInfo: GraphNode|null,
    dbmlRaw: string,
    extraData: Object,
    tags: Record<string, Tag>,
    settings: {
        editMode: boolean,
        vueFlow: {
            panOnDrag: boolean,
            panOnScroll: boolean,
            panOnScrollSpeed: number
        }
    }
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
        tags: {
            ro: new Tag('ro')
        },
        settings: {
            editMode: false,
            vueFlow: {
                panOnDrag: false,
                panOnScroll: true,
                panOnScrollSpeed: 1.4,
            }
        }
    }),

    getters: {
        isFilterSelectedTags(): Record<string, Tag> {
            const result: Record<string, Tag> = {}

            // @ts-ignore
            for (const tag of Object.values(this.tags)) {
                if (tag.isFilterSelected) {
                    result[tag.id] = tag
                }
            }

            return result
        },

        tablesByTags(state) {
            if (Object.keys(this.isFilterSelectedTags).length === 0) {
                return state.tables
            }

            // фильтры через OR, не через AND
            return state.tables.filter(table => {
                // Теги у таблиц
                const isSelectedTag = table.data.tags.find(t => this.tags[t].isFilterSelected)
                if (isSelectedTag) {
                    return true;
                }

                // Теги у полей
                // @ts-ignore
                for (const field of Object.values(table.data.fields || {})) {
                    if (field.tags.find(t => this.tags[t].isFilterSelected)) {
                        return true
                    }
                }

                return false
            })
        },
        visibleTables: (state) => state.tables.filter(t => !t.hidden),
        activeTableInfo: (state): GraphNode|null => {
            return state._activeTableInfo || state.tables[0] || null;
        },
    },

    actions: {
        initTags(nodes: Node[]): void {
            nodes.forEach((table: Node) => {
                // По таблицам
                table.data.tags.forEach(tag => {
                    this.tags[tag] = new Tag(tag)
                })

                // По полям
                // @ts-ignore
                for (const field of Object.values(table.data.fields)) {
                    field.tags.forEach(tag => {
                        this.tags[tag] = new Tag(tag)
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