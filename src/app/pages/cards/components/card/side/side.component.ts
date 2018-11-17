import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../../../core/entity/model/card.model';
import {Side} from '../../../../../core/entity/model/side.model';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styles: [require('./side.component.scss')],
})
export class SideComponent implements OnInit {

  @Input() card: Card = new Card();
  @Input() sideIndex: number;
  @Input() side: Side = new Side();

  @Output() onCardClickedEmitter = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Handles click on the card
   * @param value
   */
  onCardClicked(value: string) {
    this.onCardClickedEmitter.next(value);
  }
}
