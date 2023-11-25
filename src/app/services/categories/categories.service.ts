import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GetAllCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetAllCategoriesResponse';
import { environment } from 'src/environments/environment';

/**
 * Serviço responsável por lidar com as operações relacionadas às categorias.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
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
   * Obtém todas as categorias.
   * @returns Um Observable contendo um array de objetos GetAllCategoriesResponse.
   */
  getAllCategories(): Observable<Array<GetAllCategoriesResponse>> {
    return this.http.get<Array<GetAllCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    );
  }

  /**
   * Cria uma nova categoria.
   * @param requestDatas As informações da nova categoria.
   * @returns Um Observable contendo um array de objetos GetAllCategoriesResponse.
   */
  createNewCategory(requestDatas: {
    name: string;
  }): Observable<Array<GetAllCategoriesResponse>> {
    return this.http.post<Array<GetAllCategoriesResponse>>(
      `${this.API_URL}/category`,
      requestDatas,
      this.httpOptions
    );
  }

  /**
   * Edita o nome de uma categoria existente.
   * @param requestDatas As informações para editar o nome da categoria.
   * @returns Um Observable vazio.
   */
  editCategoryName(requestDatas: {
    name: string;
    category_id: string;
  }): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`,
      { name: requestDatas?.name },
      {
        ...this.httpOptions,
        params: {
          category_id: requestDatas?.category_id,
        },
      }
    );
  }

  /**
   * Deleta uma categoria existente.
   * @param requestDatas As informações para deletar a categoria.
   * @returns Um Observable vazio.
   */
  deleteCategory(requestDatas: { category_id: string }): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions,
      params: {
        category_id: requestDatas?.category_id,
      },
    });
  }
}
