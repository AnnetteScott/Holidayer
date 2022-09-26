<template>
    <ion-page>
        <headerTop title="Holidays"></headerTop> 
        <ion-content :fullscreen="true">   

        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import headerTop from '@/components/headerTop.vue';
export default defineComponent({
    name: 'HolidaysPage',
    components: {
        headerTop,
        IonContent,
        IonPage
    }
});
</script>

<style scoped>
    
</style>
