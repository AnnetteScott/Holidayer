<template>
    <ion-page>
        <headerTop title="Holiday Creation"></headerTop> 
        <ion-content :fullscreen="true">   
            <div class="page">
                <form @submit.prevent="addHoliday()"> 
                    <div class="inner_form">
                        <!-- Holiday Name -->
                        <div class="item">
                            <label>Name: </label>
                            <input required v-model="holidayName">
                        </div>
                        <!-- Start Date -->
                        <div class="item">
                            <label>Start Date: </label>
                            <input required type="date" v-model="holidayDate">
                        </div>
                        <div class="item">
                            <label>Days: </label>
                            <input required type="number" v-model="holidayDuration" style="width:10ch">
                        </div>
                        <!-- Budget -->
                        <div id="budgets">
                            <div class="top">
                                <label>Budget: </label>
                                <ion-button expand="block" shape="round" @click="AmountOfBudget++">
                                    <label>&nbsp;Add Item</label>
                                </ion-button>
                            </div>
                            <div class="budget_item" v-if="AmountOfBudget > 0">
                                <div v-for="number in AmountOfBudget" :key="number" style="display: flex; flex-direction: column; border-bottom: 1px solid black; padding: 5px 3px;">
                                    <div style="display: flex; justify-content: space-between;">
                                        <label>Name: </label>
                                        <input v-model="holidayBudgetName[number - 1]" style="width: 16ch">
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <label>Amount: $</label>
                                        <input v-model="holidayBudgetAmount[number - 1]" type="number" style="width: 16ch">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
					<ion-button expand="block" shape="round" type="submit" value="Submit" style="bottom: 10px">Add Holiday</ion-button>
				</form> 
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonButton } from '@ionic/vue';
import headerTop from '@/components/headerTop.vue';
import { addHolidayToDB } from '@/firebase'
import { HolidayLayout } from '@/types'
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
            holidayName: '',
			holidayDate: '',
			holidayBudgetName: [],
			holidayBudgetAmount: [],
			holidayDuration: 0,
			AmountOfBudget: 0,
        }
    },
    mounted(){

    },
    methods: {
        async addHoliday(){
            const hoidayID = this.generateID() as string
            let data = {} as HolidayLayout
			data[hoidayID] = {
				attractions: {},
				budget: {},
				info: {},
				duration: this.holidayDuration, 
				name: this.holidayName, 
				schedule: {},
				startDate: this.holidayDate

			}
			if(this.AmountOfBudget > 0){
				for(let num = 0; num < this.AmountOfBudget; num++){
                    if(this.holidayBudgetName[num] != undefined){
                        let amount = this.holidayBudgetAmount[num] ?? 0
                        data[hoidayID].budget[this.holidayBudgetName[num]] = {amount, alreadyUsed: 0}
                    }
				}
			}
            await addHolidayToDB(data)
			this.holidayBudgetAmount = []
			this.holidayBudgetName = []
			this.holidayDate = ''
			this.holidayDuration = 0
			this.holidayName = ''
			this.AmountOfBudget = 0
			this.$router.push('Holidays')
        },
        generateID(){
			const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const length = 8
			let result = '' as string;
            //Generate an ID.
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
                if(i >= 120){
                    return
                }
            }
			return result;
		}
    }
});
</script>

<style scoped>
#budgets{
	display: flex;
	flex-direction: column;
	width: 100%;
    height: 100%;
    overflow: hidden;
}
.top{
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
    border-bottom: 1px solid black;
}

input{
    padding: 5px;
    border-radius: 15px;
}

.item{
    padding: 8px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

form{
    margin: 0;
    font: inherit;
    color: inherit;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.budget_item{
    overflow: auto;
    height: 100%;
}

.inner_form{
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;
}
</style>
