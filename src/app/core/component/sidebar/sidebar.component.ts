import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    menuItems = [
        { label: 'Users', link: '/users' },
        { label: 'Stores', link: '/stores' },
        { label: 'Cashboxes', link: '/cashboxes' },
        { label: 'Categories', link: '/categories' },
        { label: 'Products', link: '/products' },
        { label: 'Vendors', link: '/vendors' },
        { label: 'Clients', link: '/clients' },
        { label: 'Price Types', link: '/price-types' },
        { label: 'Prices', link: '/prices' },
        { label: 'Barcodes', link: '/barcodes' },
    ];
}
