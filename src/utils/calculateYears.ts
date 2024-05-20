export const calculateYearsBetweenDates =(fechaInicio:Date, fechaFin:Date)=> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaEnMilisegundos = fin.getTime() - inicio.getTime();
    const diferenciaEnAnios = diferenciaEnMilisegundos / (1000 * 3600 * 24 * 365.25);
    return Math.floor(diferenciaEnAnios);
}