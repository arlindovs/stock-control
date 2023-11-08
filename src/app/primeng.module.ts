import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [],
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  exports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ]
})
export class PrimengModule { }
