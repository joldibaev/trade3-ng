import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentPurchasesService } from '../../../../../../core/services/document-purchases.service';
import { UiBadge } from '../../../../../../core/ui/ui-badge/ui-badge';
import { UiButton } from '../../../../../../core/ui/ui-button/ui-button';
import { UiCard } from '../../../../../../core/ui/ui-card/ui-card';
import { UiLoading } from '../../../../../../core/ui/ui-loading/ui-loading';
import { DocumentStatus } from '../../../../../../shared/interfaces/constants';

@Component({
  selector: 'app-purchase-details-page',
  standalone: true,
  imports: [UiCard, UiButton, UiLoading, UiBadge, RouterLink, DatePipe],
  templateUrl: './purchase-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-4 h-full',
  },
})
export class PurchaseDetailsPage {
  private purchasesService = inject(DocumentPurchasesService);

  // Inputs from route
  id = input.required<string>();

  isLoading = signal(false);

  // Resources
  purchase = this.purchasesService.getById(() => this.id());

  protected readonly DocumentStatus = DocumentStatus;

  getBadgeVariant(status: DocumentStatus | undefined) {
    switch (status) {
      case DocumentStatus.COMPLETED:
        return 'success';
      case DocumentStatus.DRAFT:
        return 'secondary';
      case DocumentStatus.CANCELLED:
        return 'destructive';
      default:
        return 'primary';
    }
  }

  getBadgeLabel(status: DocumentStatus | undefined) {
    switch (status) {
      case DocumentStatus.COMPLETED:
        return 'Проведен';
      case DocumentStatus.DRAFT:
        return 'Черновик';
      case DocumentStatus.CANCELLED:
        return 'Отменен';
      default:
        return status || '-';
    }
  }
}
