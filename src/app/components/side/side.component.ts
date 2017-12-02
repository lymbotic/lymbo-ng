import {Component, Input, OnInit} from '@angular/core';
import {Side} from '../../model/side.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {CardsService} from '../../services/cards.service';
import {Card} from '../../model/card.model';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styles: [require('./side.component.scss')],
})
export class SideComponent implements OnInit {
  @Input() card: Card;
  @Input() sideIndex: number;
  @Input() side: Side;

  constructor(private cardsService: CardsService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_check_black_24px.svg'));
  }

  ngOnInit() {
  }

  checkCard() {
    this.cardsService.checkCard(this.card);
  }

}
