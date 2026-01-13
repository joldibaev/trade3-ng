import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-purchases-page',
  imports: [],
  templateUrl: './purchases-page.html',
  styleUrl: './purchases-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class PurchasesPage {}
