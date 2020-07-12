import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

export interface User {
  firstName: string;
  id: string;
  lastName : string
}

export interface Admin {
  _id: string,
  username: string,
  password: string,
  user_type: number
}

@Component({
  selector: 'app-accounts-add',
  templateUrl: './accounts-add.component.html',
  styleUrls: ['./accounts-add.component.css']
})


export class AccountsAddComponent implements OnInit {
  adminUsername: string;
  adminPassword: string;
  adminConfirmPassword: string;

  adminFormControl: FormGroup;

  userList : User[];
  constructor(
    private database : AccountService, 
    public snackBar: MatSnackBar) { }


  ngOnInit() {
    this.adminFormControl = new FormGroup({
      'username': new FormControl(this.adminUsername, Validators.required),
      'password': new FormControl(this.adminPassword, Validators.required),
      'confirmPassword': new FormControl(this.adminConfirmPassword, Validators.required)
    })
  }

  get username() { return this.adminFormControl.get('username'); }
  get password() { return this.adminFormControl.get('password'); }
  get confirmPassword() { return this.adminFormControl.get('confirmPassword'); }
  // addUser(){
  //   this.database.addUser({id : this.id, firstName : this.firstName, lastName : this.lastName})
  //   this.snackBar.open("successfully added","", {
  //     duration: 2000,
  //   });
    // this.ref.detectChanges();

  // }

  // addAdmin() {
  //   console.log(this.adminFormControl.value)
  //   this.database.addAdmin({id: this.adminFormControl.value.id, username: this.adminFormControl.value.username})

  //   this.snackBar.open("successfully added","", {
  //     duration: 4000,
  //   });
  // }

  addAdmin(): void {
    let admin = {
      username: this.adminFormControl.value.username,
      password: this.adminFormControl.value.password,
      user_type: 0 
      // 0 as administrator
    }

    if (this.adminFormControl.value.password != this.adminFormControl.value.confirmPassword) {
      this.openSnackBar('Twice passwrod inputs are not match!', 'Try again');
      return;
    }

    this.database.addAdmin(admin)
      .subscribe(res => {
        if (res.code == 0) {
          this.openSnackBar('Create successfully!', 'OK')
        }
        else if (res.code == -2) {
          this.openSnackBar('Username alrealy exist!', 'Change one');
        }
        else {
          this.openSnackBar('Create failed.', 'OK')
        }
      })
  }

  doubleCheckPassword(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
  
      return this.adminPassword == this.adminConfirmPassword ? {'same': {value: control.value}} : null;
    };
  } 

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
