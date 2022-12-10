import { defineStore } from 'pinia'

export const useErdStore = defineStore('ERD', {
    state: () => ({
        tables: [],
        edges: [],
    }),

    getters: {
        // visibleTables: (state) => state.tables.filter(t => !t.hidden)
    },

    actions: {
        addTable() {
            //this.tables = this.tables.push()
        },
    },
})