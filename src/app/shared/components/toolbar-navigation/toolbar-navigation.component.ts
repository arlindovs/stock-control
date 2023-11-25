import { DialogService } from 'primeng/dynamicdialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
})
/**
 * Componente de navegação da barra de ferramentas.
 */
export class ToolbarNavigationComponent {
  constructor(
    private cookie: CookieService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  /**
   * Manipula o evento de logout.
   */
  handleLogout(): void {
    this.cookie.delete('token');
    void this.router.navigate(['/home']);
  }

  /**
   * Manipula o evento de venda de produto.
   */
  handleSaleProduct(): void {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

    this.dialogService.open(ProductFormComponent, {
      header: saleProductAction,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: ProductEvent.SALE_PRODUCT_EVENT},
      },
    });
  }
}
