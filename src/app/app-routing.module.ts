import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { PageNotFoundComponentComponent } from './modules/page-not-found-component/page-not-found-component.component';

const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: '**', component: PageNotFoundComponentComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
