<template>   
    <div class="main">
        <ListaCompleta :listaTodo="todoAperti" :title="'Da fare'" @elimina="elimina" />
        <ListaCompleta :listaTodo="todoCompletati" :title="'Completati'" @elimina="elimina" />
    </div>   
</template>

<script setup lang="ts">
import { ListaCompleta } from '@/components/imports';
import type { ToDo } from '@/components/shared/models';
import { computed } from '@vue/reactivity';
import { onMounted } from 'vue';

const props = defineProps<{
  listaTodo: ToDo[]
}>();
const emit = defineEmits<{
    (e: 'ricaricaTodo'): void,
    (e: 'elimina', id: string | null): void
}>();

const todoAperti = computed(() => props.listaTodo.filter(todo => todo.completato === 0));
const todoCompletati = computed(() => props.listaTodo.filter(todo => todo.completato === 1));
const elimina = (id: string | null) => emit('elimina', id);

onMounted(() => emit('ricaricaTodo'))
</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>