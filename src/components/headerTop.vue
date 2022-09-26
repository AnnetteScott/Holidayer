<template>
    <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button color="primary"></ion-menu-button>
            </ion-buttons>
            <ion-title>{{ title }}</ion-title><!-- $route.params.id -->
        </ion-toolbar>
    </ion-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/vue';

export default defineComponent({
    name: 'headerTop',
    components: {
        IonButtons,
        IonHeader,
        IonMenuButton,
        IonTitle,
        IonToolbar
    },
    props: {
        title: String
    }
});
</script>
