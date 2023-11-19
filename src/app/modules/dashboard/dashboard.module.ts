import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routing';
import { PrimengModule } from 'src/app/primeng.module';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    PrimengModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(dashboardRoutes),
  ],
  providers: [MessageService,CookieService],
})
export class DashboardModule {}
