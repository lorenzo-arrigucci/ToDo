export enum Priorita {
    Placeholder = "Seleziona la priorità",
    Alta = "Alta",
    Media = "Media",
    Bassa = "Bassa"
}

export class ToDo {
    id?: string;
    descrizione: string = '';
    scadenza: Date | string | null = null;
    giorniRimasti?: string;
    priorita: Priorita | null = null;
    completato: 0 | 1 = 0; // 0 o 1, non uso boolean perchè in dexie non possono essere indicizzati e non potrei usarli in alcune operazioni di query (.equals(Indexable Type))
}

export class FormInput {
    descrizione: string = '';
    scadenza: Date | null = null;
    priorita: Priorita = Priorita.Placeholder;
}