#pragma once
#include "RNOH/ArkTSTurboModule.h"

namespace rnoh {

class JSI_EXPORT RNImageCropPickerTurboModule : public ArkTSTurboModule {
    public:
        RNImageCropPickerTurboModule(const ArkTSTurboModule::Context ctx, const std::string name);
};

}