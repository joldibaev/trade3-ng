import { Tab, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { CommonModule } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  signal,
} from '@angular/core';
import { UiTab } from './ui-tab';

@Component({
  selector: 'ui-tab-group',
  imports: [CommonModule, Tabs, TabList, Tab, TabPanel],
  templateUrl: './ui-tab-group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabGroup {
  tabs = contentChildren(UiTab);
  selectedTabId = signal<string | undefined>(undefined);

  constructor() {
    afterRenderEffect(() => {
      const tabs = this.tabs();
      if (tabs.length > 0 && !this.selectedTabId()) {
        this.selectedTabId.set(tabs[0].label());
      }
    });
  }
}
