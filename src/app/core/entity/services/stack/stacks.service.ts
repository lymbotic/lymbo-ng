import {Injectable} from '@angular/core';
import {DisplayAspect, StackDisplayService} from './stack-display.service';
import {Stack} from '../../model/stack/stack.model';
import {StackTypeGroup} from '../../model/stack/stack-type-group.enum';
import {StackType} from '../../model/stack/stack-type.enum';
import {StackTypeService} from './stack-type.service';
import {Tag} from '../../model/tag/tag.model';
import {TagsService} from '../tag/tags.service';

/**
 * Handles cards
 */
@Injectable({
  providedIn: 'root'
})
export class StacksService {

  //
  // Delegated: Display aspects
  //

  /**
   * Determines if a given stack contains a display aspect
   * @param displayAspect display aspect
   * @param stack stack
   */
  static containsDisplayAspect(displayAspect: DisplayAspect, stack: Stack): boolean {
    switch (displayAspect) {
      case DisplayAspect.CAN_BE_CREATED: {
        return StackDisplayService.canBeCreated(stack);
      }
      case DisplayAspect.CAN_BE_UPDATED: {
        return StackDisplayService.canBeUpdated(stack);
      }
      case DisplayAspect.LANGUAGE: {
        return StackDisplayService.containsLanguage(stack);
      }
    }
  }

  //
  // Import/Export
  //

  /**
   * Downloads a file containing a JSON formatted array of all entities
   */
  static downloadStack(stack: Stack) {

    const fileContents = JSON.stringify(stack);
    const filename = `${stack.title}.lymbo`;
    // const filetype = 'text/plain';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Constructor
   * @param stackDisplayService stack display service
   * @param stackTypeService stack type service
   * @param tagsService tags service
   */
  constructor(private stackDisplayService: StackDisplayService,
              private stackTypeService: StackTypeService,
              private tagsService: TagsService) {
  }

  //
  // Lookup
  //

  /**
   * Determines whether a tag is contained in a list of stacks
   * @param stacks stacks
   * @param tag tag
   */
  public tagIsContainedInStacks(stacks: Stack[], tag: Tag) {
    return this.getTagIdsByStacks(stacks).some(id => {
      return id === tag.id;
    });
  }

  /**
   * Aggregates all tag IDs of a list of given stacks
   * @param stacks stacks
   */
  private getTagIdsByStacks(stacks: Stack[]): string[] {
    const tagIds = new Map<string, string>();

    stacks.forEach(stack => {
      stack.tagIds.forEach(tagId => {
        tagIds.set(tagId, tagId);
      });
    });

    return Array.from(tagIds.values());
  }

  //
  // Delegated: stack types
  //

  /**
   * Returns a list of stack types contained in a given stack type group
   * @param group stack type group
   */
  public getStackTypesByGroup(group: StackTypeGroup): StackType[] {
    return this.stackTypeService.getStackTypesByGroup(group);
  }

  /**
   * Returns the stack type group of a given stack type
   * @param type stack type
   */
  public getStackGroupByType(type: StackType): StackTypeGroup {
    return this.stackTypeService.getStackGroupByType(type);
  }

  /**
   * Determines if a stack type group contains a given stack type
   * @param group stack type group
   * @param type stack type
   */
  public groupContainsType(group: StackTypeGroup, type: StackType) {
    return this.stackTypeService.groupContainsType(group, type);
  }

  /**
   * Retrieves an icon by stack type
   * @param group stack type group
   */
  public getIconByStackTypeGroup(group: StackTypeGroup): string {
    return this.stackTypeService.getIconByStackTypeGroup(group);
  }

  /**
   * Retrieves an icon by stack type
   * @param type stack type
   */
  public getIconByStackType(type: StackType): string {
    return this.stackTypeService.getIconByStackType(type);
  }
}
