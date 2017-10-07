import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [require('./card.component.scss')]
})
export class CardComponent implements OnInit {
  @Input() card;

  constructor() {
  }

  ngOnInit() {
  }
}
