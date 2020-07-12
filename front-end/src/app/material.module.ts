import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SignUpDialog } from './sign-up/sign-up.component';
import { 
  MatButtonModule, 
  MatIconModule, 
  MatListModule, 
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatTabsModule,
  MatExpansionModule,
  MatInputModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatToolbarModule
} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';

const modules = [
  MatButtonModule, 
  MatIconModule, 
  MatListModule, 
  MatGridListModule,
  MatCardModule,
  FormsModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatMenuModule,
  MatTabsModule,
  MatExpansionModule,
  MatInputModule,
  MatRadioModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatToolbarModule
]
@NgModule({
  imports: [...modules],
  exports: [...modules],

  declarations: [
    SignUpDialog
  ],
  entryComponents: [ SignUpDialog ]
})

export class MaterialModule { }