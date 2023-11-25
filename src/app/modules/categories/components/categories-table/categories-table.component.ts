import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/app/models/enums/categories/CategoryEvent';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoryAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { GetAllCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetAllCategoriesResponse';

/**
 * Componente de tabela de categorias.
 */
@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: []
})
export class CategoriesTableComponent {

  /**
   * Lista de categorias.
   */
  @Input() public categories: Array<GetAllCategoriesResponse> = [];

  /**
   * Evento emitido ao editar uma categoria.
   */
  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();

  /**
   * Evento emitido ao excluir uma categoria.
   */
  @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();

  /**
   * Categoria selecionada.
   */
  public categorySelected!: GetAllCategoriesResponse;

  /**
   * Ação de adicionar categoria.
   */
  public addCategoryAction = CategoryEvent.ADD_CATEOGRY_ACTION;

  /**
   * Ação de editar categoria.
   */
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  /**
   * Manipula o evento de exclusão de categoria.
   * @param category_id O ID da categoria a ser excluída.
   * @param categoryName O nome da categoria a ser excluída.
   */
  handleDeleteCategoryEvent(category_id: string, categoryName: string): void {
    if(category_id !== '' && categoryName !== '') {
      this.deleteCategoryEvent.emit({category_id, categoryName});
    }
  }

  /**
   * Manipula o evento de categoria.
   * @param action A ação a ser executada.
   * @param id O ID da categoria.
   * @param categoryName O nome da categoria.
   */
  handleCategoryEnvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== '') {
      this.categoryEvent.emit({ action, id, categoryName });
    }
  }
}
