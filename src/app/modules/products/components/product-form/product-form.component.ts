import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetAllCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject<void>();

  public categoriesDatas: Array<GetAllCategoriesResponse> = [];

  public selectedCategory: Array<{name: string, code: string}> = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0) {
            this.categoriesDatas = response;
          }
        }
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.valid && this.addProductForm?.value) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        description: this.addProductForm.value.description as string,
        price: this.addProductForm.value.price as string,
        amount: Number(this.addProductForm.value.amount),
        category_id: this.addProductForm.value.category_id as string,
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 3000,
              });
              this.router.navigate(['/products']);
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.error.message,
              life: 3000,
            });
          },
        });
    }

    this.addProductForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
