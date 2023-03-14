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
                </thead>
                <tbody>
                    <tr v-for="todo in listaTodoFormattata">
                        <td style="width: 40%;">{{ todo.descrizione }}</td>
                        <td style="width: 20%;">{{ todo.scadenza }}</td>
                        <td style="width: 20%;">{{ todo.giorniRimasti }}</td>
                        <td style="width: 20%;">{{ todo.priorita }}</td>
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
                    <tr v-for="todo in listaTodoFormattata">
                        <td style="width: 40%;">{{ todo.descrizione }}</td>
                        <td style="width: 50%;">{{ todo.scadenza }}</td>
                        <td style="width: auto;">
                            <button class="btn bg-green push-right" @click="emit('elimina', todo.id || null)">Elimina</button>
                        </td>
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
import { ordinaPerGiorniRimasti } from './shared/utils';

const props = defineProps<{    
    title: string,
    listaTodo: ToDo[]
}>();
const emit = defineEmits<{
    (e: 'elimina', id: number | null): void
}>();

const lunghezzaLista = computed(() => props.listaTodo.length);
const listaTodoFormattata = computed(() => props.listaTodo
    .sort(ordinaPerGiorniRimasti)
    .map(todo => {
        todo.scadenza = moment(todo.scadenza).format('DD/MM/YYYY');
        return todo;
    })
);

</script>

<style lang="scss" scoped>
@import '../assets/table.scss';

</style>