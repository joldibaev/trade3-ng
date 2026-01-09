import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Field, form } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { BarcodesService } from '../../../../../core/services/barcodes.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { ProductsService } from '../../../../../core/services/products.service';
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { UiTree } from '../../../../../core/ui/ui-tree/ui-tree';
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
  imports: [UiButton, UiIcon, UiInput, UiLoading, UiTable, UiTree, Field],
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
  private barcodesService = inject(BarcodesService);
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

  searchForm = form(signal({ query: '' }));

  isSearchVisible = signal(false);

  // Resources
  categories = this.categoriesService.getAll();
  products = this.productsService.getAll({
    includes: ['category', 'prices', 'stocks', 'barcodes'],
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
      key: 'barcodes',
      header: 'Штрихкод',
      valueGetter: (row) => row.barcodes?.map((b) => b.value).join(', ') || '-',
    },
    {
      key: 'stocks',
      header: 'Количество',
      valueGetter: (row) => row.stocks?.[0]?.quantity || 0,
    },
    {
      key: 'categoryId',
      header: 'Ед. изм.',
      valueGetter: () => 'шт',
    },
    {
      key: 'prices',
      header: 'Цена',
      valueGetter: (row) => `${row.prices?.[0]?.value || 0} ₸`,
    },
  ];

  // Derived state: build hierarchy from flat list
  rootCategories = computed(() => {
    const all = this.categories.value() || [];
    const rootNodes: (Category & { children: Category[] })[] = [];
    const idMap = new Map<string, Category & { children: Category[] }>();

    // First pass: create nodes
    all.forEach((c) => {
      idMap.set(c.id, { ...c, children: [] });
    });

    // Second pass: link parents/children
    all.forEach((c) => {
      const node = idMap.get(c.id)!;
      if (c.parentId && idMap.has(c.parentId)) {
        idMap.get(c.parentId)!.children.push(node);
      } else if (!c.parentId) {
        rootNodes.push(node);
      }
    });

    // Recursive sorting function
    const sortNodes = (nodes: (Category & { children: Category[] })[]) => {
      nodes.sort((a, b) => {
        const aHasChildren = a.children.length > 0;
        const bHasChildren = b.children.length > 0;

        if (aHasChildren && !bHasChildren) return -1;
        if (!aHasChildren && bHasChildren) return 1;

        return a.name.localeCompare(b.name);
      });

      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortNodes(node.children as (Category & { children: Category[] })[]);
        }
      });
    };

    sortNodes(rootNodes);
    return rootNodes;
  });

  filteredProducts = computed(() => {
    const products = this.products.value() || [];
    const query = this.searchForm().value().query.toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.article && p.article.toLowerCase().includes(query)),
    );
  });

  // Proxy for tree selection to sync with query params
  get selectedCategoryIdForTree() {
    return this.selectedCategoryId();
  }
  set selectedCategoryIdForTree(id: string | undefined) {
    if (id !== this.selectedCategoryId()) {
      // Find category in the flat list
      const category = this.categories.value()?.find((c) => c.id === id);
      this.selectCategory(category);
    }
  }

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

    this.productsService
      .fetchById(product.id, ['barcodes'])
      .subscribe((fullProduct) => {
        this.openProductDialog(fullProduct);
      });
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
          // 1. Strip barcodes from product payload
          const { barcodes, ...productData } = result;

          // 2. Save or Create Product
          const product$ = product
            ? this.productsService.update(product.id, productData as unknown as Partial<Product>)
            : this.productsService.create(productData as unknown as Product);

          return product$.pipe(
            switchMap((savedProduct) => {
              // 3. Handle Barcodes
              const newBarcodes = barcodes;
              const originalBarcodes = product?.barcodes ?? [];

              // Find added barcodes (no ID)
              const added = newBarcodes.filter((b) => !b.id);

              // Find removed barcodes (present in original but not in result)
              const removed = originalBarcodes.filter(
                (ob) => !newBarcodes.find((nb) => nb.id === ob.id),
              );

              const tasks = [
                ...added.map((b) =>
                  this.barcodesService.create({
                    value: b.value,
                    product: undefined as any, // Not needed for create if productId is present
                    productId: savedProduct.id,
                  } as any),
                ),
                ...removed.map((b) => this.barcodesService.delete(b.id)),
              ];

              return forkJoin(tasks.length ? tasks : [of(null)]).pipe(map(() => savedProduct));
            }),
          );
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
