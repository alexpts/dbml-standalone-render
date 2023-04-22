<script setup lang="ts">

//import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import './vendor/fontello/dbml-embedded.css'
</script>

<template>
    <header class="comp-layer">
        <span class="logo">DBML Visualizer</span>
        <router-link :to="{name: 'view-page'}">Просмотр</router-link>
        <router-link :to="{name: 'editor-page'}">Editor</router-link>
    </header>

    <router-view></router-view>
<!--    <router-view v-slot="{ Component }">-->
<!--        <transition name="fade">-->
<!--            <component :is="Component" />-->
<!--        </transition>-->
<!--    </router-view>-->
</template>


<style lang="sass">
\:root
    --left-panel-width: 300px

.f-col
    display: flex
    flex-direction: column

.comp-layer
    will-change: transform

html, body, #app
    overflow: hidden

#app
    font-family: "Open Sans",sans-serif
    //-webkit-font-smoothing: antialiased
    //-moz-osx-font-smoothing: grayscale

    width: 100vw
    height: 100vh

    display: flex
    flex-direction: column

    header
        box-shadow: 0 -3px 1px -2px #000 inset
        padding: 10px
        background: #316997
        color: #ddd
        display: flex
        justify-content: start

        .logo
            color: #fff

        a
            color: inherit
            text-decoration: none
            margin: 0 12px
            border-bottom: 2px solid transparent

            &:hover
                color: #fff
                border-bottom: 2px solid #fff

    .middle
        position: relative
        flex-grow: 1
        display: flex
        flex-direction: row


        .aside-panel
            width: var(--left-panel-width)
            background: #f7f7f7
            border-right: 1px solid #ddd
            color: #999
            position: absolute
            top: 0
            bottom: 0
            left: 0

        .content
            flex-grow: 1
            left: var(--left-panel-width) // compensation for left panel
            right: 0
            top: 0
            bottom: 0
            overflow-y: scroll
            position: absolute
            padding: 20px


// scroll
.invisible-scrollbar::-webkit-scrollbar
    display: none

::-webkit-scrollbar-track
    box-shadow: inset 0 0 1px rgba(0,0,0,.1)
    border-radius: 8px
    background-color: #f0f0f0

::-webkit-scrollbar
    width: 5px

::-webkit-scrollbar-thumb
    border-radius: 10px
    box-shadow: inset 0 0 1px rgba(0,0,0,.2)
    background-color: #c7d1d9
</style>>
