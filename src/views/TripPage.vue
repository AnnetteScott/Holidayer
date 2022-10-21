<template>
	<ion-page>
		<headerTop :title="($route.params.title as string) + ' Holiday'"></headerTop> 
		<ion-content :fullscreen="true">   
			<div class="page">
				<div class="inner">
					<p class="centerp" style="margin-bottom: 5px;">Days until the holiday begins: {{daysTill}}</p>
					<!-- BUDGET PAGE -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Budget'">
						<p class="centerp" style="margin-bottom: 5px;">Total Budget: ${{budgetTotal}} &nbsp;&nbsp;&nbsp; 
							<span :style="`${budgetLeft >= 0 ? 'color: #03D400;': 'color: red;'}`">Amount Left: ${{budgetLeft}}</span></p>
						<ion-button expand="block" @click="popup = 'Budget_Creation'">Create New Budget Item</ion-button>

						<div class="item_container">
							<template v-if="holID != ''">
								<div class="trip_items_card" v-for="name in budgetNames" :key="name" @click="editBudget(name)">
									<p class="centerp titlefont">{{name}}</p>
									<p class="centerp" style="font-size: 1rem;">Left: ${{budgetInfo[name].amount - budgetInfo[name].alreadyUsed}}</p>
									<div class="budget_amount"> 
										<div class="budget_amount_bar" :style="{'width': `${(budgetInfo[name].alreadyUsed / budgetInfo[name].amount * 100) >= 100 ? '100%': (budgetInfo[name].alreadyUsed / budgetInfo[name].amount * 100).toFixed(0)}%`}">
											Used: ${{budgetInfo[name].alreadyUsed}}
										</div>
									</div>
								</div>
							</template>
						</div>
					</div>
					
					<!-- SCHEDULE PAGE -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Schedule'">
						<ion-button expand="block" @click="popup = 'Schedule_creation'">Create New Schedule Item</ion-button>
						<div class="item_container">
							<template v-if="holID != ''">
								<template v-for="(info, id) in scheduleObject" :key="id">
                                    <div class="date_heading" 
                                        v-if="true"
                                    >
                                        {{new Date(info.startTime).getDate()}}/{{new Date(info.startTime).getMonth().toString().padStart(2, '0')}}/{{new Date(info.startTime).getFullYear()}}
                                    </div>
									<div class="trip_items_card" style="height: 60px;" @click="editSchedule(`${id}`)">
										<p class="centerp titlefont">{{info.name}}</p>
										<p class="centerp">{{new Date(info.startTime).getHours()}}:{{((new Date(info.startTime).getMinutes()).toString()).padStart(2, '0')}} - {{new Date(info.endTime).getHours()}}:{{((new Date(info.endTime).getMinutes()).toString()).padStart(2, '0')}}</p>
									</div>
								</template>
							</template>
						</div>
					</div>
					
					<!-- ATTRACTIONS PAGE -->
					<div class="inner" style="overflow: hidden;" v-if="tab == 'Attractions'">
						<p class="centerp" style="margin-bottom: 5px;">Total Cost: ${{attractionTotal}}</p>
						<ion-button expand="block" @click="popup = 'Attraction_Creation'">Create New Attraction</ion-button>
						<div class="item_container">
							<template v-if="holID != ''">
								<div class="trip_items_card"  v-for="(info, id) in dataBase.holidays[holID].attractions" :key="id" @click="''">
									<p class="centerp titlefont">{{info.name}}</p>
									<p class="centerp">Cost: ${{info.cost}}</p>
									<p class="centerp">Address: {{info.place}}</p>
								</div>
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

					<!-- BUDGET CREATION -->
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
					
					<!-- SCHEDULE CREATION -->
					<div class="trip_item_creation" v-if="popup == 'Schedule_creation'">
						<div>
							<label>Event: </label>
							<input v-model="scheduleCreationName">
							<label>Address: </label>
							<input v-model="scheduleCreationAddress">
							<label>Start Date: </label>
							<input v-model="scheduleCreationDateStart" type="datetime-local">
							<label>End Date: </label>
							<input v-model="scheduleCreationDateEnd" type="datetime-local">
							<ion-button @click="applySchedule()">Create</ion-button>
							<ion-button @click="clear()">Back</ion-button>
						</div>
					</div>
                    
                    <div class="trip_item_creation" v-if="popup == 'Schedule_Edit'">
						<div>
							<label>Address: </label>
							<input v-model="scheduleCreationAddress">
							<label>Start Date: </label>
							<input v-model="scheduleCreationDateStart" type="datetime-local">
							<label>End Date: </label>
							<input v-model="scheduleCreationDateEnd" type="datetime-local">
							<ion-button @click="applySchedule()">Create</ion-button>
							<ion-button @click="clear()">Back</ion-button>
						</div>
					</div>
					
					<!-- ATTRACTION CREATION-->
					<div class="trip_item_creation" v-if="popup == 'Attraction_Creation'">
						<div>
							<label>Name:</label>
							<input v-model="attractionCreationName">
							<label>Amount: $</label>
							<input v-model="attractionCreationCost" type="number">
							<label>Address: </label>
							<input v-model="attractionCreationPlace">
							<ion-button @click="applyAttraction()">Create</ion-button>
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
import { returnAuth, returnDataBase, applyBudgetItem, applyScheduleItem, applyAttractionsItem } from '@/firebase'
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { MainData, ScheduleLayout } from '@/types'
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
			attractionCreationPlace: '',
			attractionTotal: 0,
			scheduleCreationName: '',
			scheduleCreationAddress: '',
			scheduleCreationDateStart: '',
			scheduleCreationDateEnd: '',
			scheduleCreationID: undefined as string | undefined,
			scheduleObject: {} as {[key: string]: ScheduleLayout}
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
					this.sortSchedule()
					this.showAttractionTotal()
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
		async applySchedule(){
			await applyScheduleItem(this.holID, this.scheduleCreationName, this.scheduleCreationDateStart, this.scheduleCreationDateEnd, this.scheduleCreationAddress, this.scheduleCreationID)
			this.clear()
		},
		async applyAttraction(){
			await applyAttractionsItem(this.holID, this.attractionCreationName, this.attractionCreationCost, this.attractionCreationPlace)
			this.clear()
		},
		clear(){
			this.popup = ''
			this.budgetCreationName = ''
			this.budgetCreationAmount = 0
			this.budgetCreationUsed = 0
			this.attractionCreationName = ''
			this.attractionCreationCost = 0
			this.attractionCreationPlace = ''
			this.scheduleCreationName = ''
			this.scheduleCreationAddress = ''
			this.scheduleCreationDateStart = ''
			this.scheduleCreationDateEnd = ''
			this.scheduleCreationID = undefined
		},
		showBudgetTotal(){
			this.budgetTotal = 0
			this.budgetLeft = 0
			for(const[name, info] of Object.entries(this.dataBase.holidays[this.holID].budget)){
				this.budgetTotal += info.amount
				this.budgetLeft += info.amount - info.alreadyUsed
			}
		},
		showAttractionTotal(){
			this.attractionTotal = 0
			for(const[id, info] of Object.entries(this.dataBase.holidays[this.holID].attractions)){
				this.attractionTotal += info.cost
			}
		},
		sortSchedule(){
			let schedule = this.dataBase.holidays[this.holID].schedule
			const sortable = Object.fromEntries(
				Object.entries(schedule).sort((a, b) => {
					//@ts-expect-error: you can do it
					return new Date(a[1].startTime) - new Date(b[1].startTime)
				})
			) as {[key: string]: ScheduleLayout};
			this.scheduleObject = sortable
		},
        editSchedule(id: string){
            this.scheduleCreationID = id
            this.scheduleCreationAddress = this.dataBase.holidays[this.holID].schedule[id].address
            this.scheduleCreationDateEnd = this.dataBase.holidays[this.holID].schedule[id].endTime
            this.scheduleCreationName = this.dataBase.holidays[this.holID].schedule[id].name
            this.scheduleCreationDateStart = this.dataBase.holidays[this.holID].schedule[id].startTime
            this.popup = 'Schedule_Edit'
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
			this.clear()
			this.tab = ''
		}
	}
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap');
.centerp{
	text-align: center;
	font-size: 0.9rem;
}
.titlefont{
	font-family: 'Bungee Spice', sans-serif;
	font-size: 1.2rem;
}
.tabs{
	right: 0px;
	left: 0px;
	position: absolute;
	bottom: 60px;
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
    cursor: pointer;
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
	gap: 10px;
	height: 100%;
	overflow: auto;
}

.trip_items_card{
	padding: 5px 5px;
	border-radius: 10px;
	box-shadow: 0 5px 10px #00000026, 0 6px 6px #0000000c;
	display: flex;
	flex-direction: column;
	gap: 5px;
	border: 1px solid cornflowerblue;
	height: 90px;
    cursor: pointer;
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

.date_heading{
    color: grey;
    border-bottom: 1px solid black;
}

</style>
