import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../PrimeNG/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';



@NgModule({
  declarations: [
    ToolbarNavigationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrimengModule
  ],
  exports: [ToolbarNavigationComponent],
  providers: [DialogService, CurrencyPipe],
})
export class SharedModule { }
