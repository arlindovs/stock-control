import { CreateProductRequest } from './../../models/interfaces/products/request/CreateProductRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { environment } from 'src/environments/environment';

/**
 * Serviço responsável por gerenciar os produtos.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = environment.apiUrl;
  private JWT_TOKEN = this.cookie.get('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  /**
   * Obtém todos os produtos disponíveis.
   * @returns Um Observable contendo um array de objetos GetAllProductsResponse.
   */
  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http
      .get<Array<GetAllProductsResponse>>(
        `${this.API_URL}/products`,
        this.httpOptions
      )
      .pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }

  deleteProduct(product_id: string): Observable<DeleteProductAction> {
    return this.http.delete<DeleteProductAction>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions,
        params: { product_id: product_id },
      }
    );
  }

  createProduct(requestDatas: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`,
      requestDatas,
      this.httpOptions
    );
  }
}
