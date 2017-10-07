import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StacksService} from '../../services/stacks.service';
import {Card} from '../../model/card.model';
import {Stack} from '../../model/stack.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [require('./cards.component.scss')]
})
export class CardsComponent implements OnInit {
  stackId: number;
  cards: Card[] = [];

  constructor(private route: ActivatedRoute, private stacksService: StacksService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.stackId = +params['id'];
    });

    this.cards = this.stacksService.getStack(this.stackId).cards;
  }

}
