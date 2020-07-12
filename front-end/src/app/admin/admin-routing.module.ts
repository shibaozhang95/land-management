import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { PropertiesManagementComponent } from './properties-management/properties-management.component';
import { PropertiesAddComponent } from './properties-add/properties-add.component';
import { AccountsManagementComponent } from './accounts-management/accounts-management.component';
import { AccountsAddComponent } from './accounts-add/accounts-add.component';


const routes: Routes = [
  { 
    path: 'admin', 
    component: AdminComponent,
    children: [
      { path: 'propertiesList', component: PropertiesManagementComponent},
      { path: 'addProperty', component: PropertiesAddComponent },
      { path: 'accountsList', component: AccountsManagementComponent },
      { path: 'addAccount', component: AccountsAddComponent },
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AdminRoutingModule { }
