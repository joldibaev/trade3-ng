import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiAccordion } from '../../../../core/ui/ui-accordion/ui-accordion';

@Component({
  selector: 'app-ui-demo-accordion-page',
  imports: [UiAccordion],
  templateUrl: './ui-demo-accordion-page.html',
  styleUrl: './ui-demo-accordion-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class UiDemoAccordionPage {
  items = [
    {
      title: 'Основные реквизиты',
      content:
        'Здесь расположены основные данные документа: дата, номер, организация и контрагент.',
    },
    {
      title: 'Дополнительно',
      content: 'Дополнительные сведения, такие как ответственный менеджер, подразделение и проект.',
    },
    {
      title: 'История изменений',
      content: 'Лог изменений документа пользователями системы.',
    },
  ];
}
