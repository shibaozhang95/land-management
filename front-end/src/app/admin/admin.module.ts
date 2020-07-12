
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './admin-material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { PropertiesManagementComponent } from './properties-management/properties-management.component';
import { PropertiesAddComponent } from './properties-add/properties-add.component';
import { AccountsManagementComponent } from './accounts-management/accounts-management.component';
import { AccountsAddComponent } from './accounts-add/accounts-add.component';

import { ReactiveFormsModule } from '@angular/forms';
import { PropertiesEditComponent } from './properties-edit/properties-edit.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
@NgModule({
  imports: [

    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    AdminRoutingModule,

    ReactiveFormsModule
  ],
  
  declarations: [AdminComponent, PropertiesManagementComponent, PropertiesAddComponent, AccountsManagementComponent, AccountsAddComponent, PropertiesEditComponent, AccountEditComponent]
})
export class AdminModule { }
