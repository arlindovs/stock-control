import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from 'src/app/PrimeNG/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ProductsHomeComponent } from './page/products-home/products-home.component';
import { RouterModule } from '@angular/router';
import { productsRoutes } from './products.routing';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

@NgModule({
  declarations: [
    ProductsHomeComponent,
    ProductsTableComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(productsRoutes),
    SharedModule,
    HttpClientModule,
    PrimengModule,
  ],
  providers: [DialogService, ConfirmationService],
})
export class ProductsModule {}
