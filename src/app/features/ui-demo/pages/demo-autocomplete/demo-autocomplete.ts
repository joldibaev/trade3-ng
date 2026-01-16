import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { UiAutocomplete } from '../../../../core/ui/ui-autocomplete/ui-autocomplete';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-demo-autocomplete',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiAutocomplete],
  templateUrl: './demo-autocomplete.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoAutocompletePage {
  products: Product[] = [
    { id: 'p1', name: 'Apple' },
    { id: 'p2', name: 'Banana' },
    { id: 'p3', name: 'Orange' },
    { id: 'p4', name: 'Product A' },
    { id: 'p5', name: 'Product B' },
    { id: 'p6', name: 'Test Item' },
  ];

  filteredProducts = signal<Product[]>([]);
  selectedProductId = signal('');
  searchQuery = signal('');
  loading = signal(false);

  constructor() {
    effect(() => {
      const q = this.searchQuery().toLowerCase();
      // simulating api call
      this.loading.set(true);

      setTimeout(() => {
        this.filteredProducts.set(this.products.filter((p) => p.name.toLowerCase().includes(q)));
        this.loading.set(false);
      }, 500);
    });
  }
}
