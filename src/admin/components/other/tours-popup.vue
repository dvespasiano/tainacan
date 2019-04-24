<template>
<div>
    <div 
            @click="$emit('closeToursPopup')"
            class="tours-popup-backdrop" />
    <div class="tours-popup">
        <div class="popup-header">
            <span class="header-title">{{ $i18n.get('label_interface_tours') }}</span> 
            <a @click="$emit('closeToursPopup')">
                <span class="icon has-text-blue5">
                    <i class="tainacan-icon tainacan-icon-close"/>
                </span>
            </a>       
        </div>
        <div class="popup-list">
            <ul>
                <li
                        v-for="(tour, index) of tours"
                        :key="index"
                        @click="startSelectedTour(tour)">   
                    <div class="tour-item">
                        <div class="tour-title">
                            <p>{{ tour }}</p>
                        </div>
                        <span class="icon has-text-gray action-icon">
                            <i class="tainacan-icon tainacan-icon-18px tainacan-icon-play"/>
                        </span>  
                    </div>
                </li>
            </ul>
        </div>
        <div class="popup-footer" />
    </div>
</div>
</template>

<script>
export default {
    name: 'ToursPopup',
    data() {
        return {
            tours: []
        }
    },
    methods: {
        startSelectedTour(tour) {
            this.$emit('closeToursPopup');
            this.$tours[tour].start();
        }
    },
    mounted() {
        this.tours = Object.keys(this.$tours);
    }
}
</script>


<style lang="scss">
    @import "../../scss/_variables.scss";

    .control.is-loading::after {
        border: 2px solid $success;
        border-right-color: $gray2;
        border-top-color: $gray2;
    }
    .tours-popup-backdrop {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        border: 0;
        width: 100%;
        height: 100vh;
        right: 26px;
    }

    @media screen and (max-width: 768px) {
        .tours-popup {
            right: 27px !important;
        }
    }

    // For iPhone SE
    @media screen and (max-width: 320px) {
        .tours-popup {
            right: 20px !important;
            width: 280px !important;
        }
    }

    .tours-popup{
        background-color: $blue2;
        width: 320px;
        max-width: 100%;
        position: absolute;
        top: 48px;
        right: 91px;
        border-radius: 5px;
        animation-name: appear-from-top;
        animation-duration: 0.3s;
        font-size: 0.75rem;

        .popup-header, .popup-footer {
            display: flex;
            align-items: center;
            color: $blue5;
            .header-title, .footer-title {
                margin-right: auto;
            }
        }

        .popup-header { 
            padding: 6px 12px 4px 12px; 
            .header-title {
                margin-right: auto;
                cursor: pointer;
            }
        }
        .popup-footer { 
            padding: 4px 12px 6px 10px; 
            min-height: 12px;
            .footer-title { 
                margin-right: auto;
                font-size: 0.625rem;
            }
        }

        .popup-list {
            background-color: white;
            color: black;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 222px; 
            animation-name: expand;
            animation-duration: 0.3s;

            li:hover {
                background-color: $gray0;

                .action-icon{
                    visibility: visible;
                    opacity: 1;
                    cursor: pointer;
                }
                /*.loading-icon {*/
                    /*display: none;*/
                /*}*/
                .tours-item>.tours-title .tainacan-arrowleft, .tours-item>.tours-title .tainacan-arrowright {
                    color: $gray3 !important;
                }
            }

            .tour-item {
                padding: 5px 12px 5px 22px;
                display: flex;
                justify-content: space-between;
                width: 100%;

                .tour-title {
                    cursor: pointer;
                    margin-right: auto;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    max-width: calc(100% - 40px);

                    p {
                        display: inline-block;
                        position: relative;
                        top: 1px;
                    }
                    
                    .tainacan-arrowleft, .tainacan-arrowright {
                        color: $turquoise2;
                    }
                }
                .action-icon {
                    visibility: hidden;
                    opacity: 0;
                }
                .loading-icon .control.is-loading::after {
                    position: relative !important;
                    right: 0;
                    top: 0;
                }
            }
            .tour-label {
                padding: 0px 12px 6px 32px;
                margin-right: auto;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: calc(100% - 40px);
                font-size: 0.625rem;
                color: $gray4;
                animation-name: expand;
                animation-duration: 0.3s;
            }
            span.tour-label-value {
                font-style: italic;
                font-weight: bold;
            }
            
        }

        &:before {
            content: "";
            display: block;
            position: absolute;
            right: 35px;
            width: 0;
            height: 0;
            border-style: solid;
            border-color: transparent transparent $blue2 transparent;
            border-right-width: 8px;
            border-bottom-width: 8px;
            border-left-width: 8px;
            top: -10px;
        }

        .separator {
            margin: 0px 10px;
            height: 1px;
            background-color: $secondary; 
        }
    }

</style>