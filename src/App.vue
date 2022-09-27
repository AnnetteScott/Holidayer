<template>
    <ion-app>
        <ion-split-pane content-id="main-content">
        <ion-menu content-id="main-content" type="overlay">
            <ion-content>
                <ion-list id="inbox-list">
                    <ion-list-header>{{displayName}}</ion-list-header> <!-- User Name -->
                    <ion-note>{{userEmail}}</ion-note> <!-- Email Name -->   
                    <ion-menu-toggle :auto-hide="false">

                        <router-link to="/Holidays">
                            <ion-item lines="none">
                                <ion-icon slot="start" :md="airplane"></ion-icon>
                                <ion-label>Holidays</ion-label>
                            </ion-item>
                        </router-link>

                        <ion-item @click="''" lines="none">
                            <ion-icon slot="start" :md="list"></ion-icon>
                            <ion-label>Schedule</ion-label>
                        </ion-item>

                        <router-link to="/Profile">
                            <ion-item lines="none">
                                <ion-icon slot="start" :md="person"></ion-icon>
                                <ion-label>Profile</ion-label>
                            </ion-item>
                        </router-link>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-router-outlet id="main-content"></ion-router-outlet>
        </ion-split-pane>
    </ion-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
import { airplane, list, person } from 'ionicons/icons';
import { returnAuth } from '@/firebase'
import { onAuthStateChanged, User } from "firebase/auth";
export default defineComponent({
    name: 'App',
    components: {
        IonApp, 
        IonContent, 
        IonIcon, 
        IonItem, 
        IonLabel, 
        IonList, 
        IonListHeader, 
        IonMenu, 
        IonMenuToggle, 
        IonNote, 
        IonRouterOutlet, 
        IonSplitPane,
    },
    data() {
        return {
            airplane,
            list,
            person,
            displayName: "User",
            userEmail: "me@example.com",
            userSignIn: false
        }
    },
    mounted(){
        const auth = returnAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.loadUserData(user)
                this.userSignIn = true
            } else {
                // User is signed out
                this.userSignIn = false
            }
        });
    },
    methods: {
        loadUserData(user: User){
            this.displayName = user.displayName ? user.displayName : "User"
            this.userEmail = user.email ? user.email : "me@example.com"
        }
    }
});
</script>

<style>
.page{
    padding: 10px;
    width: 100%;
    height: 100%;
}
</style>
