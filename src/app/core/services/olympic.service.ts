import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }


  /**
   *
   * Les fonctions pour notre Pie chart du home Page
   */


  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  // Récupération du total de participations (pour tous les pays)
  getTotalParticipations(olympics : Olympic[]): number{
    return Math.max(...(olympics.map(olympic =>
      olympic.participations).map(participation => participation.length)));
  }

  // Récupération des pays
  getPays(olympics: Olympic[]): string[]{
    return olympics.map(olympics => olympics.country);
  }

  // Récupération du total des médailles (par pays)
  getTotalMedailles(olympics: Olympic[]): number[]{
    return olympics
    .map(olympic => {
      return olympic.participations.reduce((accumulator,participation) => accumulator + participation.medalsCount,0)
    });
  }


  /**
   *
   *
   * Fonctions qu'on aura besoins Pour la partie detail
   *
   */



   // Récupération du pays
   getPaysIdPays(olympics : Olympic[], id: number): string{
    return olympics[id].country;
   }
  // Récupération du nombre de participations par pays
  getNbreParticipantParIdPays(olympics : Olympic[], id: number): number{
    return olympics[id].participations.length;
  }

  // Récupération du nombre de médailles cumulées par pays
  getTotalNbreMedaillesParIdPays(olympics : Olympic[], id: number): number{
    return olympics[id].participations.reduce((accumulator,participation) => accumulator + participation.medalsCount,0);
  }

  // Récupération du nombre d'athlètes cumulés par pays
  getTotalNbreAtleteParIdPays(olympics : Olympic[], id: number): number{
    return olympics[id].participations.reduce((accumulator,participation) => accumulator + participation.athleteCount,0);
  }

  // Récupération des années de participation par pays
  getYearsParIdPays(olympics : Olympic[], id: number): number[]{
    return olympics[id].participations.map(participation => participation.year);
  }

  // Récupération du nimbre de médailles par pays par années
  getMedailleParIdPays(olympics : Olympic[], id: number): number[]{
    return olympics[id].participations.map(participation => participation.medalsCount);
  }




}
