<template>
    <form>
        <h2><strong>Benvenuto in Mini - Gestione scadenze</strong></h2>
        <h4>Qui potrai gestire le tue scadenze lavorative in modo efficiente</h4>
        <br>
        <p>Per accedere all'app è necessario essere registrati ed eseguire il login.</p>
        <div class="loginForm">
            <input type="email" name="email" class="form-control" v-model="email" placeholder="Email" required>
            <input type="password" name="password" class="form-control" v-model="password" placeholder="Password" required>
            <button v-if="showLogin" class="btn bg-green" @click.prevent="login">Login</button>
            <button v-else class="btn bg-green" @click.prevent="registra">Registrati</button>
        </div>
        <div class="containter">
            <p class="text-danger" v-show="message != ''">{{ message }}</p>
            <p class="line-on-side"><span>oppure</span></p>
        </div>
        <button class="btn bg-green" @click.prevent="loginConGoogle">Login con account Google</button>
        <br>
        <p v-if="showLogin">Non sei ancora registrato? <a class="text-highlight" @click.prevent="showLogin = false; message = ''">Registrati</a> qui.</p>
        <p v-else>Sei gi&agrave; registrato? Esegui il <a class="text-highlight" @click.prevent="showLogin = true; message = ''">Login</a>.</p>
    </form>
</template>

<script setup lang="ts">
import { auth } from '@/components/shared/firebaseDb';
import { AuthErrorCodes, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@firebase/auth';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const showLogin = ref(true);
const message = ref('');

const loginConGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

const login = () => {    
    message.value = '';
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(userCred => {})
        .catch(error => mostraErroreLogin(error));
}

const registra = () => {
    message.value = '';
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(userCred => {})
        .catch(error => mostraErroreLogin(error));
}

const mostraErroreLogin = (error: any) => {
    if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
        message.value = 'Password non valida. Riprova.';
    } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
        message.value = 'Password debole. Lunghezza minima 6 caratteri.';
    } else if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        message.value = 'Email già registrata.';
    } else if (error.code === AuthErrorCodes.UNVERIFIED_EMAIL) {
        message.value = 'Email non fornita da un provider verificato.';
    } else message.value = error.message;
} 

</script>

<style lang="scss" scoped>
form {
    width:100%;
    position:absolute;
    display:grid;
    place-items:center;
    text-align: center;
}
form > * {
    margin: 0em 0.5em 0.5em;
}
.loginForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 0;
}
.loginForm > * {    
    margin: 0 0 0.5em;
    width: 100%;
}
.containter {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 0;
    min-width: 207px;
}
.containter > * {    
    margin: 0 0 0.5em;
    width: 100%;
}
.containter > .line-on-side {
    border-bottom: 1px solid var(--color-text); 
    line-height: 0.1em;
    margin: 1rem 0.5rem 1rem;
}
.containter > .line-on-side > span {
    background:var(--color-background); 
    padding: 0 0.5rem;
    margin: 1rem 0;
}
h2 {
    text-align:center;
    color: var(--color-accent-primary);
    margin-top: 5rem;
}
button {
    width:fit-content;
    margin:auto
}
a:hover {
    cursor: pointer;
}
</style>