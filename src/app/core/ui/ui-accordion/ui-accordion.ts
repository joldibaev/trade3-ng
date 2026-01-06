import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-accordion',
  imports: [AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent],
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
