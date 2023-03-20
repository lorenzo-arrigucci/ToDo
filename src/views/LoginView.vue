<template>
    <form @submit.prevent="login">
        <h2>Per accedere all'app è necessario eseguire il login.</h2>
        <button class="btn bg-green">Login con Google</button>
    </form>
</template>

<script setup lang="ts">
import { auth } from '@/components/shared/firebaseDb';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

</script>

<style lang="scss" scoped>
form {
    width:100%;
    position:absolute;
    display:grid;
    place-items:center;
    top: -5rem;
}
h2 {
    text-align:center;
}
button {
    width:fit-content;
    margin:auto
}
</style>