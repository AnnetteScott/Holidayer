<template>
    <ion-page>
        <headerTop :title="($route.params.title as string) + ' Holiday'"></headerTop> 
        <ion-content :fullscreen="true">   
            <div class="page">
                <p style="text-align: center;font-size: 1.2rem; margin-bottom: 5px;">Days until the holiday begins: {{daysTill}}</p>
                <div class="budget">
                    <template v-if="holID != ''">
                        <div class="budget_items" v-for="(budgetInfo, name) in dataBase.holidays[holID].budget" :key="name">
                            <p style="text-align: center; font-family: 'Bungee Spice', sans-serif;">{{name}}</p>
                            <div class="budget_info">
                                <p>Budget: ${{budgetInfo.amount}}</p>
                                <p>Left: ${{budgetInfo.amount - budgetInfo.alreadyUsed}}</p>
                            </div>
                            <div class="budget_amount"> 
                                <p class="budget_amount_p">Used: ${{budgetInfo.alreadyUsed}}</p>
                                <div class="budget_amount_bar" :style="{'width': `${(budgetInfo.alreadyUsed / budgetInfo.amount * 100) >= 100 ? '100%': (budgetInfo.alreadyUsed / budgetInfo.amount * 100).toFixed(0)}%`}"></div>
                            </div>
                        </div>
                    </template>
                </div>
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
import { MainData } from '@/types'
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
            dataBase: {} as DocumentData as MainData,
            unsub: {} as Unsubscribe,
            backgroundImages: ['holiday_one.webp', 'holiday_two.webp', 'holiday_three.webp', 'holiday_four.webp', 'holiday_five.webp', 'holiday_six.webp', 'holiday_seven.webp', 'holiday_eight.webp'],
            holID: '',
            dateString: '',
            dateObject: {} as Date,
            daysTill: 0
        }
    },
    mounted(){
        this.watchDataBase()
    },
    methods: {
        watchDataBase(){
            const db = returnDataBase()
            const auth = returnAuth()
            if(auth.currentUser != null){
                const uid = auth.currentUser.uid
                this.unsub = onSnapshot(doc(db, "data", uid), (doc) => {
                    // @ts-expect-error: don't want to do holidays holidays thing
                    this.dataBase = doc.data()?? {}
                    this.holID = this.$route.params.id as string
                    console.log("Current data: ", doc.data());
                    this.getDays()
                });
            }
        },
        getDays(){
            let date = this.dataBase.holidays[this.holID].startDate
            this.dateString = `${date.split('-')[1]}-${date.split('-')[2]}-${date.split('-')[0]}`
            this.dateObject = new Date(this.dateString)
            let today = new Date()
            this.daysTill =  this.dateObject.getTime() - today.getTime();
            this.daysTill = Math.floor(this.daysTill / (24*60*60*1000));
        }
    },
    watch: {
        $route(to, from){
            console.log(to.name)
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
.budget{
    padding: 10px 3px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.budget_items{
    padding: 15px 5px;
    border-radius: 10px;
    box-shadow: 0 5px 10px #00000026, 0 6px 6px #0000000c;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border: 1px solid cornflowerblue;
}

.budget_info{
    display: flex;
    justify-content: space-around;
    font-size: 0.8rem;
}

.budget_amount{
    position: relative;
    height: 1rem;
}

.budget_amount_bar{
    position: absolute;
    background: #27D800;
    border-radius: 4px;
    top: 0px;
    bottom: 0px;
    z-index: 0;
}

.budget_amount_p{
    z-index: 1;
    position: relative;
    text-align: center;
    font-size: 0.8rem;
}
</style>
