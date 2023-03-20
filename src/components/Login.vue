<template>
    <form @submit.prevent="login">
    <h2>Log in</h2>
        <button class="btn bg-green">Log in con Google</button>
    </form>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { auth } from './shared/firebaseDb';
import router from '@/router/index';

const login = () => {
    const provider = new GoogleAuthProvider();
    const user = signInWithPopup(auth, provider);
    console.log(user);
}
</script>

<style lang="scss" scoped>

</style>