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
    { title: 'Section 1', content: 'Content for section 1. This can be any text description.' },
    { title: 'Section 2', content: 'Content for section 2. More details here.' },
    { title: 'Section 3', content: 'Content for section 3. Final bits of information.' },
  ];
}
