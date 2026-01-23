import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class PurchaseDetailsPage {}
