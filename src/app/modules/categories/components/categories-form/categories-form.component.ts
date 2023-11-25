import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryEvent } from 'src/app/models/enums/categories/CategoryEvent';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';

/**
 * Componente responsável por exibir e gerenciar o formulário de categorias.
 */
@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: [],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  /**
   * Subject utilizado para destruir observables quando o componente é destruído.
   */
  private readonly destroy$: Subject<void> = new Subject();

  /**
   * Ação para adicionar uma nova categoria.
   */
  public addCategoryAction = CategoryEvent.ADD_CATEOGRY_ACTION;

  /**
   * Ação para editar uma categoria existente.
   */
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  /**
   * Ação de categoria atual.
   */
  public categoryAction!: { event: EditCategoryAction };

  /**
   * Formulário de categoria.
   */
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    /**
     * Define a ação de categoria com base nos dados recebidos.
     */
    this.categoryAction = this.ref.data;

    if (
      (this.categoryAction?.event?.action === this.editCategoryAction &&
        this.categoryAction?.event?.categoryName) || undefined
        ) {
      /**
       * Define o nome da categoria no formulário.
       * @param categoryName - O nome da categoria.
       */
      this.setCategoryName(this.categoryAction?.event?.categoryName as string);
    }
  }

  /**
   * Manipula o envio da ação de categoria.
   */
  handleSubmitCategoryAction(): void {
    if (this.categoryAction?.event?.action === this.addCategoryAction) {
      this.handleSubmitAddCategory();
    } else if (this.categoryAction?.event?.action === this.editCategoryAction) {
      this.handleSubmitEditCategory();
    }

    return;
  }

  /**
   * Manipula o envio da ação de adicionar categoria.
   */
  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      /**
       * Objeto de requisição para criar uma nova categoria.
       */
      const requestCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string,
      };

      this.categoriesService
        .createNewCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response) {
              this.categoryForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Categoria criada com sucesso!',
                life: 3000,
              });
            }
          },
          error: (error) => {
            console.log(error);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
              life: 3000,
            });
          },
        });
    }
  }

  /**
   * Manipula o envio da ação de editar categoria.
   */
  handleSubmitEditCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid && this.categoryAction?.event?.id) {
      /**
       * Objeto de requisição para editar o nome de uma categoria.
       */
      const requestEditCategory: { name: string; category_id: string } = {
        name: this.categoryForm.value.name as string,
        category_id: this.categoryAction?.event?.id,
      };

      this.categoriesService
        .editCategoryName(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
              this.categoryForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Categoria editada com sucesso!',
                life: 3000,
              });
          },
          error: (error) => {
            console.log(error);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
              life: 3000,
            });
          },
        });
    }
  }

  /**
   * Define o nome da categoria no formulário.
   * @param categoryName - O nome da categoria.
   */
  setCategoryName(categoryName: string): void {
    if(categoryName) {
      this.categoryForm.setValue({ name: categoryName });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
