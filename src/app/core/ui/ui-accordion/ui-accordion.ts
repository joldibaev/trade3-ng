import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UiIcon } from '../ui-icon/ui-icon.component';

@Component({
  selector: 'ui-accordion',
  imports: [AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent, UiIcon],
  templateUrl: './ui-accordion.html',
  styleUrl: './ui-accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full max-w-2xl',
  },
})
export class UiAccordion {
  items = input<{ title: string; content: string }[]>([]);
}
