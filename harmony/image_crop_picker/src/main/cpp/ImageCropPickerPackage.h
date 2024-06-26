#ifndef IMAGECROPPICKERPACKAGE_H
#define IMAGECROPPICKERPACKAGE_H

#include "RNOH/Package.h"
#include "ImageCropPickerTurboModule.h"

using namespace rnoh;
using namespace facebook;

class NativeRNCImageCropPickerTurboModuleFactoryDelegate : public TurboModuleFactoryDelegate {
    public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
        if (name == "ImageCropPicker") {
            return std::make_shared<ImageCropPickerTurboModule>(ctx, name);
        }
        return nullptr;
    };
};

namespace rnoh {
    class ImageCropPickerPackage : public Package {
        public :
        ImageCropPickerPackage(Package::Context ctx) : Package(ctx){};
        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override {
        return std::make_unique<NativeRNCImageCropPickerTurboModuleFactoryDelegate>();
        };
	};
}
#endif