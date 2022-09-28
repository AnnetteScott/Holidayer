<template>
    <ion-page>
        <headerTop :title="($route.params.title as string)"></headerTop> 
        <ion-content :fullscreen="true">   
            <div class="page">
                Welcome
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonButton } from '@ionic/vue';
import headerTop from '@/components/headerTop.vue';
import { returnAuth, returnDataBase } from '@/firebase'
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
export default defineComponent({
    name: 'HolidaysPage',
    components: {
        headerTop,
        IonContent,
        IonButton,
        IonPage
    },
    data(){
        return {
            dataBase: {} as DocumentData,
            unsub: {} as Unsubscribe,
            backgroundImages: ['holiday_one.webp', 'holiday_two.webp', 'holiday_three.webp', 'holiday_four.webp', 'holiday_five.webp', 'holiday_six.webp', 'holiday_seven.webp', 'holiday_eight.webp'],
        }
    },
    mounted(){
        this.watchDataBase()
        console.log("hi0")
    },
    methods: {
        watchDataBase(){
            const db = returnDataBase()
            const auth = returnAuth()
            if(auth.currentUser != null){
                const uid = auth.currentUser.uid
                this.unsub = onSnapshot(doc(db, "data", uid), (doc) => {
                    this.dataBase = doc.data()?? {}
                    console.log("Current data: ", doc.data());
                });
            }
        }
    },
    watch: {
        $route(to, from){
            if(to.name == "TripPage"){
                this.watchDataBase()
            }
            else {
                this.unsub()
            }
        }
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap');
.holiday_container{
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.holiday_item{
    height: 70px;
    border-radius: 20px;
    box-shadow: 0 10px 20px #00000026, 0 6px 6px #0000000c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-family: 'Bungee Spice', sans-serif;
    border: 1px solid #000000d3;
}
</style>
