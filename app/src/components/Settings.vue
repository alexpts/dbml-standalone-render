<script setup lang="ts">
import {useErdStore} from "../store/ERD.js"
import {vBToggle} from "bootstrap-vue-3";
const store = useErdStore()
</script>

<template>
    <div>
        <h6 class="w-title" v-b-toggle.collapse-settings>Настройки:</h6>

        <b-collapse visible id="collapse-settings">
            <b-form-checkbox size="sm" v-model="store.settings.editMode">Edit mode</b-form-checkbox>
            <b-form-checkbox size="sm" v-model="store.settings.vueFlow.panOnDrag">Pan on drag</b-form-checkbox>
            <b-form-checkbox size="sm" v-model="store.settings.vueFlow.panOnScroll">Pan on scroll</b-form-checkbox>
            <b-form-input size="sm" v-model="store.settings.vueFlow.panOnScrollSpeed" placeholder="panOnScrollSpeed" />
        </b-collapse>
    </div>

</template>

<style scoped lang="sass">
</style>
