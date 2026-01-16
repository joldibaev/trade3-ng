import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiDirectoryItemCard } from '../../../../core/ui/ui-directory-item-card/ui-directory-item-card';
import { UiNotyfService } from '../../../../core/ui/ui-notyf/ui-notyf.service';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-directory-item-card',
  standalone: true,
  imports: [UiPageHeader, UiDirectoryItemCard],
  templateUrl: './demo-directory-item-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoDirectoryItemCardPage {
  constructor(private notyf: UiNotyfService) {}

  onEdit(name: string) {
    this.notyf.info(`Edit clicked for ${name}`);
  }

  onDelete(name: string) {
    this.notyf.error(`Delete clicked for ${name}`);
  }
}
