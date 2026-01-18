import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButton } from '../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiCheckbox } from '../../../../core/ui/ui-checkbox/ui-checkbox';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { UiSwitch } from '../../../../core/ui/ui-switch/ui-switch';
import { UiTab } from '../../../../core/ui/ui-tab/ui-tab';
import { UiTabGroup } from '../../../../core/ui/ui-tab/ui-tab-group';

@Component({
  selector: 'app-demo-tabs',
  standalone: true,
  imports: [CommonModule, UiPageHeader, UiCard, UiTabGroup, UiTab, UiCheckbox, UiSwitch, UiButton],
  templateUrl: './demo-tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTabsPage {
  tabs = signal(['Tab 1', 'Tab 2', 'Tab 3']);

  addTab() {
    this.tabs.update((tabs) => [...tabs, `Tab ${tabs.length + 1}`]);
  }

  removeTab() {
    this.tabs.update((tabs) => tabs.slice(0, -1));
  }
}
