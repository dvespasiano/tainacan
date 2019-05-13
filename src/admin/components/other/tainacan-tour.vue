<template>
    <v-tour
            :name="name"
            :steps="steps">
        <template slot-scope="tour">
            <div
                    v-if="tour.currentStep >= 0"
                    class="tainacan-tour-background"/>
            <transition name="fade">
                <v-step
                        v-if="tour.currentStep === index"
                        v-for="(step, index) of tour.steps"
                        :key="index"
                        :step="step"
                        :previous-step="tour.previousStep"
                        :next-step="tour.nextStep"
                        :stop="tour.stop"
                        :is-first="tour.isFirst"
                        :is-last="tour.isLast"
                        :labels="tour.labels">
                    <div 
                            class="step-content"
                            slot="content">
                        <button
                                @click="tour.stop"
                                class="icon close-button has-text-blue5">
                            <i class="tainacan-icon tainacan-icon-close tainacan-icon-18px" />
                        </button>
                        <div
                                v-if="tour.steps[tour.currentStep].content.icon"
                                class="step-content-aside icon">
                            <i :class="'tainacan-icon tainacan-icon-' + tour.steps[tour.currentStep].content.icon" />
                        </div>
                        <div class="step-content-main">
                            <h1>{{ tour.steps[tour.currentStep].content.title }}</h1>
                            <p v-html="tour.steps[tour.currentStep].content.description" />
                        </div>
                    </div>
                    <div
                            class="step-footer"
                            slot="actions">
                        <button 
                                v-if="tour.currentStep > 0"
                                @click="tour.previousStep"
                                class="button sequence-button">
                            <span class="icon is-large">
                                <i class="tainacan-icon tainacan-icon-20px tainacan-icon-previous"/>
                            </span>
                            <span>{{ $i18n.get('previous') }}</span>
                        </button>
                        <div class="step-slider">
                            <div
                                v-for="stepDot in tour.steps.length"
                                :key="stepDot"
                                class="step-slider-dot"
                                :class="{ 'active': stepDot == tour.currentStep + 1}"/>
                        </div>
                        <button 
                                v-if="tour.currentStep < tour.steps.length - 1"
                                @click="tour.nextStep"
                                class="button sequence-button">
                            <span>{{ $i18n.get('next') }}</span>
                            <span class="icon is-large">
                                <i class="tainacan-icon tainacan-icon-20px tainacan-icon-next"/>
                            </span>
                        </button>
                        <button 
                                v-if="tour.currentStep == tour.steps.length - 1"
                                @click="tour.stop"
                                class="button sequence-button">
                            <span>{{ $i18n.get('finish') }}</span>
                            <span class="icon is-large">
                                <i class="tainacan-icon tainacan-icon-20px tainacan-icon-approved"/>
                            </span>
                        </button>
                    </div>
                    <div class="step-arrow"/>
                </v-step>
            </transition>
        </template>
    </v-tour>
</template>

<script>
    export default {
        name: 'TainacanTour',
        props: {
            name: String,
            steps: Array
        },
    }
</script>

<style lang="scss" >
    
    @import '../../scss/_variables.scss';

    .v-tour {
        .tainacan-tour-background {
            background-color: rgba(0,0,0,0.4);
            width: 100%;
            height: 100%;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            position: fixed;
            z-index: 999;
        }
        .v-step {
            background: white;
            border-radius: 5px;
            padding: 1.25rem;
            border: 1px solid $gray2;
            z-index: 99999999999;
            max-width: 468px;

            @media screen and (max-width: 498px) {
                max-width: 94%;
                max-width: 94vw;
            }

            .step-content {
                display: flex;
                margin: 0 0.5rem 0.75rem 0.5rem;

                .close-button {
                    border: none;
                    border-radius: 2rem;
                    position: absolute;
                    right: 0;
                    top: 0;
                    padding: 1.125rem 1.5rem;
                    cursor: pointer
                }

                .step-content-aside {
                    margin: 0.5rem 1.5rem 0.5rem 0.5rem;
                    background-color: $gray1;
                    color: $blue5;
                    text-align: center;
                    float: left;
                    height: 80px;
                    width: 80px;
                    flex-shrink: 0;
                    border-radius: 80px;

                    .tainacan-icon::before {
                        font-size: 42px;
                    }
                }
            }
            h1 {
                font-size: 1.5rem;
                color: $gray4;
                margin-bottom: 0.5rem;
            }
            p {
                font-size: 0.875rem;
                color: $gray5;
            } 

            .step-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .step-slider {
                    margin: 0 0.75rem;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-evenly;
                    align-items: center;

                    .step-slider-dot {
                        height: 10px;
                        width: 10px;
                        border-radius: 24px;
                        background-color: $gray2;
                        margin: 0 3px;

                        &.active {
                            background-color: $gray4;
                        }
                    }
                }
                .sequence-button {
                    background-color: transparent;
                    color: $turquoise5;
                    border: none;
                    padding: 2px 0.5rem !important;
                    margin: 0;
                }
            }

            .v-step__arrow {
                border-color: white;
                border-style: solid;
                height: 0;
                margin: .5rem;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                position: absolute;
                width: 0;
            }
            &[x-placement^="bottom"] {
                margin-top: 0.5rem;
            }
            &[x-placement^="bottom"] .v-step__arrow {
                border-width: 0 .5rem .5rem;
                border-left-color: transparent;
                border-right-color: transparent;
                border-top-color: transparent;
                left: calc(50% - 1rem);
                margin-bottom: 0;
                margin-top: 0;
                top: -0.5rem;
            }
            &[x-placement^="top"] {
                margin-bottom: 0.5rem;
            }
            &[x-placement^="top"] .v-step__arrow {
                border-width: 0.5rem 0.5rem 0 0.5rem;
                border-left-color: transparent;
                border-right-color: transparent;
                border-bottom-color: transparent;
                left: calc(50% - 1rem);
                margin-bottom: 0;
                margin-top: 0;
                bottom: -0.5rem;
            }
            &[x-placement^="right"] {
                margin-left: 0.5rem;
            }
            &[x-placement^="right"] .v-step__arrow {
                border-width: 0.5rem 0.5rem 0.5rem 0;
                border-left-color: transparent;
                border-top-color: transparent;
                border-bottom-color: transparent;
                left: -0.5rem;
                top: calc(50% - 1rem);
                margin-left: 0;
                margin-right: 0;
            }
            &[x-placement^="left"] {
                margin-right: 0.5rem;
            }
            &[x-placement^="left"] .v-step__arrow {
                border-width: 0.5rem 0 0.5rem 0.5rem;
                border-top-color: transparent;
                border-right-color: transparent;
                border-bottom-color: transparent;
                right: -0.5rem;
                top: calc(50% - 1rem);
                margin-left: 0;
                margin-right: 0;
            }
        }
    }
</style>
