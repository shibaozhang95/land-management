import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SignUpService } from '../sign-up.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  username : String;
  password : String;
  confirmPassword : String;
  signUpFormControl: FormGroup;
  userType : String;

  constructor(
    private database : SignUpService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.signUpFormControl = new FormGroup({
      'form_username': new FormControl(this.username, Validators.required),
      'form_password': new FormControl(this.password, Validators.required),
      'form_confirmPassword': new FormControl(this.confirmPassword, Validators.required),
      // 'form_usertype': new FormControl(this.userType, Validators.required)
    })
  }

  get form_username() { return this.signUpFormControl.get('form_username'); }
  get form_password() { return this.signUpFormControl.get('form_password'); }
  get form_confirmPassword() { return this.signUpFormControl.get('form_confirmPassword'); }
  // get form_userType() { return this.signUpFormControl.get('form_usertype'); }

  addUser(): void {
    let user = {
      username: this.signUpFormControl.value.form_username,
      password: this.signUpFormControl.value.form_password,
      user_type: 1
      // 0 as administrator
    }

    if (this.signUpFormControl.value.form_password != this.signUpFormControl.value.form_confirmPassword) {
      this.openSnackBar('Twice passwrod inputs are not match!', 'Try again');
      return;
    }
    console.log(user);
    this.database.addUser(user)
      .subscribe(res => {
        if (res.code == 0) {
          // this.openSnackBar('Create successfully!', 'OK')
          this.openDialog();
        }
        else if (res.code == -2) {
          this.openSnackBar('Username alrealy exist!', 'Change one');
        }
        else {
          this.openSnackBar('Register failed.', 'OK')
        }

      })
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { relativeTo: this.route })
  }

  goToMap(): void {
    this.router.navigate(['/main'], { relativeTo: this.route })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignUpDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.router.navigate(['/login'], { relativeTo: this.route })
      }
    })
  }

}

@Component({
  selector: 'sign-up-dialog',
  templateUrl: 'sign-up-dialog.html',
})
export class SignUpDialog {}
