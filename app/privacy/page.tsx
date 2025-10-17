import React from 'react'
import AnimationContainer from "../../components/global/animation-container";
import MaxWidthWrapper from "../../components/global/max-width-wrapper";

const PrivacyPage = () => {
    return (
        <MaxWidthWrapper>
            <div className="flex flex-col items-center justify-center py-20">
                <AnimationContainer delay={0.1}>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-base md:text-lg mt-6 text-center text-muted-foreground max-w-2xl">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                    </p>
                </AnimationContainer>
            </div>
        </MaxWidthWrapper>
    )
};

export default PrivacyPage