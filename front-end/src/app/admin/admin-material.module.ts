import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { 
  MatButtonModule, 
  MatTreeModule, 
  MatSidenavModule, 
  MatIconModule, 
  MatListModule, 
  MatDividerModule,
  MatTableModule,
  MatPaginatorModule,
  MatInputModule,
  MatCardModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';


const modules = [
  MatButtonModule,
  MatSidenavModule,
  MatTreeModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatTableModule,
  MatPaginatorModule,
  FormsModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatInputModule,
  MatCardModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatTooltipModule
]
@NgModule({
  imports: [...modules],
  exports: [...modules] 
})

export class MaterialModule { }