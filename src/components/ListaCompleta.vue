<template>
    <div class="sezione-liste">
        <h2 class="text-center">{{ title }}</h2>
        <template v-if="lunghezzaLista > 0 && title === 'Da fare'">
            <table class="table">
                <thead>
                    <th>Descrizione</th>
                    <th>Scadenza</th>
                    <th>Giorni rimasti</th>
                    <th>Priorit&agrave;</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr class="d-table-row" v-for="todo in listaTodoFormattata">
                        <td class="d-table-cell">{{ todo.descrizione }}</td>
                        <td class="d-table-cell">{{ todo.scadenza }}</td>
                        <td class="d-table-cell">{{ todo.giorniRimasti }}</td>
                        <td class="d-table-cell">{{ todo.priorita }}</td>
                        <td><!-- Azioni --></td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template v-else-if="lunghezzaLista > 0 && title === 'Completati'">
            <table class="table">
                <thead>
                    <th>Descrizione</th>
                    <th>Scadenza</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr class="d-table-row" v-for="todo in listaTodoFormattata">
                        <td class="d-table-cell">{{ todo.descrizione }}</td>
                        <td class="d-table-cell">{{ todo.scadenza }}</td>
                        <td><button class="btn bg-green" @click="elimina(todo.id || null)">Elimina</button></td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template v-else>
            <p class="text-center">Al momento non sono presenti promemoria {{ title === 'Completati' ? 'completati' : 'da completare' }} registrati.</p>
        </template>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';
import type { ToDo } from './shared/db';

const props = defineProps<{    
    title: string,
    listaTodo: ToDo[]
}>();
const emit = defineEmits<{
    (e: 'elimina', id: number | null): void
}>();

const lunghezzaLista = computed(() => props.listaTodo.length);
const listaTodoFormattata = computed(() => {
    return props.listaTodo.map(todo => {
        todo.scadenza = moment(todo.scadenza).format('DD/MM/YYYY');
        return todo;
    })
})

const elimina = (id: number | null) => emit('elimina', id);

</script>

<style scoped>

</style>