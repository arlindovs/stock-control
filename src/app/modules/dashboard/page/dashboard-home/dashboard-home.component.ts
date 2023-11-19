import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit {
  public productList: Array<GetAllProductsResponse> = [];


  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private productsDtService: ProductsDataTransferService
  ) { }

  ngOnInit(): void {
    this.getProductsDatas();
  }
  getProductsDatas(): void {
    this.productService.gerAllProducts().subscribe({
        next: (response) => {
        if(response.length > 0){
          this.productList = response;
          this.productsDtService.setProductsDatas(this.productList);
        }
      }, error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao obter os dados dos produtos.',
          life: 3000,
        });
      }
  })
  }

}
