#pragma once
#include "RNOH/Package.h"
#include "RNImageCropPickerTurboModule.h"

using namespace rnoh;
using namespace facebook;
class RNImageCropPickerFactoryDelegate : public TurboModuleFactoryDelegate {
public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override
    {
        if (name == "ImageCropPicker") {
            return std::make_shared<RNImageCropPickerTurboModule>(ctx, name);
        }
        return nullptr;
    };
};
namespace rnoh {
    class RNImageCropPickerPackage : public Package {
    public:
        RNImageCropPickerPackage(Package::Context ctx) : Package(ctx) {}
        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override
        {
            return std::make_unique<RNImageCropPickerFactoryDelegate>();
        }
    };
}