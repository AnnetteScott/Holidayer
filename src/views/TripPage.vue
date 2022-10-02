<template>
	<ion-page>
		<headerTop :title="($route.params.title as string) + ' Holiday'"></headerTop> 
		<ion-content :fullscreen="true">   
			<div class="page">
				<div class="inner">
					<p style="text-align: center;font-size: 0.9rem; margin-bottom: 5px;">Days until the holiday begins: {{daysTill}}</p>
                    <!-- BUDGET -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Budget'">
                        <p style="text-align: center;font-size: 0.9rem; margin-bottom: 5px;">Total Budget: ${{budgetTotal}} &nbsp;&nbsp;&nbsp; Amount Left: ${{budgetLeft}}</p>
						<ion-button expand="block" @click="popup = 'Budget_Creation'">Create New Budget Item</ion-button>
						<div class="item_container">
							<template v-if="holID != ''">
								<div class="budget_items" v-for="name in budgetNames" :key="name" @click="editBudget(name)">
									<p style="text-align: center; font-family: 'Bungee Spice', sans-serif;">{{name}}</p>
									<p style="font-size: 1rem;text-align: center;">Left: ${{budgetInfo[name].amount - budgetInfo[name].alreadyUsed}}</p>
									<div class="budget_amount"> 
										<div class="budget_amount_bar" :style="{'width': `${(budgetInfo[name].alreadyUsed / budgetInfo[name].amount * 100) >= 100 ? '100%': (budgetInfo[name].alreadyUsed / budgetInfo[name].amount * 100).toFixed(0)}%`}">
											Used: ${{budgetInfo[name].alreadyUsed}}
										</div>
									</div>
								</div>
							</template>
						</div>
					</div>
                    
                    <!-- SCHEDULE -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Schedule'">
						<ion-button expand="block" @click="popup = 'Budget_Creation'">Create New Schedule Item</ion-button>
						<div class="item_container">
							<template v-if="holID != ''">
								
							</template>
						</div>
					</div>
                    
                    <!-- ATTRACTIONS -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Attractions'">
						<ion-button expand="block" @click="popup = 'Attraction_Creation'">Create New Attraction</ion-button>
						<div class="item_container">
							<template v-if="holID != ''">
								
							</template>
						</div>
					</div>
                    
                    <!-- INFO -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Useful'">
						<ion-button expand="block" @click="popup = 'Budget_Creation'">Create New Info</ion-button>
						<div class="item_container">
							<template v-if="holID != ''">
								
							</template>
						</div>
					</div>


                    <div class="trip_item_creation" v-if="popup == 'Budget_Creation'">
                        <div>
                            <label>Name: </label>
                            <input v-model="budgetCreationName">
                            <label>Amount: $</label>
                            <input v-model="budgetCreationAmount" type="number">
                            <label>Used: $</label>
                            <input v-model="budgetCreationUsed" type="number">
                            <ion-button @click="applyBudget()">Create</ion-button>
                            <ion-button @click="clear()">Back</ion-button>
                        </div>
                    </div>
                    
                    <div class="trip_item_creation" v-if="popup == 'Budget_Edit'">
                        <div>
                            <label>Amount: $</label>
                            <input v-model="budgetCreationAmount" type="number">
                            <label>Used: $</label>
                            <input v-model="budgetCreationUsed" type="number">
                            <ion-button @click="applyBudget()">Save</ion-button>
                            <ion-button @click="clear()">Back</ion-button>
                        </div>
                    </div>
                    
                    <div class="trip_item_creation" v-if="popup == 'Attraction_Creation'">
                        <div>
                            <label>Name:</label>
                            <input v-model="attractionCreationName">
                            <label>Amount: $</label>
                            <input v-model="attractionCreationCost" type="number">
                            <label>Place: </label>
                            <input v-model="attractionCreationPlace">
                            <ion-button @click="''">Create</ion-button>
                            <ion-button @click="clear()">Back</ion-button>
                        </div>
                    </div>


					<div class="tabs">
						<div @click="tab = 'Budget'" class="inner_tabs">Budget</div>
						<div @click="tab = 'Schedule'" class="inner_tabs">Schedule</div>
						<div @click="tab = 'Attractions'" class="inner_tabs">Attractions</div>
						<div @click="tab = 'Useful'" class="inner_tabs">Info</div>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonButton } from '@ionic/vue';
import headerTop from '@/components/headerTop.vue';
import { returnAuth, returnDataBase, applyBudgetItem } from '@/firebase'
import { Unsubscribe } from "firebase/auth";
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
			popup: '',
			tab: '',
			holID: '',
			dateString: '',
			dateObject: {} as Date,
			daysTill: 0,
            budgetTotal: 0,
            budgetLeft: 0,
            budgetNames: [] as string[],
            budgetInfo: {} as {[key: string]: {amount: number, alreadyUsed: number}},
			budgetCreationName: '',
			budgetCreationAmount: 0,
			budgetCreationUsed: 0,
            attractionCreationName: '',
            attractionCreationCost: 0,
            attractionCreationPlace: ''
		}
	},
	mounted(){
		this.watchDataBase()
        this.clear()
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
					this.showBudgetTotal()
                    this.budgetNames = Object.keys(this.dataBase.holidays[this.holID].budget).sort()
                    this.budgetInfo = this.dataBase.holidays[this.holID].budget
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
		},
        editBudget(name: string | number){
            this.budgetCreationName = name.toString();
            this.budgetCreationAmount = this.dataBase.holidays[this.holID].budget[name].amount
            this.budgetCreationUsed = this.dataBase.holidays[this.holID].budget[name].alreadyUsed
            this.popup = 'Budget_Edit'
        },
        async applyBudget(){
            // @ts-expect-error: It can be a string and it shouldn't be and ts doesn't pick it up
            this.budgetCreationUsed == '' ? this.budgetCreationUsed = 0 : this.budgetCreationUsed
            await applyBudgetItem(this.holID, this.budgetCreationName, this.budgetCreationAmount, this.budgetCreationUsed)
            this.clear()
        },
        clear(){
            this.popup = ''
            this.budgetCreationName = ''
            this.budgetCreationAmount = 0
            this.budgetCreationUsed = 0
        },
        showBudgetTotal(){
            this.budgetTotal = 0
            this.budgetLeft = 0
            for(const[name, info] of Object.entries(this.dataBase.holidays[this.holID].budget)){
                this.budgetTotal += info.amount
                this.budgetLeft += info.amount - info.alreadyUsed
            }
        },

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
            this.clear()
            this.tab = ''
		}
	}
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap');
.tabs{
	right: 0px;
	left: 0px;
	position: absolute;
	bottom: 0px;
	height: 50px;
	display: flex;
	box-shadow: 0px 0px 7px -3px #000;
}

.inner_tabs{
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	font-size: 0.8rem;
}

.inner{
	height: calc(100% - 45px);
	display: flex;
	flex-direction: column;
}

.item_container{
	padding: 10px 3px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	height: 100%;
	overflow: auto;
}

.budget_items{
	padding: 5px 5px;
	border-radius: 10px;
	box-shadow: 0 5px 10px #00000026, 0 6px 6px #0000000c;
	display: flex;
	flex-direction: column;
	gap: 10px;
	border: 1px solid cornflowerblue;
}

.budget_amount{
	height: 1rem;
	display: flex;
    justify-content: space-between;
}

.budget_amount_bar{
	background: #27D800;
	border-radius: 4px;
	top: 0px;
	bottom: 0px;
	z-index: 0;
	white-space: nowrap;
    font-size: 0.8rem;
}

.trip_item_creation{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    width: calc(100% - 20px);
    height: calc(100% - 56px - 10px - 50px);
}

.trip_item_creation div{
    background-color: white;
    padding: 25px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    border: 1px solid black;
    overflow: auto;
}

input{
    padding: 5px;
    border-radius: 15px;
    width: 20ch;
}

</style>
