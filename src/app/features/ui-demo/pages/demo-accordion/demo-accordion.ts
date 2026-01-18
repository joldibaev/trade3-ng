import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiAccordion } from '../../../../core/ui/ui-accordion/ui-accordion';
import { UiCard } from '../../../../core/ui/ui-card/ui-card';
import { UiPageHeader } from '../../../../core/ui/ui-page-header/ui-page-header';

@Component({
  selector: 'app-demo-accordion',
  standalone: true,
  imports: [UiPageHeader, UiCard, UiAccordion],
  templateUrl: './demo-accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class DemoAccordionPage {
  items = [
    {
      title: 'Common Questions',
      content:
        'Find answers to frequently asked questions about our services, pricing, and support policies.',
    },
    {
      title: 'Account Management',
      content:
        'Learn how to manage your profile, update security settings, and configure notification preferences.',
    },
    {
      title: 'Billing & Invoicing',
      content:
        'Access your billing history, download invoices, and manage payment methods securely.',
    },
  ];
}
