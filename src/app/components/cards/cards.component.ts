import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Stack} from '../../model/stack.model';
import {SnackbarService} from '../../services/snackbar.service';
import {StacksService} from '../../services/stacks.service';

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
              private snackbarService: SnackbarService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.stackId = +params['id'];
    });
    this.stack = this.route.snapshot.data['stack'];
    this.title = this.stack != null ? `Lymbo | ${this.stack.title}` : `Lymbo`;

    console.log(`stack: ${this.stacksService.stacks[this.stackId].title}`);
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
      default: {
        break;
      }
    }
  }

}
