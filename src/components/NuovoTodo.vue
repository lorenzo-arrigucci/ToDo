<template>
    <form id="nuovoTodoForm">
        <label for="descrizione" class="form-label">Descrizione</label>
        <input type="text" name="descrizione" class="form-control" v-model="formInput.descrizione" placeholder="Descrizione" required>
        <label for="scadenza">Data scadenza</label>
        <input type="date" name="scadenza" class="form-control" v-model="formInput.scadenza" required>
        <label for="priorita">Priorit&agrave;</label>
        <select name="priorita" class="form-select" v-model="formInput.priorita" required>
            <option selected disabled>Seleziona una priorit&agrave;</option>
            <option v-for="priorita in listaPriorita" :value="priorita">{{ priorita }}</option>
        </select>
        <button class="btn bg-green mt-1" @click="aggiungi">Aggiungi</button>
    </form>
</template>

<script setup lang="ts">
import { Priorita } from './shared/db';
import { ToDo } from './shared/db'

const emit = defineEmits<{
    (e: 'aggiungiTodo', todo: ToDo): void
}>();

class FormInput {
    descrizione: string = '';
    scadenza: Date | null = null;
    priorita: Priorita | null = null;
}
let formInput: FormInput = new FormInput();
const listaPriorita: Priorita[] = [ Priorita.Alta, Priorita.Media, Priorita.Bassa ];
const oggi = new Date();

const aggiungi = () => {
    if (!formInput.descrizione || !formInput.scadenza || !formInput.priorita) return;
    formInput.scadenza = new Date(formInput.scadenza); // L'orario viene impostato di default alle 01:00:00
    if (formInput.scadenza.getTime() < new Date().getTime()) {
        formInput.scadenza = new Date();
        formInput.scadenza.setHours(1,0,0);
    }
    const todo = new ToDo();
    todo.descrizione = formInput.descrizione;
    todo.scadenza = formInput.scadenza;
    todo.priorita = formInput.priorita;
    emit('aggiungiTodo', todo);
};
</script>

<style lang="scss" scoped>
@import '../assets/main.css';
</style>