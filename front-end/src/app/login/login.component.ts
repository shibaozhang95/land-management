import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../user.service'
import { MatSnackBar } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username : String;
  password : String;
  loginFormControl : FormGroup;

  constructor(
    private userService: UserService,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loginFormControl = new FormGroup({
      'form_username': new FormControl(this.username, Validators.required),
      'form_password': new FormControl(this.password, Validators.required),
    
    })
  }

  get form_username() { return this.loginFormControl.get('form_username'); }
  get form_password() { return this.loginFormControl.get('form_password'); }

  login(): void {
    let user = {
      username: this.loginFormControl.value.form_username,
      password: this.loginFormControl.value.form_password,
      // 0 as administrator
    }

    this.userService.login(user)
    .subscribe(res => {
      if (res.code == 0) {
        this.openSnackBar('Login successfully!', 'OK');
        setTimeout(() => {
          this.router.navigate(['/main'], { relativeTo: this.route })
        }, 1000)
      }
      else {
        this.openSnackBar('Login failed.', 'OK');
      }
    })

  }

  goToRegister(): void {
    this.router.navigate(['/sign-up'], { relativeTo: this.route })
  }

  goToMap(): void {
    this.router.navigate(['/main'], { relativeTo: this.route })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
