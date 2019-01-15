import {Injectable} from '@angular/core';
import {MaterialColorService} from './material-color.service';
import {HueType} from '../model/hue-type.enum';
import {PaletteType} from '../model/palette-type.enum';
import {Hue} from '../model/hue.model';
import {Stack} from '../../entity/model/stack.model';
import {Hash} from '../../entity/model/hash';
import {FeatureType} from '../../settings/model/feature-type.enum';
import {StackTypeGroup} from '../../entity/model/stack-type-group.enum';
import {CardTypeGroup} from '../../entity/model/card/card-type-group.enum';

/**
 * Handles derived colors
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  /** Array of available stack colors */
  stackHues = [
    this.materialColorService.hue(PaletteType.RED, HueType._500),
    this.materialColorService.hue(PaletteType.PINK, HueType._500),
    this.materialColorService.hue(PaletteType.PURPLE, HueType._500),
    this.materialColorService.hue(PaletteType.DEEP_PURPLE, HueType._500),
    this.materialColorService.hue(PaletteType.INDIGO, HueType._500),
    this.materialColorService.hue(PaletteType.BLUE, HueType._500),
    this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._500),
    this.materialColorService.hue(PaletteType.CYAN, HueType._500),
    this.materialColorService.hue(PaletteType.TEAL, HueType._500),
    this.materialColorService.hue(PaletteType.GREEN, HueType._500),
    this.materialColorService.hue(PaletteType.LIGHT_GREEN, HueType._500),
    this.materialColorService.hue(PaletteType.LIME, HueType._500),
    this.materialColorService.hue(PaletteType.YELLOW, HueType._500),
    this.materialColorService.hue(PaletteType.AMBER, HueType._500),
    this.materialColorService.hue(PaletteType.ORANGE, HueType._500),
    this.materialColorService.hue(PaletteType.DEEP_ORANGE, HueType._500),
  ];

  /**
   * Constructor
   * @param materialColorService material personColor service
   */
  constructor(private materialColorService: MaterialColorService) {
  }

  /**
   * Determines a stack's color
   * @param {Stack} stack stack to get color for
   * @returns {string} color string derived from stack name
   */
  getStackColor(stack: Stack) {
    const hue = this.getStackHue(stack);

    return (hue != null) ? hue.color : 'transparent';
  }

  /**
   * Determines a stack's contrast
   * @param {Stack} stack stack to get color for
   * @returns {string} contrast color string derived from stack name
   */
  getStackContrast(stack: Stack) {
    const hue = this.getStackHue(stack);

    return (hue != null) ? hue.contrast : 'transparent';
  }

  /**
   * Returns a hue picked by a hash value generated from a stack's name
   * @param stack stack
   */
  private getStackHue(stack: Stack): Hue {
    if (stack == null || stack.title == null || stack.title.trim().length <= 0) {
      return null;
    }

    return this.stackHues[
    Math.abs(Hash.hash(stack.title.toLowerCase().replace(' ', ''))) % this.stackHues.length];
  }

  /**
   * Returns a color associated to a feature
   * @param feature feature
   */
  getFeatureTypeColor(feature: FeatureType): Hue {
    switch (feature) {
      case FeatureType.UNDEFINED: {
        return this.materialColorService.hue(PaletteType.GREEN, HueType._700);
      }
      default: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._300);
      }
    }
  }

  /**
   * Returns a color associated to stack type group
   * @param {StackTypeGroup} group stack type group
   */
  getStackTypeGroupColor(group: StackTypeGroup): Hue {
    switch (group) {
      case StackTypeGroup.UNSPECIFIED: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._50);
      }
      case StackTypeGroup.FREESTYLE: {
        return this.materialColorService.hue(PaletteType.LIME, HueType._600);
      }
      case StackTypeGroup.LANGUAGE: {
        return this.materialColorService.hue(PaletteType.AMBER, HueType._600);
      }
      default: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._300);
      }
    }
  }

  /**
   * Returns a color associated to card type group
   * @param {CardTypeGroup} group card type group
   */
  getCardTypeGroupColor(group: CardTypeGroup): Hue {
    switch (group) {
      case CardTypeGroup.UNSPECIFIED: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._50);
      }
      case CardTypeGroup.FREESTYLE: {
        return this.materialColorService.hue(PaletteType.LIME, HueType._600);
      }
      case CardTypeGroup.VOCABULARY: {
        return this.materialColorService.hue(PaletteType.AMBER, HueType._600);
      }
      case CardTypeGroup.QUIZ: {
        return this.materialColorService.hue(PaletteType.LIGHT_BLUE, HueType._600);
      }
      default: {
        return this.materialColorService.hue(PaletteType.GREY, HueType._300);
      }
    }
  }
}
