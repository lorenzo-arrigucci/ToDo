import Dexie from 'dexie';
import type { Table } from 'dexie';
import { calcolaGiorniRimasti } from './utils';

// Sezione tipi dati

export enum Priorita {
    Placeholder = "Seleziona la priorità",
    Alta = "Alta",
    Media = "Media",
    Bassa = "Bassa"
}

export class ToDo {
    id?: number;
    descrizione: string = '';
    scadenza: Date | string | null = null;
    giorniRimasti?: string;
    priorita: Priorita | null = null;
    completato: 0 | 1 = 0; // 0 o 1, non uso boolean perchè in dexie non possono essere indicizzati e non potrei usarli in alcune operazioni di query (.equals(Indexable Type))
}

// Inizializzazione IndexedDb database tramite Dexie

export class ToDoDatabase extends Dexie {
    // Indichiamo a Dexie il tipo di dati che che la tabella deve contenere
    todos! : Table<ToDo>;

    constructor() {
        super('myToDoDatabase');
        this.version(2).stores({
            // Definizione indici con auto-increment id
            // Vengono definiti solo gli indici, ovvero i dati che vogliamo usare in una query "where(...)",
            // non vanno indicate tutte le colonne dell'oggetto come nei normali db
            todos: '++id, scadenza, completato'
        }).upgrade(transaction => {
            return transaction.table('todos').toCollection().modify(todo => {
                if (todo.giorniRimasti) delete todo.giorniRimasti;
                if (todo.creazioneToDo) delete todo.creazioneToDo;
            });
        });
    }
}

export const db = new ToDoDatabase();

// Database operations section

export async function aggiungiToDo(todo: ToDo): Promise<void> {
    try {
        // Se volessimo inserire più oggetti insieme conviene usare .bulkAdd(arrayDiOggetti) invece di ripetere .add
        await db.todos.add({
            descrizione: todo.descrizione,
            scadenza: todo.scadenza,
            priorita: todo.priorita,
            completato: 0
        });
    } catch (e) {
    }
}

export async function aggiornaToDo(todo: ToDo): Promise<void> {
    try {
        // Se volessimo aggiornare più oggetti insieme conviene usare .bulkPut(arrayDiOggetti) invece di ripetere .put
        await db.todos.put({
            id: todo.id,
            descrizione: todo.descrizione,
            scadenza: todo.scadenza,
            priorita: todo.priorita,
            completato: todo.completato
        });
    } catch (e) {
    }
}

export async function aggiornaCompletamentoToDo(idDaModificare: number, completato: number): Promise<void> {
    try {
        // Update aggiorna solo le proprietà indicate nell'oggetto, quindi è più veloce di put in questo caso
        await db.todos.update(idDaModificare, {
            completato: completato
        });
    } catch (e) {
    }
}

export async function eliminaToDo(id: number): Promise<void> {
    try {
        // Se volessimo eliminare più oggetti insieme conviene usare .bulkDelete(arrayDiOggetti) invece di ripetere .delete
        await db.todos.delete(id);
    } catch (e) {
    }
}

export async function eliminaToDoCompletati(): Promise<void> {
    try {
        await db.todos
            .where('completato')
            .equals(1)
            .delete();
    } catch (e) {
    }
}

export async function eliminaToDoVecchi(): Promise<void> {
    try {
        const dueSettimaneFa = new Date(Date.now() - 60*60*1000*24*(7*2/*Numero di settimane*/));
        await db.todos
            .where('scadenza')
            .below(dueSettimaneFa)
            .delete();
    } catch (e) {
    }
}

export async function getAllToDo(): Promise<ToDo[]> {
    try {
        const todos = await db.todos.toArray();
        return todos.map(todo => {
            todo.giorniRimasti = calcolaGiorniRimasti(todo.scadenza);
            return todo;
        });
    } catch (e) {
        return [];
    }
}