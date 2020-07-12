import { Component, OnInit } from '@angular/core';
// import { Swiper } from 'swiper'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  ifShowInstructions: boolean
  configForSwiper: any 

  constructor() { }

  ngOnInit() {
    this.ifShowInstructions = false

    this.configForSwiper = {
      // Optional parameters
      // direction: 'vertical',
      loop: true,
  
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },
  
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
  
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      }
    }
  }

  turnOnInstructions() {
    this.ifShowInstructions = true;
  }
  turnOffInstructions() {
    this.ifShowInstructions = false;
  }

  prevOne() {
    console.log('previous')
  }

  nextOne() {
    console.log('next')
  }

}
