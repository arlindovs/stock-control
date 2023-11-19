import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [],
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    SidebarModule,
    ToolbarModule,
    ChartModule,
  ],
  exports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    SidebarModule,
    ToolbarModule,
    ChartModule,
  ]
})
export class PrimengModule { }
