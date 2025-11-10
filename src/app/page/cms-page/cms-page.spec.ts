import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPage } from './cms-page';

describe('CmsPage', () => {
  let component: CmsPage;
  let fixture: ComponentFixture<CmsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
