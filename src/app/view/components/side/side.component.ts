import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Side} from '../../../model/side.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {CardsService} from '../../../services/cards.service';
import {Card} from '../../../model/card.model';

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

  constructor(private cardsService: CardsService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_undo_black_24px.svg'));
    iconRegistry.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_check_black_24px.svg'));
    iconRegistry.addSvgIcon('more_black', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_18px.svg'));
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
