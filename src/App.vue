<template>
    <LoadingScreen :showLoadingScreen="showLoadingScreen"/>
    <ion-app v-if="!showLoadingScreen">
        <ion-router-outlet />
    </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import LoadingScreen from '@/components/LoadingScreen.vue'
export default defineComponent({
    name: 'App',
    components: {
        LoadingScreen,
        IonApp,
        IonRouterOutlet
    },
    data() {
        return {
            showLoadingScreen: false
        }
    }
});
</script>

<style>
p{
    margin: 0px;
}
.page{
    padding: 10px;
    width: 100%;
    height: 100%;
}

a{
    text-decoration: none
}
</style>