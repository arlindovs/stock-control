import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

/**
 * Serviço responsável por transferir dados de produtos.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  /**
   * Emissor de dados dos produtos.
   */
  public productsDataEmitter$ =
    new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);

  /**
   * Dados dos produtos.
   */
  public productsDatas: Array<GetAllProductsResponse> = [];

  /**
   * Define os dados dos produtos.
   * @param products Os produtos a serem definidos.
   */
  setProductsDatas(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.productsDataEmitter$.next(products);
      this.getProductsDatas();
    }
  }

  /**
   * Obtém os dados dos produtos.
   * @returns Os dados dos produtos filtrados.
   */
  getProductsDatas(): Array<GetAllProductsResponse> {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data) => data?.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.productsDatas = response;
          }
        },
      });
    return this.productsDatas;
  }
}
