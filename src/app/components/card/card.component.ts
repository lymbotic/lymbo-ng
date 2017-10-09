import {Component, Input, OnInit} from '@angular/core';
import {Side} from '../../model/side.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [require('./card.component.scss')],
})
export class CardComponent implements OnInit {
  @Input() card;
  activeSideIndex = 0;
  activeSide: Side;

  constructor() {
  }

  ngOnInit() {
    this.activeSide = this.card.sides[this.activeSideIndex];
  }

  public  flipCard() {
    this.activeSideIndex++;
    if (this.activeSideIndex >= this.card.sides.length) {
      this.activeSideIndex = 0;
    }

    this.activeSide = this.card.sides[this.activeSideIndex];
  }
}
