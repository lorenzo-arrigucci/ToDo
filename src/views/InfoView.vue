<template>
  <div class="about">
    <h1>Web app di <a href="https://github.com/lorenzo-arrigucci" target="_blank">@Lorenzo Arrigucci</a></h1>
    <p>L'app è pensata per facilitare l'organizzazione di scadenze, suddividendole per priorità e tenendo traccia di varie statistiche.</p>
    <p>Viene utilizzato Dexie per implementare un IndexedDb, database interno al browser che mantiene i dati dell'utente.</p>
  </div>
</template>

<style lang="scss">
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
