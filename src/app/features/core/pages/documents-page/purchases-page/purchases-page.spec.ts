import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesPage } from './purchases-page';

describe('PurchasesPage', () => {
  let component: PurchasesPage;
  let fixture: ComponentFixture<PurchasesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchasesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
