import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesHomeComponent } from './page/categories-home/categories-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { categoriesRoutes } from './categories.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from 'src/app/PrimeNG/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoriesFormComponent } from './components/categories-form/categories-form.component';

@NgModule({
  declarations: [CategoriesHomeComponent, CategoriesTableComponent, CategoriesFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(categoriesRoutes),
    SharedModule,
    HttpClientModule,
    PrimengModule,
  ],
  providers: [DialogService,ConfirmationService],
})
export class CategoriesModule {}
