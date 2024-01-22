import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailCountryComponent } from './pages/detailcountry/detailcountry.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: "detailcountry/:id",
    component: DetailCountryComponent,
  },

  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
