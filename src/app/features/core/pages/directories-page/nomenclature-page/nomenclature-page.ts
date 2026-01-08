import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { ProductsService } from '../../../../../core/services/products.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { Category } from '../../../../../shared/interfaces/entities/category.interface';
import { Product } from '../../../../../shared/interfaces/entities/product.interface';
import { CategoryDialog } from './category-dialog/category-dialog';
import { CategoryDialogData } from './category-dialog/category-dialog-data.interface';
import { CategoryDialogResult } from './category-dialog/category-dialog-result.interface';
import { ProductDialog } from './product-dialog/product-dialog';
import { ProductDialogData } from './product-dialog/product-dialog-data.interface';
import { ProductDialogResult } from './product-dialog/product-dialog-result.interface';

@Component({
  selector: 'app-nomenclature-page',
  imports: [UiButton, UiIcon, UiLoading, UiTable],
  templateUrl: './nomenclature-page.html',
  styleUrl: './nomenclature-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class NomenclaturePage {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private dialog = inject(Dialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // State
  selectedCategoryId = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['categoryId'] as string | undefined),
    ),
  );
  selectedProduct = signal<Product | undefined>(undefined);

  // Resources
  categories = this.categoriesService.getAll();
  products = this.productsService.getAll({
    includes: ['category', 'prices', 'stocks'],
    params: () => {
      const categoryId = this.selectedCategoryId();
      return categoryId ? { categoryId } : {};
    },
  });

  columns: TableColumn<Product>[] = [
    {
      key: 'id',
      header: 'Код',
      valueGetter: (_, index) => `000${index + 1}`,
      width: '80px',
    },
    {
      key: 'name',
      header: 'Наименование',
    },
    {
      key: 'article',
      header: 'Артикул',
      valueGetter: (row) => row.article || '-',
    },
    {
      key: 'stocks',
      header: 'Количество',
      valueGetter: (row) => row.stocks[0]?.quantity || 0,
    },
    {
      key: 'id',
      header: 'Ед. изм.',
      valueGetter: () => 'шт',
    },
    {
      key: 'prices',
      header: 'Цена',
      valueGetter: (row) => `${row.prices[0]?.value || 0} ₸`,
    },
  ];

  // Derived state
  filteredProducts = computed(() => {
    return this.products.value() || [];
  });

  selectCategory(category?: Category) {
    this.selectedProduct.set(undefined); // Reset product selection when category changes
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { categoryId: category?.id },
      queryParamsHandling: 'merge',
    });
  }

  selectProduct(product?: Product) {
    this.selectedProduct.set(product);
  }

  // Helper methods for template
  editCurrentCategory() {
    const id = this.selectedCategoryId();
    const category = this.categories.value()?.find((c) => c.id === id);
    if (category) {
      this.openCategoryDialog(category);
    }
  }

  deleteCurrentCategory() {
    const id = this.selectedCategoryId();
    const category = this.categories.value()?.find((c) => c.id === id);
    if (category) {
      this.deleteCategory(category);
    }
  }

  editCurrentProduct() {
    const product = this.selectedProduct();
    if (!product) return;
    this.openProductDialog(product);
  }

  deleteCurrentProduct() {
    const product = this.selectedProduct();
    if (!product) return;
    this.deleteProduct(product);
  }

  // Categories CRUD
  openCategoryDialog(category?: Category) {
    const data: CategoryDialogData = { category };

    this.dialog
      .open<CategoryDialogResult>(CategoryDialog, { data, width: '400px' })
      .closed.pipe(
        filter(Boolean),
        switchMap((result) => {
          if (category) {
            return this.categoriesService.update(category.id, result);
          }
          return this.categoriesService.create(result as unknown as Category);
        }),
        tap(() => this.categories.reload()),
      )
      .subscribe();
  }

  deleteCategory(category: Category) {
    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить категорию?',
          message: `Вы действительно хотите удалить категорию "${category.name}"?`,
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.categoriesService.delete(category.id)),
        tap(() => {
          this.categories.reload();
          if (this.selectedCategoryId() === category.id) {
            this.selectCategory(undefined);
          }
        }),
      )
      .subscribe();
  }

  // Products CRUD
  openProductDialog(product?: Product) {
    const data: ProductDialogData = {
      product,
      categoryId: this.selectedCategoryId(),
    };
    this.dialog
      .open<ProductDialogResult>(ProductDialog, { data, width: '500px' })
      .closed.pipe(
        filter(Boolean),
        switchMap((result) => {
          if (product) {
            return this.productsService.update(product.id, result);
          }
          return this.productsService.create(result as unknown as Product);
        }),
        tap(() => this.products.reload()),
      )
      .subscribe();
  }

  deleteProduct(product: Product) {
    this.dialog
      .open<boolean, UiDialogConfirmData>(UiDialogConfirm, {
        data: {
          title: 'Удалить товар?',
          message: `Вы действительно хотите удалить товар "${product.name}"?`,
          variant: 'danger',
        },
        width: '400px',
      })
      .closed.pipe(
        filter(Boolean),
        switchMap(() => this.productsService.delete(product.id)),
        tap(() => {
          this.products.reload();

          if (this.selectedProduct()?.id === product.id) {
            this.selectedProduct.set(undefined);
          }
        }),
      )
      .subscribe();
  }
}
