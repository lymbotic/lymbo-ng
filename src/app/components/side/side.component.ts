import {Component, Input, OnInit} from '@angular/core';
import {Side} from '../../model/side.model';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styles: [require('./side.component.scss')],
})
export class SideComponent implements OnInit {
  @Input() side: Side;

  constructor() {
  }

  ngOnInit() {
  }

}
