import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIconWrapper } from '../../../../../../../../core/ui/ui-icon-wrapper/ui-icon-wrapper';
import { IconName } from '../../../../../../../../core/ui/ui-icon/data';
import { UiIcon } from '../../../../../../../../core/ui/ui-icon/ui-icon.component';

@Component({
  selector: 'app-document-history-entry',
  standalone: true,
  imports: [UiIcon, UiIconWrapper, DatePipe],
  templateUrl: './document-history-entry.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DocumentHistoryEntry {
  icon = input.required<IconName>();
  colorClass = input.required<string>();
  createdAt = input.required<string>();
  userId = input<string>('Система');
}
