<template>
<ion-page>
    <headerTop title="Profile"></headerTop>    
    <ion-content :fullscreen="true">
    <div class="page">
        <div v-if="!userSignIn" >
            <div v-if="form == ''" id="notSignIn">
                <div style="text-align:center">It looks like you are not signed in. To get started, please sign in or create a new account.</div>
                <ion-button expand="block" @click="form = 'signIn'">Sign In</ion-button>
                <ion-button expand="block" @click="form = 'signUp'">Create new Account</ion-button>
            </div>
            <div v-if="form == 'signIn'">

            </div>
        </div>
    </div>
    </ion-content>
</ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import headerTop from '@/components/headerTop.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInUser } from '@/firebase'
export default defineComponent({
    name: 'FolderPage',
    components: {
        headerTop,
        IonButton,
        IonContent,
        IonHeader,
        IonMenuButton,
        IonPage,
        IonTitle,
        IonToolbar
    },
    data() {
        return {
            userSignIn: false,
            form: '',
            email: '',
            password: ''
        }
    },
    mounted(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userSignIn = true
            } else {
                // User is signed out
                this.userSignIn = false
            }
        });
    },
    methods: {
        signIn(){
            signInUser(this.email, this.password)
        }
    },
    watch: {
        userSignIn(){
            this.form = ''
            this.email = ''
            this.password = ''
        }
    }
});
</script>

<style scoped>
#notSignIn{
    display: flex;
    flex-direction: column;
    gap: 25px;
    justify-content: flex-start;
    margin-top: 15%;
}
</style>
