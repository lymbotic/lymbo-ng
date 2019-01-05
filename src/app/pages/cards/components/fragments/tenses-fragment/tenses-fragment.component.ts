import {Component, Input, OnInit} from '@angular/core';
import {TenseGroup} from '../../../../../core/entity/model/language/tense-group';
import {Tense} from '../../../../../core/entity/model/language/tense.enum';
import {GrammaticalPerson} from '../../../../../core/entity/model/language/grammatical-person.enum';
import {Form} from '../../../../../core/entity/model/language/form.model';

/**
 * Displays tenses
 */
@Component({
  selector: 'app-tenses-fragment',
  templateUrl: './tenses-fragment.component.html',
  styleUrls: ['./tenses-fragment.component.scss']
})
export class TensesFragmentComponent implements OnInit {

  /** Tense group */
  @Input() tenseGroups: TenseGroup[];
  /** Readonly */
  @Input() readonly = false;

  /** Available tenses */
  tenses = Object.keys(Tense).map(key => Tense[key]);
  /** Filtered tenses */
  tensesFiltered = [];

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTenses();
  }

  //
  // Actions
  //

  /**
   * Handles tense group change
   * @param tenseGroup tense group
   */
  onTenseGroupChanged(tenseGroup: TenseGroup) {
    this.tenseGroups.forEach(tg => {
      if (tg.tense === tenseGroup.tense) {
        tg.forms = tenseGroup.forms;
      }
    });
  }

  /**
   * Handles tense deletion
   * @param tense tense
   */
  onTenseDeleted(tense: Tense) {
    this.tenseGroups = this.tenseGroups.filter(tenseGroup => {
      return tenseGroup.tense !== tense;
    });
  }

  /**
   * Handles tense clear
   * @param tense tense
   */
  onTenseCleared(tense: Tense) {
    this.tenseGroups.forEach(tenseGroup => {
      if (tenseGroup.tense === tense) {
        tenseGroup.forms.forEach(form => {
          form.value = '';
        });
      }
    });
  }

  /**
   * Handles selection of a tense
   */
  onTenseSelected(tense: Tense) {
    switch (tense) {
      case Tense.PRESENT_TENSE: {
        this.initializeTenseGroupWithPersons(tense);
        break;
      }
      case Tense.INDEFINIDO: {
        this.initializeTenseGroupWithPersons(tense);
        break;
      }
      case Tense.IMPERFECT: {
        this.initializeTenseGroupWithPersons(tense);
        break;
      }
      case Tense.FUTURE: {
        this.initializeTenseGroupWithPersons(tense);
        break;
      }
      case Tense.CONDITIONAL: {
        this.initializeTenseGroupWithPersons(tense);
        break;
      }
      case Tense.IMPERATIVE: {
        this.initializeTenseGroupWithSingularPlural(tense);
        break;
      }
      case Tense.PAST_PARTICIPLE: {
        this.initializeTenseGroupWithSingularPlural(tense);
        break;
      }
      case Tense.PRESENT_PARTICIPLE: {
        this.initializeTenseGroupWithSingularPlural(tense);
        break;
      }
      case Tense.UNDEFINED: {
        break;
      }
    }

    this.initializeTenses();
  }

  //
  // Helpers
  //

  /**
   * Initializes new tense with persons
   * @param tense tense
   */
  private initializeTenseGroupWithPersons(tense: Tense) {
    const tenseGroup = new TenseGroup();

    tenseGroup.tense = tense;
    tenseGroup.forms.push(new Form(GrammaticalPerson.FIRST_PERSON_SINGULAR, ''));
    tenseGroup.forms.push(new Form(GrammaticalPerson.SECOND_PERSON_SINGULAR, ''));
    tenseGroup.forms.push(new Form(GrammaticalPerson.THIRD_PERSON_SINGULAR, ''));
    tenseGroup.forms.push(new Form(GrammaticalPerson.FIRST_PERSON_PLURAL, ''));
    tenseGroup.forms.push(new Form(GrammaticalPerson.SECOND_PERSON_PLURAL, ''));
    tenseGroup.forms.push(new Form(GrammaticalPerson.THIRD_PERSON_PLURAL, ''));

    this.tenseGroups.push(tenseGroup);
  }

  /**
   * Initializes new tense with only singular and plural
   * @param tense tense
   */
  private initializeTenseGroupWithSingularPlural(tense: Tense) {
    const tenseGroup = new TenseGroup();

    tenseGroup.tense = tense;
    tenseGroup.forms.push(new Form(GrammaticalPerson.SINGULAR, ''));
    tenseGroup.forms.push(new Form(GrammaticalPerson.PLURAL, ''));

    this.tenseGroups.push(tenseGroup);
  }

  /**
   * Initializes available tenses
   */
  private initializeTenses() {
    this.tensesFiltered = this.tenses.filter(tense => {
      return tense !== Tense.UNDEFINED && !this.tenseGroups.some(tenseGroup => {
        return tenseGroup.tense === tense;
      });
    });
  }
}
