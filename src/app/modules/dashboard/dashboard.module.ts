import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routing';
import { PrimengModule } from 'src/app/PrimeNG/primeng.module';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(dashboardRoutes),
    PrimengModule,
    SharedModule
  ],
  providers: [MessageService,CookieService],
})
export class DashboardModule {}
