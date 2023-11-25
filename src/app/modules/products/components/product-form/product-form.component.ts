import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetAllCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';

/**
 * Componente responsável por exibir um formulário de produto.
 */
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
/**
 * Componente responsável por exibir o formulário de produto.
 */
export class ProductFormComponent implements OnInit, OnDestroy {
  /**
   * Subject utilizado para destruir observables quando o componente é destruído.
   */
  private readonly destroy$: Subject<void> = new Subject<void>();

  /**
   * Array contendo os dados das categorias.
   */
  public categoriesDatas: Array<GetAllCategoriesResponse> = [];

  /**
   * Array contendo as categorias selecionadas.
   */
  public selectedCategory: Array<{ name: string; code: string }> = [];

  /**
   * Flag para renderizar o dropdown.
   */
  public renderDropdown = false;

  /**
   * Objeto contendo a ação do produto e os dados dos produtos.
   */
  public productAction!: {
    event: EventAction;
    productsDatas: Array<GetAllProductsResponse>;
  };

  /**
   * Dados do produto selecionado.
   */
  public productSelectedDatas!: GetAllProductsResponse;

  /**
   * Array contendo os dados dos produtos.
   */
  public productsDatas: Array<GetAllProductsResponse> = [];

  /**
   * Formulário para adicionar um produto.
   */
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  /**
   * Formulário para editar um produto.
   */
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  /**
    * Grupo de formulário para o formulário de venda de produto.
    *
    * @remarks
    * Este grupo de formulário contém os controles e validações para o formulário de venda de produto.
    */
  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });

  /**
   * Produto selecionado para venda.
   */
  public saleProductSelected!: GetAllProductsResponse;

  /**
   * Ação para adicionar um produto.
   */
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;

  /**
   * Ação para editar um produto.
   */
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;

  /**
   * Ação para vender um produto.
   */
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  /**
   * Método executado ao inicializar o componente.
   */
  ngOnInit(): void {
    this.productAction = this.ref.data;

    if (this.productAction?.event?.action === this.saleProductAction) {
      this.getProductDatas();
    }

    this.getAllCategories();
    this.renderDropdown = true;
  }

  /**
   * Obtém todas as categorias.
   */
  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;

            if (
              this.productAction?.event?.action === this.editProductAction &&
              this.productAction?.productsDatas
            ) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string);
            }
          }
        },
      });
  }

  /**
   * Manipula o envio do formulário de adição de produto.
   */
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

  /**
   * Manipula o envio do formulário de edição de produto.
   */
  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string,
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  /**
   * Manipula o envio do formulário de venda de produto.
   */
  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.value && this.saleProductForm?.valid) {
      const requestDatas: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        product_id: this.saleProductForm.value?.product_id as string,
      };

      this.productsService
        .saleProduct(requestDatas)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto vendido com sucesso!',
                life: 2500,
              });
            this.saleProductForm.reset();
            this.getProductDatas();
            this.router.navigate(['/dashboard']);
          }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao vender produto!',
              life: 2500,
            });
            this.saleProductForm.reset();
          },
        });
    }
  }

  /**
   * Obtém os dados do produto selecionado.
   * @param productId O ID do produto selecionado.
   */
  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productsDatas;

    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId
      );

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
          category_id: this.productSelectedDatas?.category?.id,
        });
      }
    }
  }

  /**
   * Obtém os dados dos produtos.
   */
  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.productsDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }

  /**
   * Método executado ao destruir o componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
