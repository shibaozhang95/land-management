import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarFunctionComponent } from './side-bar-function.component';

describe('SideBarFunctionComponent', () => {
  let component: SideBarFunctionComponent;
  let fixture: ComponentFixture<SideBarFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
