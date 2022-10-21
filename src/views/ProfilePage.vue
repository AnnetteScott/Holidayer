<template>
<ion-page>
    <headerTop :title="header"></headerTop>    
    <ion-content :fullscreen="true">
    <div class="page">
        <template v-if="!userSignIn" >
            <div v-if="form == ''" id="notSignIn">
                <div style="text-align:center">It looks like you are not signed in. To get started, please sign in or create a new account.</div>
                <ion-button expand="block" @click="form = 'signIn', header = 'Sign In'">Sign In</ion-button>
                <ion-button expand="block" @click="form = 'signUp', header = 'Create New User'">Create new Account</ion-button>
            </div>

            <div v-if="form == 'signIn'">
                <ion-button expand="block" @click="form = '', header = 'Account'">Back</ion-button>
                <form @submit.prevent="signIn()">
                    <input type="email" required placeholder="Email" v-model="email">
                    <input :type="passwordSetting" required placeholder="Password" autocomplete="on" v-model="password">
                    <ion-button expand="block" type="submit" value="Submit">Sign In</ion-button>
                </form>
            </div>

            <div v-if="form == 'signUp'">
                <ion-button expand="block" @click="form = '', header = 'Account'">Back</ion-button>
                <form @submit.prevent="signUp()">
                    <input type="text" required placeholder="Name" v-model="disName">
                    <input type="email" required placeholder="Email" v-model="email">
                    <input :type="passwordSetting" required placeholder="Password" autocomplete="on" v-model="password">
                    <ion-button expand="block" type="submit" value="Submit">Create New User</ion-button>
                </form>
            </div>
        </template>
        <template v-else>
            <div id="profile_info">
                <div>Name: {{disName}}</div>
            </div>
            <ion-button expand="block" @click="signOut()">Sign Out</ion-button>
        </template>
    </div>
    </ion-content>
</ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonContent, IonPage, IonToolbar } from '@ionic/vue';
import headerTop from '@/components/headerTop.vue';
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { signInUser, createNewUser, returnAuth, signOutUser } from '@/firebase'
export default defineComponent({
    name: 'ProfilePage',
    components: {
        headerTop,
        IonButton,
        IonContent,
        IonPage
    },
    data() {
        return {
            unsubscribe: {} as Unsubscribe,
            userSignIn: false,
            form: '',
            disName: '',
            email: '',
            password: '',
            passwordSetting: 'password',
            header: 'Account'
        }
    },
    mounted(){
        this.authListener()
    },
    methods: {
        authListener(){
            const auth = returnAuth();
            this.unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.userSignIn = true
                } else {
                    // User is signed out
                    this.userSignIn = false
                }
            });
        },
        async signIn(){
            await signInUser(this.email, this.password);
        },
        async signUp(){
            await createNewUser(this.email, this.password, this.disName);
            const auth = returnAuth();
            this.disName = auth.currentUser != null ? auth.currentUser.displayName ? auth.currentUser.displayName : '': '';
        },
        async signOut(){
            await signOutUser()
        }
    },
    watch: {
        userSignIn(newValue){
            this.form = ''
            this.email = ''
            this.password = ''
            this.header = 'Account'
            this.disName = ''
            if(newValue){
                setTimeout(() => {
                    const auth = returnAuth();
                    this.disName = auth.currentUser != null ? auth.currentUser.displayName ? auth.currentUser.displayName : '': '';
                }, 1000)
            }
        },
        $route(to, from){
            if(to.name == "Profile"){
                this.authListener();
            }
            else {
                this.unsubscribe()
            }
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

form{
    margin-top: 17%;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

input{
    padding: 5px;
    border-radius: 15px;
}

#profile_info{
    min-height: 90%;
}

</style>
