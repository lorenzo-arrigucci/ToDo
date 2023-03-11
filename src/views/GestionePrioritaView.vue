<template>
    <div class="main">
        <ListaPrioritaria :listaTodo="todoPrioritaAlta" :title="'Priorità Alta'" />
        <ListaPrioritaria :listaTodo="todoPrioritaMedia" :title="'Priorità Media'" />
        <ListaPrioritaria :listaTodo="todoPrioritaBassa" :title="'Priorità Bassa'" />
    </div>
</template>

<script setup lang="ts">
import { ToDo, Priorita } from '@/components/shared/db';
import ListaPrioritaria from '@/components/ListaPrioritaria.vue';
import { computed, onMounted } from 'vue';

const props = defineProps<{
  listaTodo: ToDo[]
}>();
const emit = defineEmits<{
    (e: 'ricaricaTodo'): void
}>();

const todoPrioritaAlta = computed(() => props.listaTodo.filter(todo => todo.priorita === Priorita.Alta));
const todoPrioritaMedia = computed(() => props.listaTodo.filter(todo => todo.priorita === Priorita.Media));
const todoPrioritaBassa = computed(() => props.listaTodo.filter(todo => todo.priorita === Priorita.Bassa));

onMounted(() => emit('ricaricaTodo'))
</script>

<style scoped>
</style>