import { Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'ui-tab',
  templateUrl: './ui-tab.html',
})
export class UiTab {
  label = input.required<string>();

  content = viewChild.required(TemplateRef);
}
