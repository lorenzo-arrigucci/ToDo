<template>
  <template v-if="!user">
    <LoginView />
  </template>
  <template v-else>
    <div class="logout">
      <button class="btn btn-secondary" @click.prevent="logout()">Logout</button>
    </div>
    <header>
        <img alt="Logo Mini" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        <div class="wrapper">
            <nav>
              <RouterLink to="/">Gestione priorità</RouterLink>
              <RouterLink to="/liste">Liste Complete</RouterLink>
              <RouterLink to="/info">Info</RouterLink>
            </nav>
            <NuovoTodo @aggiungiTodo="inserisciToDo($event)"/>
        </div>
        <div class="stats-wrapper mt-2">
          <p>Da completare: {{ daCompletare }}</p>
          <p>Completati: {{ completati }}</p>
          <p>In scadenza oggi: {{ inScadenza }}</p>
          <p>Con priorità alta: {{ prioritaAlta }}</p>
        </div>
    </header>

    <RouterView 
      :listaTodo="listaTodo" 
      @ricaricaTodo="caricaToDo()" 
      @elimina="eliminaToDo($event)"
      @completa="modificaCompletamentoToDo($event, 1)"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import LoginView from './views/LoginView.vue';
import { NuovoTodo } from '@/components/imports';
import { ToDo, Priorita } from '@/components/shared/models';
import { calcolaGiorniRimasti } from './components/shared/utils';
import { db, auth } from '@/components/shared/firebaseDb';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, type Unsubscribe } from 'firebase/firestore';
import { onAuthStateChanged, signOut, type User } from '@firebase/auth';

const listaTodo = ref([new ToDo()]);
const daCompletare = computed(() => listaTodo.value.filter(todo => todo.completato === 0).length);
const completati = computed(() => listaTodo.value.filter(todo => todo.completato === 1).length);
const inScadenza = computed(() => listaTodo.value.filter(todo => todo.giorniRimasti === '0').length);
const prioritaAlta = computed(() => listaTodo.value.filter(todo => todo.priorita === Priorita.Alta).length);
const user = ref(auth.currentUser);
let unsubscribeCollection: Unsubscribe | null = null;

const caricaToDo = () => {
  if (!user.value) {
    listaTodo.value = [];
    return;
  };
  unsubscribeCollection = onSnapshot(collection(db, `users/${user.value.uid}/todos`), (querySnapshot) => {
    const fbTodos: ToDo[] = [];
    querySnapshot.forEach((doc) => {
      const todo: ToDo = {
        id: doc.id,
        descrizione: doc.data().descrizione,
        scadenza: new Date(doc.data().scadenza.seconds * 1000),
        giorniRimasti: calcolaGiorniRimasti(new Date(doc.data().scadenza.seconds * 1000)),
        priorita: doc.data().priorita,
        completato: doc.data().completato
      }
      fbTodos.push(todo);
    });
    listaTodo.value = fbTodos;
  });
};

const inserisciToDo = (todo: ToDo) => {
  if (!user.value) return;
  addDoc(collection(db, `users/${user.value.uid}/todos`), {
    descrizione: todo.descrizione,
    scadenza: todo.scadenza,
    priorita: todo.priorita,
    completato: todo.completato
  });
}

const modificaCompletamentoToDo = (id: string, nuovoCompletato: 0 | 1) => {
  if (!user.value) return;
  const toDoRef = doc(collection(db, `users/${user.value.uid}/todos`), id);
  updateDoc(toDoRef, {
    completato: nuovoCompletato
  });
}

const eliminaToDo = (id: string) => {
  if (!user.value) return;
  deleteDoc(doc(collection(db, `users/${user.value.uid}/todos`), id));
}

const logout = () => {
  if (unsubscribeCollection) unsubscribeCollection();
  signOut(auth);
};

const updateUser = (utente: User | null) => {
  user.value = utente;
  caricaToDo();
}

onMounted(() => {
  onAuthStateChanged(auth, res => updateUser(res));
  caricaToDo();
});

</script>

<style lang="scss" scoped>
.logout {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 10;
}

.logout button {
  pointer-events: all;
}

header {
  line-height: 1.5;
  max-width: 700px;
  margin: 0 auto;
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
  color: var(--color-accent-primary);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
}

nav a:first-of-type {
  border: 0;
}

.stats-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 1rem;
  justify-content: space-between;

  p {
    white-space: nowrap;
  }
}

@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;
    padding-right: calc(var(--section-gap) / 2);
    margin: 0;
  }

  .logo {
    margin: 1rem 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  nav {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
  }

  .stats-wrapper {
    flex-direction: column;
    margin: 0;
  }
}
</style>
