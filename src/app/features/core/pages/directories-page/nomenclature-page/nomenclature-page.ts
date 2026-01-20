import { Dialog } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
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
import { IconName } from '../../../../../core/ui/ui-icon/data'; // Restore import
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
import { Category } from '../../../../../shared/interfaces/entities/category.interface';
import { Product } from '../../../../../shared/interfaces/entities/product.interface';
import { CategoryDialog } from './category-dialog/category-dialog';

@Component({
  selector: 'app-nomenclature-page',
  imports: [UiButton, UiIcon, UiInput, UiLoading, UiTable, UiTree, FormField, UiCard, DecimalPipe],
  templateUrl: './nomenclature-page.html',
  styleUrl: './nomenclature-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4',
  },
})
export class NomenclaturePage {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private priceTypesService = inject(PriceTypesService);
  private storesService = inject(StoresService);
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

  selectedTree = linkedSignal<string[]>(() => {
    const categoryId = this.categoryId();
    return categoryId ? [categoryId] : ['all'];
  });

  // Resources
  categories = this.categoriesService.getAll();
  priceTypes = this.priceTypesService.getAll();
  stores = this.storesService.getAll();
  products = this.productsService.getAll({
    includes: ['category', 'prices', 'stocks', 'barcodes'],
    params: () => {
      const categoryId = this.selectedCategoryId();
      return categoryId ? { categoryId } : {};
    },
  });

  stats = computed(() => {
    const productsList = this.products.value() || [];

    // Mock status logic since backend might not provide it yet
    const activeCount = productsList.length; // Assume all active for now or filter if status exists
    const lowStockCount = 0;
    const outOfStockCount = 0;

    return [
      {
        label: 'Всего товаров',
        value: productsList.length,
        icon: 'outline-box' as IconName,
      },
      {
        label: 'Активные',
        value: activeCount,
        icon: 'outline-check' as IconName,
      },
      {
        label: 'Мало на складе',
        value: lowStockCount,
        icon: 'outline-alert-circle' as IconName,
      },
      {
        label: 'Нет в наличии',
        value: outOfStockCount,
        icon: 'outline-x' as IconName,
      },
    ];
  });

  columns = computed<TableColumn<Product>[]>(() => {
    const priceTypes = this.priceTypes.value() || [];

    const baseColumns: TableColumn<Product>[] = [
      {
        key: 'id',
        header: 'Код',
        type: 'id',
        width: '100px',
      },
      {
        key: 'name',
        header: 'Название товара',
        type: 'template',
        templateName: 'name',
        width: '300px',
      },
    ];

    // Using just one price type for main view (e.g. Retail) to match design, or first available
    const mainPriceType = priceTypes[0];
    const priceColumn: TableColumn<Product> = {
      key: 'price',
      header: 'Цена',
      type: 'text',
      width: '120px',
      valueGetter: (row) => {
        const price = row.prices?.find((p) => p.priceTypeId === mainPriceType?.id);
        const val = price ? price.value : 0;
        return `${val.toLocaleString('en-US')} UZS`;
      },
      classList: 'font-bold text-slate-900',
    };

    const stockColumn: TableColumn<Product> = {
      key: 'stock',
      header: 'Остаток',
      type: 'text',
      width: '100px',
      valueGetter: (row) => {
        const totalStock = row.stocks?.reduce((s, stock) => s + (stock.quantity || 0), 0) || 0;
        return totalStock.toString();
      },
      classList: 'font-medium text-emerald-600', // Default color for now
    };

    const statusColumn: TableColumn<Product> = {
      key: 'status',
      header: 'Статус',
      type: 'badge',
      width: '120px',
      valueGetter: () => 'active',
      badgeVariants: {
        active: 'success',
        inactive: 'neutral',
      },
      badgeLabels: {
        active: 'Активен',
        inactive: 'Неактивен',
      },
    };

    const actionColumn: TableColumn<Product> = {
      key: 'actions',
      header: 'Actions',
      type: 'template',
      templateName: 'actions',
      width: '100px',
      align: 'right',
    };

    return [...baseColumns, priceColumn, stockColumn, statusColumn, actionColumn];
  });

  getCategoryName(id?: string): string {
    if (!id) return '';
    return this.categories.value()?.find((c) => c.id === id)?.name || '';
  }

  // Derived state: build hierarchy from flat list
  rootCategories = computed<TreeNode[]>(() => {
    const all = this.categories.value() || [];
    const selectedId = untracked(() => this.selectedCategoryId());
    const rootNodes: TreeNode[] = [];
    const idMap = new Map<string, TreeNode>();

    // 0. Начальный узел "Все товары"
    rootNodes.push({
      id: 'all',
      label: 'Все товары',
      expanded: false,
      children: [],
      icon: 'outline-box',
      routerLink: [],
      queryParams: { categoryId: null },
      queryParamsHandling: 'merge',
    });

    // 1. Первый проход: создание всех узлов
    all.forEach((c) => {
      idMap.set(c.id, {
        id: c.id,
        label: c.name,
        expanded: false,
        children: [],
        icon: 'outline-folder',
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
        // Пропускаем узел "Все товары", так как он уже настроен
        if (node.id === 'all') return;

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

        // Обновляем иконку в зависимости от наличия детей
        node.icon = node.children.length > 0 ? 'outline-folder' : 'outline-tag';

        // Роутинг для всех категорий
        node.routerLink = [];
        node.queryParams = { categoryId: node.id };
        node.queryParamsHandling = 'merge';
      });

      // Сортировка (сначала "Все товары", затем папки, потом листки, затем по алфавиту)
      nodes.sort((a, b) => {
        if (a.id === 'all') return -1;
        if (b.id === 'all') return 1;

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
    void this.router.navigate([product.id, 'edit'], { relativeTo: this.activatedRoute });
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
  createProduct() {
    void this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  editProduct(product: Product) {
    void this.router.navigate([product.id, 'edit'], { relativeTo: this.activatedRoute });
  }

  /* Deprecated/Removed Dialog Logic */

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
