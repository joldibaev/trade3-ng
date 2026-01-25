import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'ui-tab',
  templateUrl: './ui-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTab {
  label = input.required<string>();

  content = viewChild.required(TemplateRef);
}
