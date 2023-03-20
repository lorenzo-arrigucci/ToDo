import type { ToDo } from './models';
import { CONSTANTS } from './constants';
/**
 * Calcola i giorni rimasti confrontando 
 */
export const calcolaGiorniRimasti = (dataScadenza: Date | string | null): string => {
    if (!dataScadenza) return '';
    if (typeof dataScadenza === "string") dataScadenza = new Date(dataScadenza);

    // Setto lo stesso orario presente in data scadenza (01:00:00), con un minuto di scarto per evitare problemi di ritardo elaborazione.
    const oggi = new Date();
    oggi.setHours(0,59,0);
    const giorniRimasti = Math.floor((dataScadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
    return giorniRimasti >= 0 ? `${giorniRimasti}` : CONSTANTS.SCADUTO;
};

export const ordinaPerGiorniRimasti = (a: ToDo, b: ToDo): number => {
    if ((!a.giorniRimasti && !b.giorniRimasti) || (a.giorniRimasti === CONSTANTS.SCADUTO && b.giorniRimasti === CONSTANTS.SCADUTO)) return 0;
    if (!a.giorniRimasti) return 1;
    if (!b.giorniRimasti) return -1;
    if (a.giorniRimasti === CONSTANTS.SCADUTO) return -1;
    if (b.giorniRimasti === CONSTANTS.SCADUTO) return 1;
    if (parseInt(a.giorniRimasti) < parseInt(b.giorniRimasti)) return -1;
    if (parseInt(a.giorniRimasti) > parseInt(b.giorniRimasti)) return 1;
    return 0;
};