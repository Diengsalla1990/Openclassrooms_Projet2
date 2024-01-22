import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics : Olympic[] = [];
  public titre : string = "Medals per Country"

  errorMessage! : string ;

  // Variables pour affichage des données dans le dashboard
  public nombreDeJOs!: number;
  public nombreDePays!: number;


  //Variable nécessaire pour notre Pie charts
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
     plugins: {
      legend: {
        position: 'top'
      }
     }

  };

  public pieChartLabels!: string[];
  public pieChartDatasets!: [{label: string,data: number[],backgroundColor: string[]}];
  public pieChartLegend!:boolean;
  public pieChartPlugins!: [];
  public urlDetail = "detailcountry";


  // Pour le subscribe/unsubsribe
  private destroy$!: Subject<boolean>;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();

    // Récupération des données du fichier json (grâce à l'observable)

      this.olympicService.getOlympics().pipe(
        takeUntil(this.destroy$),
      ).subscribe({
        next : (dataJson) =>{

            this.olympics = dataJson;
            // Alimentation du chart pie
             this.pieChart(this.olympics);
      },
      error : (err) =>{
            this.errorMessage = err;
      }
    });
  }

  //intialisation

  configChart(): void{
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }

  // Ajoute les données des labels et du chart pie (labels et datas)
  pieChart(tabolympic: any []): void {
    this.pieChartLabels = this.olympicService.getPays(tabolympic);
    this.pieChartDatasets = this.getLabelDatasAndColorsToDisplay();
    this.nombreDePays = tabolympic.length;
    this.nombreDeJOs = this.olympicService.getTotalParticipations(tabolympic);
  }

  // Récupère les données à afficher dans le pie avec les couleurs
  getLabelDatasAndColorsToDisplay(): [{label: string,data: number[],backgroundColor: string[]}]{
    return [{
      label: "🥇",
      data: this.olympicService.getTotalMedailles(this.olympics),
      backgroundColor: ['#8D6266', '#BCCAE4', '#C5DFEF', '#93819F', '#8EA0D6', '#714052']
   }]
  }

  // Lors du clic sur un pays dans le pie, redirection vers la page Détail
  public chartClicked(e:any):void {
    this.router.navigateByUrl(this.urlDetail+'/'+e.active[0].index);
  }

  ngOnDestroy(): void {
    // Unsubscribe de l'observable (éviter fuites mémoire)
    this.destroy$.next(true);
  }



}
