import { Component } from '@angular/core';
import { UserService } from './user.service'
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
// import { MapsComponent } from './maps/maps.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [ MapsComponent ]
})
export class AppComponent {
  constructor (
    public userService: UserService,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('app has been loaded');
    this.userService.getUserInfoLocally()
    .then(data => {
      if (data.code == 0) {
        console.log('Log in successfully')
      }
      else {
        this.router.navigate(['/login'], { relativeTo: this.route })
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  
}
