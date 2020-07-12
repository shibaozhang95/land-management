import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  ifShowLegend: boolean

  constructor() { }

  ngOnInit() {
    this.ifShowLegend = false;
  }

  turnOnLegend() {
    console.log('Turn on legend')

    this.ifShowLegend = true;
  }

  turnOffLegend() {
    console.log('Turn off legend')

    this.ifShowLegend = false;
  }
}
