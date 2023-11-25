import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetAllCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetAllCategoriesResponse';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoryAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';

/**
 * Componente responsável por exibir a página inicial de categorias.
 */
@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: [],
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  private ref!: DynamicDialogRef;

  /**
   * Array contendo os dados das categorias.
   */
  public categoriesDatas: Array<GetAllCategoriesResponse> = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  /**
   * Método executado ao inicializar o componente.
   */
  ngOnInit(): void {
    this.getAllCategories();
  }

  /**
   * Obtém todas as categorias.
   */
  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao buscar as categorias',
            life: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  /**
   * Manipula a ação de exclusão de uma categoria.
   * @param event O objeto contendo os detalhes da ação de exclusão.
   */
  handleDeleteCategoryAction(event: DeleteCategoryAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente excluir a categoria ${event.categoryName}?`,
        header: 'Excluir Categoria',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCategory(event?.category_id),
      });
    }
  }

  /**
   * Exclui uma categoria.
   * @param category_id O ID da categoria a ser excluída.
   */
  deleteCategory(category_id: string): void {
    if (category_id) {
      this.categoriesService
        .deleteCategory({ category_id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getAllCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria excluída com sucesso',
              life: 3000,
            });
          },
          error: (err) => {
            console.log(err);
            this.getAllCategories();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erro ao excluir a categoria',
              life: 3000,
            });
          },
        });

        this.getAllCategories();
    }
  }

  /**
   * Manipula a ação de uma categoria.
   * @param event O objeto contendo os detalhes da ação.
   */
  handleCategoryAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(CategoriesFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle:{ overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({ next: () =>
        this.getAllCategories(),
      });
    }
  }

  /**
   * Método executado ao destruir o componente.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
