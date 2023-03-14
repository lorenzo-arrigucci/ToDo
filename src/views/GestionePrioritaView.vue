<template>
    <div class="main">
        <ListaPrioritaria :listaTodo="todoPrioritaAlta" :title="'Priorità Alta'" @completa="emit('completa', $event)" />
        <ListaPrioritaria :listaTodo="todoPrioritaMedia" :title="'Priorità Media'" @completa="emit('completa', $event)" />
        <ListaPrioritaria :listaTodo="todoPrioritaBassa" :title="'Priorità Bassa'" @completa="emit('completa', $event)" />
    </div>
</template>

<script setup lang="ts">
import { ToDo, Priorita } from '@/components/shared/db';
import { ListaPrioritaria } from '@/components/imports';
import { computed, onMounted } from 'vue';

const props = defineProps<{
  listaTodo: ToDo[]
}>();
const emit = defineEmits<{
    (e: 'ricaricaTodo'): void,
    (e: 'completa', id: number | null): void
}>();

const todoPrioritaAlta = computed(() => props.listaTodo.filter(todo => todo.priorita === Priorita.Alta));
const todoPrioritaMedia = computed(() => props.listaTodo.filter(todo => todo.priorita === Priorita.Media));
const todoPrioritaBassa = computed(() => props.listaTodo.filter(todo => todo.priorita === Priorita.Bassa));

onMounted(() => emit('ricaricaTodo'))
</script>

<style lang="scss" scoped>
</style>