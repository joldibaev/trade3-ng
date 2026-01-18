import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiIcon } from '../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../core/ui/ui-input/ui-input';
import { TableColumn } from '../../../../core/ui/ui-table/table-column.interface';
import { UiTable } from '../../../../core/ui/ui-table/ui-table';

@Component({
  selector: 'app-table-struct',
  imports: [UiCard, UiButton, UiInput, FormField, UiTable, UiIcon],
  templateUrl: './table-struct.html',
  styleUrl: './table-struct.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class TableStruct<T extends object> {
  // Inputs
  title = input.required<string>();
  data = input.required<T[]>();
  columns = input.required<TableColumn<T>[]>();
  isLoading = input<boolean>(false);

  showEdit = input(false, { transform: booleanAttribute });
  showDelete = input(false, { transform: booleanAttribute });
  showDetail = input(false, { transform: booleanAttribute });

  trackField = input.required<keyof T>();

  // Model
  selectedItem = model<T | undefined>(undefined);

  // Outputs
  createdClicked = output<void>();
  detailClicked = output<T>();
  editedClicked = output<T>();
  deletedClicked = output<T>();
  searched = output<string>();

  // State
  isSearchVisible = signal(false);
  formState = signal({ query: '' });
  formData = form(this.formState);

  constructor() {
    effect(() => {
      const query = this.formData().value().query;
      untracked(() => this.searched.emit(query));
    });
  }

  // Actions
  handleCreate() {
    this.createdClicked.emit();
  }

  handleDetail() {
    const item = this.selectedItem();
    if (item) {
      this.detailClicked.emit(item);
    }
  }

  handleEdit() {
    const item = this.selectedItem();
    if (item) {
      this.editedClicked.emit(item);
    }
  }

  handleDelete() {
    const item = this.selectedItem();
    if (item) {
      this.deletedClicked.emit(item);
    }
  }

  toggleSearch() {
    if (this.isSearchVisible()) {
      this.isSearchVisible.set(false);
      this.formData.query().reset('');
    } else {
      this.isSearchVisible.set(true);
    }
  }
}
