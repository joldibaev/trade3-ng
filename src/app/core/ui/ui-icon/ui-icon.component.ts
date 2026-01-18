import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconName, ICONS } from './data';

@Component({
  selector: 'ui-icon',
  template: '',
  host: {
    role: 'presentation',
    '[innerHTML]': 'svgContent()',
    class: 'flex items-center justify-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiIcon {
  private sanitizer = inject(DomSanitizer);

  name = input.required<IconName>();
  width = input(16, { transform: numberAttribute });
  height = input(16, { transform: numberAttribute });

  svgContent = computed<SafeHtml | string>(() => {
    const iconName = this.name();
    const svgString = ICONS[iconName];

    // clean attributes
    const cleaned = svgString.replace(
      /<svg([^>]*?)>/,
      (_, attrs: string) =>
        `<svg${attrs.replace(/\swidth="[^"]*"/g, '').replace(/\sheight="[^"]*"/g, '')}>`,
    );

    // inject width and height attributes
    const replaced = cleaned.replace(
      /<svg([^>]*?)>/,
      (_, attrs: string) => `<svg${attrs} width="${this.width()}" height="${this.height()}">`,
    );

    if (!svgString) {
      console.warn(`Icon not found: ${iconName}`);
      return '';
    }

    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  });
}
