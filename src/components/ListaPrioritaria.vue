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
                    <tr v-for="todo in listaTodoFormattata">
                        <td style="width: 40%;">{{ todo.descrizione }}</td>
                        <td style="width: 25%;">{{ todo.scadenza }}</td>
                        <td style="width: 25%;">{{ todo.giorniRimasti }}</td>
                        <td style="width: auto">
                            <button class="btn bg-green push-right" @click="emit('completa', todo.id || null)">Completa</button>
                        </td>
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
import { ordinaPerGiorniRimasti } from './shared/utils';


const props = defineProps<{
    title: string,
    listaTodo: ToDo[]
}>();
const emit = defineEmits<{
    (e: 'completa', id: number | null): void
}>();

const lunghezzaLista = computed(() => props.listaTodo.filter(todo => todo.completato === 0).length);
const listaTodoFormattata = computed(() => props.listaTodo
    .sort(ordinaPerGiorniRimasti)
    .filter(todo => todo.completato === 0)
    .map(todo => {
        todo.scadenza = moment(todo.scadenza).format('DD/MM/YYYY');
        return todo;
    })
);
</script>

<style lang="scss" scoped>
@import '../assets/table.scss';

</style>