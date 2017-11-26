import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Stack} from '../../model/stack.model';
import {SnackbarService} from '../../services/snackbar.service';
import {StacksService} from '../../services/stacks.service';
import {MatIconRegistry, MdDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CardAddDialogComponent} from '../card-add-dialog/card-add-dialog.component';
import {Card} from '../../model/card.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [require('./cards.component.scss')]
})
export class CardsComponent implements OnInit {
  title = 'Lymbo';
  stackId: number;
  stack: Stack;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MdDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.stackId = +params['id'];
    });
    this.stack = this.route.snapshot.data['stack'];
    this.title = this.stack != null ? `Lymbo | ${this.stack.title}` : `Lymbo`;
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
            this.stack.cards.push(result as Card);
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
