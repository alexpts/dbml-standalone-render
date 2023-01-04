<script setup lang="ts">
import yaml from 'js-yaml'
import {parseDBMLToJSON} from '../ERD/dbml-convertor'
// https://medium.com/@jackub/writing-custom-ace-editor-mode-5a7aa83dbe50
import {VAceEditor} from 'vue3-ace-editor'
VAceEditor.name = 'AceEditor'
import './ace/ace-config.js';


import {useErdStore} from "../../store/ERD";
import {ref} from "vue";

const erdStore = useErdStore()

const yamlContent = ref(`nodes:
    countries:
        data:
            headerColor: red
            tags: [1, 2, 'sd']`)

// @todo add local storage
const dbmlContent = ref('' + erdStore.dbmlRaw)

const saveDbml = () => {
    try {
        erdStore.extraData = yaml.load(yamlContent.value, {
            onWarning: console.warn,
            json: true
        })
    } catch (e) {
        alert('Пользовательские настройки yaml не были применены. Ошибка в yaml')
        throw e
    }

    try {
        parseDBMLToJSON.parse(dbmlContent.value)
    } catch (e) {
        alert('Ошибка в DBML. Не сохранено')
        throw e
    }

    erdStore.dbmlRaw = dbmlContent.value
}
</script>

<template>
    <div class="middle">
        <VAceEditor
            class="dbml-editor"
            v-model:value="dbmlContent"
            lang="sql"
            theme="clouds"
            :options="{
                useWorker: false,
                enableBasicAutocompletion: true,
                //enableSnippets: true,
                enableLiveAutocompletion: true
            }"
        />

        <VAceEditor
            class="yaml-editor"
            v-model:value="yamlContent"
            lang="yaml"
            theme="clouds"
            style="height: 300px"
            :options="{
                useWorker: true,
                enableBasicAutocompletion: true,
                //enableSnippets: true,
                enableLiveAutocompletion: true
            }"
        />

        <div>
            <b-button @click="saveDbml" variant="primary">Сохранить</b-button>
            <b-button @click="saveDbml" variant="secondary">Загрузить состояние из стора</b-button>
        </div>
    </div>
</template>

<style lang="sass">
.dbml-editor, .yaml-editor
    width: 40%
    height: 100%
    min-height: 100%
    border: 1px solid #ccc
    background: #fafafa
</style>>