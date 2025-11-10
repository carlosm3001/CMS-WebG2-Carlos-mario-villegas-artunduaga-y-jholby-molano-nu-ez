import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponen } from './footer-componen';

describe('FooterComponen', () => {
  let component: FooterComponen;
  let fixture: ComponentFixture<FooterComponen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
