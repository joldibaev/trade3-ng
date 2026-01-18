import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { UiAutocomplete } from '../../../../core/ui/ui-autocomplete/ui-autocomplete';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-demo-autocomplete',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiAutocomplete, FormsModule, JsonPipe, UiButton, FormField],
  templateUrl: './demo-autocomplete.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
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
  loading = signal(false);

  // Signal Form
  formState = signal({
    productId: '',
  });

  demoForm = form(this.formState, (p) => {
    required(p.productId, { message: 'Please select a product' });
  });

  // Standalone search query signal for autocomplete
  searchQuery = signal('');

  constructor() {
    effect(() => {
      const q = this.searchQuery().toLowerCase();
      // simulating api call
      this.loading.set(true);

      const timer = setTimeout(() => {
        this.filteredProducts.set(this.products.filter((p) => p.name.toLowerCase().includes(q)));
        this.loading.set(false);
      }, 500);

      return () => clearTimeout(timer);
    });
  }

  resetForm() {
    this.demoForm().reset();
    this.searchQuery.set('');
  }

  // Playground Config
  configLabel = signal('Search Label');
  configPlaceholder = signal('Type something...');
  configLoading = signal(false);
  configDisabled = signal(false);
}
