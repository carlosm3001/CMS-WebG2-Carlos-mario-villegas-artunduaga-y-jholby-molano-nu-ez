import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponen } from './navbar-componen';

describe('NavbarComponen', () => {
  let component: NavbarComponen;
  let fixture: ComponentFixture<NavbarComponen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
