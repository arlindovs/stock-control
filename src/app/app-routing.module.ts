import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { PageNotFoundComponentComponent } from './modules/page-not-found-component/page-not-found-component.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/products/products.module').then(
        (m) => m.ProductsModule
      ),
      canActivate: [AuthGuard],
  },

  { path: '**', component: PageNotFoundComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
