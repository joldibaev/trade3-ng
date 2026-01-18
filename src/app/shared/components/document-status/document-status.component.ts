import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiBadge, UiBadgeVariant } from '../../../core/ui/ui-badge/ui-badge';
import { DocumentStatus } from '../../interfaces/constants';

@Component({
  selector: 'app-document-status',
  standalone: true,
  imports: [UiBadge],
  templateUrl: './document-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentStatusComponent {
  status = input<DocumentStatus | undefined>();

  statusLabels: Record<DocumentStatus, string> = {
    [DocumentStatus.DRAFT]: 'Черновик',
    [DocumentStatus.COMPLETED]: 'Проведен',
    [DocumentStatus.CANCELLED]: 'Отменен',
  };

  statusVariants: Record<DocumentStatus, UiBadgeVariant> = {
    [DocumentStatus.DRAFT]: 'neutral',
    [DocumentStatus.COMPLETED]: 'success',
    [DocumentStatus.CANCELLED]: 'destructive',
  };
}
