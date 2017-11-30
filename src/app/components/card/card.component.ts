import {Component, Input, OnInit} from '@angular/core';
import {MatIconRegistry, MdDialog} from '@angular/material';
import {Side} from '../../model/side.model';
import {DomSanitizer} from '@angular/platform-browser';
import {SnackbarService} from '../../services/snackbar.service';
import {CardsService} from '../../services/cards.service';
import {CardDialogComponent} from '../card-dialog/card-dialog.component';
import {Card} from '../../model/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [require('./card.component.scss')],
})
export class CardComponent implements OnInit {
  @Input() card;
  activeSideIndex = 0;
  activeSide: Side;

  constructor(private cardsService: CardsService,
              private snackbarService: SnackbarService,
              public dialog: MdDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('more', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_black_18px.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_black_18px.svg'));
  }

  ngOnInit() {
    this.activeSide = this.card.sides[this.activeSideIndex];
  }

  public updateCard() {
    let dialogRef = this.dialog.open(CardDialogComponent, {disableClose: true, data: {card: this.card}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.cardsService.updateCard(result as Card);
        this.snackbarService.showSnackbar('Updated card', '');
      }
    });
  }

  public flipCard() {
    this.activeSideIndex++;
    if (this.activeSideIndex >= this.card.sides.length) {
      this.activeSideIndex = 0;
    }

    this.activeSide = this.card.sides[this.activeSideIndex];
  }
}
