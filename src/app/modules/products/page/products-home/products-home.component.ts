import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

/**
 * Componente responsável pela exibição da página inicial de produtos.
 */
@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: [],
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private ref!: DynamicDialogRef;
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  /**
   * Método executado ao inicializar o componente.
   */
  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  /**
   * Obtém os dados dos produtos do serviço de transferência de dados.
   * Se não houver dados carregados, chama o método para obter os dados da API.
   */
  getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsDatas();
    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else this.getAPIProductsDatas();
  }

  /**
   * Obtém os dados dos produtos da API.
   */
  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error ao carregar os produtos',
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  /**
   * Manipula a ação do produto.
   * @param event Ação do produto.
   */
  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productsDatas: this.productsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIProductsDatas(),
      });
    }
  }

  /**
   * Manipula a exclusão do produto.
   * @param event Dados do produto a ser excluído.
   */
  handleDeleteProduct(event: {
    product_id: string;
    productName: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Tem certeza que deseja excluir o produto ${event.productName}?`,
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id),
      });
    }
  }

  /**
   * Exclui o produto.
   * @param product_id ID do produto a ser excluído.
   */
  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService
        .deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto excluído com sucesso!',
                life: 3000,
              });
              this.getAPIProductsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error ao excluir o produto!',
              life: 3000,
            });
          },
        });
    }
  }

  /**
   * Executado ao destruir o componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
