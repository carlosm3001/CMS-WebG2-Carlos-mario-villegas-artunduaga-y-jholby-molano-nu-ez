import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasPage } from './noticias-page';

describe('NoticiasPage', () => {
  let component: NoticiasPage;
  let fixture: ComponentFixture<NoticiasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
