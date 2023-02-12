<script setup lang="ts">
// @ts-ignore
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
})

const markdownFilter = (content: string): string => {
    return markdown.render(content)
}

const props = defineProps({
    name: {
        type: String,
        default: "Новый проект",
        required: false,
    },
    note: {
        type: String,
        default: "",
        required: false,
    }
})

</script>

<template>
    <div class="project">
        <h4>Проект: {{ props.name }}</h4>
        <div v-html="markdownFilter(props.note.value)"></div>
    </div>
</template>


<style lang="sass">
</style>>