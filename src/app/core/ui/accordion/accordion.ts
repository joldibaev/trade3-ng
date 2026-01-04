import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger} from '@angular/aria/accordion';

@Component({
  selector: 'ui-accordion',
  imports: [
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent
  ],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full max-w-2xl'
  }
})
export class Accordion {
  items = input<{ title: string; content: string }[]>([]);
}
