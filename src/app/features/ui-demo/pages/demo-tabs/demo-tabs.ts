import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';
import { UiTab } from '../../../../core/ui/ui-tab/ui-tab';
import { UiTabGroup } from '../../../../core/ui/ui-tab/ui-tab-group';

@Component({
  selector: 'app-demo-tabs',
  standalone: true,
  imports: [CommonModule, UiPageHeader, UiCard, UiTabGroup, UiTab],
  templateUrl: './demo-tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTabsPage {}
