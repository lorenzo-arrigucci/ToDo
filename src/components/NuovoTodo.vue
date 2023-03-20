<template>
    <form id="nuovoTodoForm">
        <h3 class="my-3">Aggiungi una scadenza:</h3>
        <input type="text" name="descrizione" class="form-control" v-model="formInput.descrizione" placeholder="Descrizione" autocomplete="off" required>
        <DateInput :reset="triggerResetDateinput" @update="update($event)"/>
        <select name="priorita" class="form-select" v-model="formInput.priorita" required>
            <option :value="Priorita.Placeholder" selected disabled>{{ Priorita.Placeholder }}</option>
            <option v-for="priorita in listaPriorita" :value="priorita">{{ priorita }}</option>
        </select>
        <button class="btn bg-green mt-1" @click.prevent="aggiungi">Aggiungi</button>
    </form>
</template>

<script setup lang="ts">
import { Priorita } from './shared/models';
import { ToDo, FormInput } from './shared/models';
import { DateInput } from './imports';
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'aggiungiTodo', todo: ToDo): void
}>();

const oggi = new Date();
const formInput = ref(new FormInput());
const triggerResetDateinput = ref(false);
const listaPriorita: Priorita[] = [ Priorita.Alta, Priorita.Media, Priorita.Bassa ];

const update = (data: Date) => {
    formInput.value.scadenza = data;
    formInput.value.scadenza.setHours(1,0,0);
};

const aggiungi = () => {
    if (!formInput.value.descrizione || !formInput.value.scadenza || formInput.value.priorita === Priorita.Placeholder) return;
    formInput.value.scadenza = new Date(formInput.value.scadenza); // L'orario viene impostato di default alle 01:00:00
    if (formInput.value.scadenza.getTime() < new Date().getTime()) {
        formInput.value.scadenza = new Date();
        formInput.value.scadenza.setHours(1,0,0);
    }
    const todo = new ToDo();
    todo.descrizione = formInput.value.descrizione;
    todo.scadenza = formInput.value.scadenza;
    todo.priorita = formInput.value.priorita;
    emit('aggiungiTodo', todo);
    resettaForm();
};

const resettaForm = () => {
    formInput.value = new FormInput();
    triggerResetDateinput.value = true;
    setTimeout(() => triggerResetDateinput.value = false, 250);
}

</script>

<style lang="scss" scoped>
@import '@/assets/main.css';
</style>