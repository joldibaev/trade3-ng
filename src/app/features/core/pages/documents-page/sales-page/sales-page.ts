import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sales-page',
  imports: [],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesPage {}
