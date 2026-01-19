import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { ICONS, IconName } from '../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../core/ui/ui-icon/ui-icon.component';
import { UiInput } from '../../../../core/ui/ui-input/ui-input';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-icon',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiInput, UiIcon, FormsModule],
  templateUrl: './demo-icon.html',
  host: { class: 'flex flex-col gap-4' },
})
export class DemoIconPage {
  searchQuery = signal('');

  allIcons = Object.keys(ICONS) as IconName[];

  filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.allIcons;
    return this.allIcons.filter((name) => name.toLowerCase().includes(query));
  });

  copyIconName(name: string) {
    navigator.clipboard.writeText(name);
    // Could add toast notification here
  }
}
