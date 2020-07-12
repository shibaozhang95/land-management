import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsAddComponent } from './accounts-add.component';

describe('AccountsAddComponent', () => {
  let component: AccountsAddComponent;
  let fixture: ComponentFixture<AccountsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
