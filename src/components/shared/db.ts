import Dexie from 'dexie';
import type { Table } from 'dexie';

// Sezione tipi dati

export enum Priorita {
    Alta = "Alta",
    Media = "Media",
    Bassa = "Bassa"
}

export class ToDo {
    id?: number;
    descrizione: string = '';
    scadenza: Date | string | null = null;
    giorniRimasti?: number;
    priorita: Priorita | null = null;
    completato: 0 | 1 = 0; // 0 o 1, non uso boolean perchè in dexie non possono essere indicizzati
                        // e non potrei usarli in alcune operazioni di query (.equals(Indexable Type))
}

// Inizializzazione IndexedDb database tramite Dexie

export class ToDoDatabase extends Dexie {
    // Indichiamo a Dexie il tipo di dati che che la tabella deve contenere
    todos! : Table<ToDo>;

    constructor() {
        super('myToDoDatabase');
        this.version(1).stores({
            // Definizione indici con auto-increment id
            // Vengono definiti solo gli indici, ovvero i dati che vogliamo usare in una query "where(...)",
            // non vanno indicate tutte le colonne dell'oggetto come nei normali db
            todos: '++id, scadenza, giorniRimasti, priorita, completato'
        })
    }
}

export const db = new ToDoDatabase();

// Database operations section

export async function aggiungiToDo(todo: ToDo): Promise<boolean> {
    try {
        if (todo.scadenza && !todo.giorniRimasti) {
            todo.scadenza = new Date(todo.scadenza); // Aggiorna data settando orario 01:00:00
            const oggi = new Date();
            // Setto lo stesso orario presente in data scadenza, con un minuto di scarto per evitare problemi di ritardo elaborazione.
            oggi.setHours(0,59,0);
            todo.giorniRimasti = Math.floor((todo.scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
        }
        // Se volessimo inserire più oggetti insieme conviene usare .bulkAdd(arrayDiOggetti) invece di ripetere .add
        const id = await db.todos.add({
            descrizione: todo.descrizione,
            scadenza: todo.scadenza,
            giorniRimasti: todo.giorniRimasti,
            priorita: todo.priorita,
            completato: 0
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function aggiornaToDo(todo: ToDo): Promise<boolean> {
    try {
        // Se volessimo aggiornare più oggetti insieme conviene usare .bulkPut(arrayDiOggetti) invece di ripetere .put
        const id = await db.todos.put({
            id: todo.id,
            descrizione: todo.descrizione,
            scadenza: todo.scadenza,
            giorniRimasti: todo.giorniRimasti,
            priorita: todo.priorita,
            completato: todo.completato
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function aggiornaCompletamentoToDo(idDaModificare: number, completato: number): Promise<boolean> {
    try {
        // Update aggiorna solo le proprietà indicate nell'oggetto, quindi è più veloce di put in questo caso
        const id = await db.todos.update(idDaModificare, {
            completato: completato
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function eliminaToDo(id: number): Promise<boolean> {
    try {
        // Se volessimo eliminare più oggetti insieme conviene usare .bulkDelete(arrayDiOggetti) invece di ripetere .delete
        await db.todos.delete(id);
        return true;
    } catch (e) {
        return false;
    }
}

export async function eliminaToDoCompletati(): Promise<boolean> {
    try {
        await db.todos
            .where('completato')
            .equals(1)
            .delete();
        return true;
    } catch (e) {
        return false;
    }
}

export async function eliminaToDoVecchi(): Promise<boolean> {
    try {
        const dueSettimaneFa = new Date(Date.now() - 60*60*1000*24*(7*3/*Numero di settimane*/));
        await db.todos
            .where('scadenza')
            .below(dueSettimaneFa)
            .delete();
        return true;
    } catch (e) {
        return false;
    }
}

export async function getAllToDo(): Promise<ToDo[]> {
    try {
        const todos = await db.todos.toArray();      
        return todos;
    } catch (e) {
        return [];
    }
}

export async function getToDoByFiltroCompletato(completato: number): Promise<ToDo[]> {
    try {
        const todos = await db.todos
            .where('completato')
            .equals(completato)
            .toArray();      
        return todos;
    } catch (e) {
        return [];
    }
}

export async function getToDoByFiltroPriorita(priorita: Priorita): Promise<ToDo[]> {
    try {
        const todos = await db.todos
            .where('priorita')
            .equals(priorita)
            .toArray();      
        return todos;
    } catch (e) {
        return [];
    }
}

export async function getToDoInScadenzaTraGiorni(giorni: number): Promise<ToDo[]> {
    try {
        const todos = await db.todos
            .where('giorniRimasti')
            .equals(giorni)
            .toArray();      
        return todos;
    } catch (e) {
        return [];
    }
}

export async function getToDoInScadenzaNeiProssimiGiorni(giorni: number = 3): Promise<ToDo[]> {
    try {
        const todos = await db.todos
            .where('giorniRimasti')
            .below(giorni)
            .toArray();      
        return todos;
    } catch (e) {
        return [];
    }
}