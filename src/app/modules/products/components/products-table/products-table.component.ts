import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

/**
 * Componente de tabela de produtos.
 */
@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: [],
})
export class ProductsTableComponent {
  /**
   * Lista de produtos.
   */
  @Input() products: Array<GetAllProductsResponse> = [];

  /**
   * Evento emitido quando ocorre uma ação relacionada a um produto.
   */
  @Output() productEvent = new EventEmitter<EventAction>();

  /**
   * Evento emitido quando ocorre uma ação de exclusão de um produto.
   */
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  /**
   * Produto selecionado.
   */
  public productSelected!: GetAllProductsResponse;

  /**
   * Evento de adição de produto.
   */
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;

  /**
   * Evento de edição de produto.
   */
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  /**
   * Manipula o evento relacionado a um produto.
   * @param action - Ação relacionada ao produto.
   * @param id - ID do produto (opcional).
   */
  handleProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const productEventData = id && id !== '' ? { action, id } : { action };
      this.productEvent.emit(productEventData);
    }
  }

  /**
   * Manipula o evento de exclusão de um produto.
   * @param product_id - ID do produto.
   * @param productName - Nome do produto.
   */
  handleDeleteProduct(product_id: string, productName: string): void {
    if(product_id !== '' && productName !== ''){
      this.deleteProductEvent.emit({ product_id, productName });
    }
  }
}
