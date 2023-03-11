<template>
    <div class="sezione-liste">
        <h2 class="text-center">{{ title }}</h2>
        <template v-if="lunghezzaLista > 0">
            <table class="table">
                <thead>
                    <th>Descrizione</th>
                    <th>Scadenza</th>
                    <th>Giorni rimasti</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr class="d-table-row" v-for="todo in listaTodoFormattata">
                        <td class="d-table-cell">{{ todo.descrizione }}</td>
                        <td class="d-table-cell">{{ todo.scadenza }}</td>
                        <td class="d-table-cell">{{ todo.giorniRimasti }}</td>
                        <td><!-- Azioni --></td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template v-else>
            <p class="text-center">
                Al momento non sono presenti scadenze con priorit&agrave; 
                {{ title.includes('Alta') ? 'alta' : title.includes('Media') ? 'media' : 'bassa' }}.
            </p>
        </template>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { computed } from 'vue';
import type { ToDo } from './shared/db';


const props = defineProps<{
    title: string,
    listaTodo: ToDo[]
}>();

const lunghezzaLista = computed(() => props.listaTodo.length);
const listaTodoFormattata = computed(() => {
    return props.listaTodo.map(todo => {
        todo.scadenza = moment(todo.scadenza).format('DD/MM/YYYY');
        return todo;
    })
})
</script>

<style scoped>

</style>