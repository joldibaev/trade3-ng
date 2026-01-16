import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { PriceTypesService } from '../../../../../core/services/price-types.service'; // [NEW]
import { ProductsService } from '../../../../../core/services/products.service';
import { StoresService } from '../../../../../core/services/stores.service'; // [NEW]
import { UiButton } from '../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../core/ui/ui-card/ui-card';
import { UiDialogConfirm } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm';
import { UiDialogConfirmData } from '../../../../../core/ui/ui-dialog-confirm/ui-dialog-confirm-data.interface';
import { UiIcon } from '../../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../../core/ui/ui-input/ui-input';
import { UiLoading } from '../../../../../core/ui/ui-loading/ui-loading';
import { TableColumn } from '../../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../../core/ui/ui-table/ui-table';
import { TreeNode } from '../../../../../core/ui/ui-tree/tree-item.interface';
import { UiTree } from '../../../../../core/ui/ui-tree/ui-tree';
import {
  CategoryDialogData,
  CategoryDialogResult,
} from '../../../../../shared/interfaces/dialogs/category-dialog.interface';
import {
  ProductDialogData,
  ProductDialogResult,
} from '../../../../../shared/interfaces/dialogs/product-dialog.interface';
import { Category } from '../../../../../shared/interfaces/entities/category.interface';
import { Product } from '../../../../../shared/interfaces/entities/product.interface';
import { CategoryDialog } from './category-dialog/category-dialog';
import { ProductDialog } from './product-dialog/product-dialog';

@Component({
  selector: 'app-nomenclature-page',
  imports: [UiButton, UiIcon, UiInput, UiLoading, UiTable, UiTree, FormField, UiCard],
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
  private priceTypesService = inject(PriceTypesService);
  private storesService = inject(StoresService); // [NEW]
  private dialog = inject(Dialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // State
  categoryId = input<string>();
  selectedCategoryId = computed(() => this.categoryId());

  selectedProduct = signal<Product | undefined>(undefined);

  formState = signal({ query: '' });
  formData = form(this.formState);

  isSearchVisible = signal(false);

  // Resources
  categories = this.categoriesService.getAll();
  priceTypes = this.priceTypesService.getAll();
  stores = this.storesService.getAll(); // [NEW]
  products = this.productsService.getAll({
    includes: ['category', 'prices', 'stocks', 'barcodes'],
    params: () => {
      const categoryId = this.selectedCategoryId();
      return categoryId ? { categoryId } : {};
    },
  });

  columns = computed<TableColumn<Product>[]>(() => {
    const priceTypes = this.priceTypes.value() || [];
    const stores = this.stores.value() || []; // [NEW]

    const baseColumns: TableColumn<Product>[] = [
      {
        key: 'id',
        header: 'ID',
        type: 'text',
      },
      {
        key: 'name',
        header: 'Наименование',
        type: 'text',
      },
      {
        key: 'article',
        header: 'Артикул',
        type: 'text',
        valueGetter: (row) => row.article || '-',
      },
      {
        key: 'barcodes',
        header: 'Штрихкод',
        type: 'text',
        valueGetter: (row) => row.barcodes?.map((b) => b.value).join(', ') || '-',
      },
    ];

    const storeColumns: TableColumn<Product>[] = stores.map(
      (store): TableColumn<Product> => ({
        key: store.id,
        header: store.name,
        type: 'text',
        valueGetter: (row) => {
          const stock = row.stocks?.find((s) => s.storeId === store.id);
          return stock ? `${stock.quantity} шт` : '-';
        },
      }),
    );

    const priceColumns: TableColumn<Product>[] = priceTypes.map(
      (pt): TableColumn<Product> => ({
        key: pt.id, // Dynamic key (UUID)
        header: pt.name,
        type: 'text',
        valueGetter: (row) => {
          const price = row.prices?.find((p) => p.priceTypeId === pt.id);
          return price ? `${price.value} UZS` : '-';
        },
      }),
    );

    return [...baseColumns, ...storeColumns, ...priceColumns];
  });

  // Derived state: build hierarchy from flat list
  rootCategories = computed<TreeNode[]>(() => {
    const all = this.categories.value() || [];
    const selectedId = untracked(() => this.selectedCategoryId());
    const rootNodes: TreeNode[] = [];
    const idMap = new Map<string, TreeNode>();

    // 1. Первый проход: создание всех узлов
    all.forEach((c) => {
      idMap.set(c.id, {
        id: c.id,
        label: c.name,
        expanded: false, // По умолчанию закрыто
        children: [],
      });
    });

    // 2. Второй проход: связывание родителей и детей
    all.forEach((c) => {
      const node = idMap.get(c.id);
      if (!node) return;

      if (c.parentId && idMap.has(c.parentId)) {
        const parent = idMap.get(c.parentId);
        parent?.children.push(node);
      } else if (!c.parentId) {
        rootNodes.push(node);
      }
    });

    /**
     * Рекурсивная функция обработки:
     * Возвращает true, если в поддереве этого узла есть выбранная категория
     */
    const processNodes = (nodes: TreeNode[]): boolean => {
      let subtreeHasSelected = false;

      nodes.forEach((node) => {
        // Проверяем, выбран ли текущий узел
        const isCurrentSelected = node.id === selectedId;

        // Рекурсивно обрабатываем детей и узнаем, есть ли выбранный среди них
        const childHasSelected = processNodes(node.children);

        // Узел должен быть раскрыт, если выбран он сам или кто-то в его детях
        node.expanded = isCurrentSelected || childHasSelected;

        // Если в этой ветке нашли выбранный элемент, помечаем для родителя
        if (node.expanded) {
          subtreeHasSelected = true;
        }

        // Добавляем роутинг только листьям
        if (node.children.length === 0) {
          node.routerLink = [];
          node.queryParams = { categoryId: node.id };
          node.queryParamsHandling = 'merge';
        }
      });

      // Сортировка (сначала папки, потом листки, затем по алфавиту)
      nodes.sort((a, b) => {
        const aHasChildren = a.children.length > 0;
        const bHasChildren = b.children.length > 0;
        if (aHasChildren && !bHasChildren) return -1;
        if (!aHasChildren && bHasChildren) return 1;
        return a.label.localeCompare(b.label);
      });

      return subtreeHasSelected;
    };

    // Запускаем рекурсию
    processNodes(rootNodes);

    return rootNodes;
  });

  filteredProducts = computed(() => {
    const products = this.products.value() || [];
    const query = this.formData().value().query.toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (schemaPath) =>
        schemaPath.name.toLowerCase().includes(query) ||
        (schemaPath.article && schemaPath.article.toLowerCase().includes(query)),
    );
  });

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

    this.productsService.fetchById(product.id, ['barcodes']).subscribe((fullProduct) => {
      this.openProductDialog(fullProduct);
    });
  }

  deleteCurrentProduct() {
    const product = this.selectedProduct();
    if (!product) return;
    this.deleteProduct(product);
  }

  openProductPage() {
    const product = this.selectedProduct();
    if (!product) return;
    void this.router.navigate([product.id], { relativeTo: this.activatedRoute });
  }

  // Categories CRUD
  openCategoryDialog(category?: Category) {
    const data: CategoryDialogData = { category };

    this.dialog
      .open<CategoryDialogResult>(CategoryDialog, { data, width: '400px' })
      .closed.pipe(
        filter(Boolean),
        tap(() => this.categories.reload()),
        takeUntilDestroyed(this.destroyRef),
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
            void this.router.navigate([], {
              queryParams: { categoryId: undefined },
              relativeTo: this.activatedRoute,
              queryParamsHandling: 'merge',
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef),
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
        tap(() => this.products.reload()),
        takeUntilDestroyed(this.destroyRef),
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
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
