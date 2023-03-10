<template>
  <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <div class="wrapper">
          <nav>
            <RouterLink to="/">Gestione priorità</RouterLink>
            <RouterLink to="/liste">Liste Complete</RouterLink>
            <RouterLink to="/info">Info</RouterLink>
          </nav>
          <NuovoTodo @aggiungiTodo="inserisciToDo($event)"/>
      </div>
      <div class="wrapper mt-2">
        <p>Da completare: {{ daCompletare }}</p>
        <p>Completati: {{ completati }}</p>
        <p>In scadenza oggi: {{ inScadenza }}</p>
        <p>Con priorità alta: {{ prioritaAlta }}</p>
      </div>
  </header>

  <RouterView 
    :listaTodo="listaTodo" 
    @ricaricaTodo="caricaToDo()" 
    @elimina="eliminaPerId($event)"
    @completa="modificaCompletamentoToDo($event, 1)"/>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { NuovoTodo } from '@/components/imports';
import { getAllToDo, aggiungiToDo, eliminaToDo, aggiornaCompletamentoToDo, ToDo, Priorita } from '@/components/shared/db';

const listaTodo = ref([new ToDo()]);
const daCompletare = computed(() => listaTodo.value.filter(todo => todo.completato === 0).length);
const completati = computed(() => listaTodo.value.filter(todo => todo.completato === 1).length);
const inScadenza = computed(() => listaTodo.value.filter(todo => todo.giorniRimasti === '0').length);
const prioritaAlta = computed(() => listaTodo.value.filter(todo => todo.priorita === Priorita.Alta).length);

const caricaToDo = () => {
  getAllToDo().then( res => listaTodo.value = res );
}
const inserisciToDo = (todo: ToDo) => {
  aggiungiToDo(todo).then();
}
const eliminaPerId = (id: number) => {
  eliminaToDo(id).then(res => caricaToDo());
}
const modificaCompletamentoToDo = (id: number, completato: number) => {
  aggiornaCompletamentoToDo(id, completato).then(res => caricaToDo());
}
onMounted(() => caricaToDo())
</script>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 1rem 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
  }
}
</style>
