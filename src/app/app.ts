import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Button} from './core/ui/button/button';
import {Input} from './core/ui/input/input';
import {Accordion} from './core/ui/accordion/accordion';
import {Menu as UiMenu} from './core/ui/menu/menu';
import {Table} from './core/ui/table/table';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MenuTrigger} from '@angular/aria/menu';
import {OverlayModule} from '@angular/cdk/overlay';
import {UserService} from './core/services/user.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Button,
    Input,
    Accordion,
    UiMenu,
    Table,
    ReactiveFormsModule,
    MenuTrigger,
    OverlayModule,
    JsonPipe
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  printMenuComp = viewChild<UiMenu>('printMenuCompRef');

  numberControl = new FormControl('Авто');
  orgControl = new FormControl('ООО Торговый Дом');
  commentControl = new FormControl('');

  printMenuItems = [
    { id: 'standard', label: 'Стандартная форма' },
    { id: 'extended', label: 'Расширенная форма' },
    { id: 'short', label: 'Краткая форма' }
  ];

  onMenuAction(id: string) {
    console.log('Action:', id);
  }

  accordionItems = [
    { title: 'Основные реквизиты', content: 'Здесь расположены основные данные документа: дата, номер, организация и контрагент.' },
    { title: 'Дополнительно', content: 'Дополнительные сведения, такие как ответственный менеджер, подразделение и проект.' },
    { title: 'История изменений', content: 'Лог изменений документа пользователями системы.' }
  ];

  tableColumns = [
    { key: 'id', header: '№' },
    { key: 'name', header: 'Товар' },
    { key: 'quantity', header: 'Кол-во' },
    { key: 'price', header: 'Цена' },
    { key: 'sum', header: 'Сумма' }
  ];

  tableData = [
    { id: 1, name: 'Ноутбук Lenovo IdeaPad', quantity: 1, price: '45 000', sum: '45 000' },
    { id: 2, name: 'Мышь Logitech G102', quantity: 2, price: '2 500', sum: '5 000' },
    { id: 3, name: 'Клавиатура Keychron K2', quantity: 1, price: '12 000', sum: '12 000' },
    { id: 4, name: 'Монитор Dell P2419H', quantity: 2, price: '18 000', sum: '36 000' },
    { id: 5, name: 'Кабель HDMI 2.0', quantity: 5, price: '800', sum: '4 000' }
  ];

  private usersService = inject(UserService);
  users = this.usersService.getAll();
}
