import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './app-routing.module';

import { AdminModule } from './admin/admin.module';
import { SideBarUserComponent } from './side-bar-user/side-bar-user.component';
import { SideBarFunctionComponent } from './side-bar-function/side-bar-function.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';

import { RouterModule } from '@angular/router';
import { LegendComponent } from './legend/legend.component';
import { HelpComponent } from './help/help.component'

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
 
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    SearchBoxComponent,
    SideBarComponent,
    MainComponent,
    SideBarUserComponent,
    SideBarFunctionComponent,
    SignUpComponent,
    LoginComponent,
    LegendComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,

    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,

    ReactiveFormsModule,
    
    AdminModule,
    MatFormFieldModule,

    SwiperModule
  ],
  providers: [{
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
