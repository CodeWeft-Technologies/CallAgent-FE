import React from 'react'
import AnimationContainer from "../../components/global/animation-container";

const EnterprisePage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AnimationContainer delay={0.1}>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    Enterprise Solutions
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground max-w-2xl">
                    Scale your outbound sales with enterprise-grade AI voice automation. 
                    Get dedicated support, custom integrations, and white-label solutions.
                </p>
            </AnimationContainer>
        </div>
    )
};

export default EnterprisePage