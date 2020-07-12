import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SideBarComponent } from '../side-bar/side-bar.component'
import { Property } from '../property'
import { PropertyService } from '../property.service'
import { MapsComponent } from '../maps/maps.component'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  
  animations: [
    trigger('sideBarA', [
      state('inactive', style({ transform: 'translateX(-100%)' })),
      state('active', style({ transform: 'translateX(0)' })),

      transition('inactive => active', [
        animate(300)
      ]),
      transition('active => inactive', [
        animate(300)
      ]),

    ])
  ],
})

export class MainComponent implements OnInit {
  @ViewChild(MapsComponent) myMap: MapsComponent
  @Input() sideBarComponent: SideBarComponent;
  state$: Observable<string>
  currentProperty: Property

  constructor(
    private ref: ChangeDetectorRef, 
    private propertyService: PropertyService) { }

  ngOnInit() {
    this.state$ = this.changeSideBarState('active')
    // this.sideBarComponent = new SideBarComponent();
  }

  triggerOnDetail(event: any)  {
    this.state$ = this.changeSideBarState('active')

    this.propertyService.changeCurrentNativeTitle(event.property)

    this.ref.detectChanges();
  }

  toggleSideBar(event) {
    this.state$ = this.changeSideBarState(event.state)

    this.ref.detectChanges();
  }

  changeSideBarState(state: string): Observable<string> {
    return of(state)
  }

  moveToNativeTitle(coordinate: number[][]): void {
    this.myMap.moveToNativeTitle(this.myMap.map,
      this.myMap.marker, coordinate)
  }

  moveToRegion(coordinate: any): void {
    this.myMap.moveToRegion(coordinate)
  }
}
