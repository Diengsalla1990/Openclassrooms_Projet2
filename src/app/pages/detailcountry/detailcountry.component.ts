import { Component, OnInit } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { Subject, Subscription, catchError, takeUntil, tap, throwError } from 'rxjs';
import { ChartConfiguration, ChartType } from 'chart.js';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailcountry',
  templateUrl: './detailcountry.component.html',
  styleUrls: ['./detailcountry.component.scss']
})
export class DetailCountryComponent implements OnInit {
  public olympics: Olympic[] = [];
  public errorMessage!: String;
  private dataSubcription : Subscription | undefined;
  //subscribe/unsubscribe
  private destroy$!: Subject<boolean>

  //id pays dans le tableau
  public idPays!: number;

  //Variables d'affichage des données dans la page détail
  public pays!:  string;
  public NbreDentre!: number;
  public totalNbreMedailles!: number;
  public totalNbreAthletes!: number;

  //Variables qu'on aura besoin pour le chart line
  public lineChartData!: ChartConfiguration['data'];
  public lineChartOptions!: any;
  public lineChartType: ChartType = 'line';

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router:Router,) { }

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();

    this.idPays = +this.route.snapshot.params['id'];

    // Récupération des données du fichier json (grâce à l'observable)

    this.dataSubcription = this.olympicService.getOlympics().pipe(
        takeUntil(this.destroy$),
        tap(data=> {
          // Pas d'olympic retourné -> redirection vers la page not found
          if(data[this.idPays] === undefined) this.router.navigateByUrl('**');
        })
      ).subscribe({
        next : (dataJson) =>{

            this.olympics = dataJson;
            // Alimentation du chart pie
            console.log(this.olympics);
             this.lineChart(this.olympics,this.idPays);

      },

        error : (err) =>{
        this.errorMessage = err;
      }
  });
}


ngOnDestroy(): void {
  if (this.dataSubcription) {
    this.dataSubcription.unsubscribe();
  }
}



  lineChart(tabolympic: any [], idcountry: number): void {

    this.pays = this.olympicService.getPaysIdPays(tabolympic, idcountry);
    this.NbreDentre = this.olympicService.getNbreParticipantParIdPays(tabolympic, idcountry);
    this.totalNbreMedailles = this.olympicService.getTotalNbreMedaillesParIdPays(tabolympic, idcountry);
    this.totalNbreAthletes = this.olympicService.getTotalNbreAtleteParIdPays(tabolympic, idcountry);

    // chart line
    this.lineChartData = {
      datasets: [
        {
          // Données de l'axe Y du chart line
          data: this.olympicService.getMedailleParIdPays(tabolympic, idcountry),
          label: this.pays,
          backgroundColor: 'rgba(57,129,141,0.2)',
          borderColor: 'rgba(57,129,141,1)',
          pointBackgroundColor: 'rgba(57,129,141,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(57,129,141,0.8)',
          fill: 'origin',
        }],

      // Données de l'axe X du chart line
      labels: this.olympicService.getYearsParIdPays(tabolympic, idcountry),
      };
      this.lineChartOptions = {
        elements: {
          line: {
            tension: 0, //Pour la tension de la courbe, ici 0 pour avoir des lignes droites
          },
        },
        scales: {},
        plugins: {
          legend: { display: false}, //Affiche ou non la légende du graphique
          annotation: {
            annotations: [],
          },
        },
      };
  }

  // Retour vers le dashboard
  onContinue(): void{
    this.router.navigateByUrl('');
  }



}
