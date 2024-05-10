import { RNPackage, TurboModulesFactory } from 'rnoh/ts';
import type { TurboModule, TurboModuleContext } from 'rnoh/ts';
import { ImageCropPickerTurboModule } from './ImageCropPickerTurboModule';

class ImageCropPickerTurboModulesFactory extends TurboModulesFactory {

  createTurboModule(name: string): TurboModule | null {
    if (name === 'ImageCropPicker') {
      return new ImageCropPickerTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === 'ImageCropPicker';
  }

}

export class ImageCropPickerPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new ImageCropPickerTurboModulesFactory(ctx);
  }
}