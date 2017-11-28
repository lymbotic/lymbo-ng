import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../services/snackbar.service';
import {MatIconRegistry, MdDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CardAddDialogComponent} from '../card-add-dialog/card-add-dialog.component';
import {Card} from '../../model/card.model';
import {CardsService} from '../../services/cards.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [require('./cards.component.scss')]
})
export class CardsComponent implements OnInit {
  title = 'Lymbo';
  cards: Card[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cardsService: CardsService,
              private snackbarService: SnackbarService,
              public dialog: MdDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }

  ngOnInit() {
    let stack = this.route.snapshot.data['stack'];

    this.title = stack != null ? `Lymbo | ${stack.title}` : `Lymbo`;

    this.cardsService.cardsSubject.subscribe((value) => {
      if (value != null) {
        this.cards.push(value as Card);
      } else {
        this.cards = [];
      }
    });
    this.cardsService.publish(stack);
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'settings': {
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      case 'back': {
        this.router.navigate(['/stacks']);
        break;
      }
      case 'add': {
        let dialogRef = this.dialog.open(CardAddDialogComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.cardsService.addCard(result as Card);
            this.snackbarService.showSnackbar('Added card', '');
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

}
