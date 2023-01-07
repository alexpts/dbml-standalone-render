<script setup lang="ts">
import {useErdStore} from "../store/ERD.js"
const store = useErdStore()

</script>

<template>
    <div class="table-fields" v-if="store.activeTableInfo">
        <h4>Таблица: {{ store.activeTableInfo.id }}</h4>
        <!-- add `refs` column -->
        <b-table
            style="font-size: 12px" striped="" hover=""
            :fields="['name', 'type', 'note', 'tags']"
            :items="store.activeTableInfo.data.fields"
        >
            <template v-slot:cell(type)="data">
                {{ data.value.type_name }}
            </template>

            <template #cell(note)="data">
                <b-form-textarea size="sm" v-if="store.settings.editMode"
                    v-model="data.value"
                    placeholder="note..."
                    rows="1"
                    max-rows="6"
                />
                <template v-else>{{ data.value }}</template>
            </template>

        </b-table>
    </div>
</template>

<style scoped lang="sass">
</style>
