<template>
    <div class="tainacan-welcome">
        <button
                @click="closeWelcome(false)"
                class="icon close-button has-text-blue5">
            <i class="tainacan-icon tainacan-icon-close tainacan-icon-18px" />
        </button>
        <div class="columns">
            <div
                    :style="{ backgroundImage: 'url(' + backgroundWelcome + ')' }"
                    class="column">
                <h1>{{ $i18n.get('title_welcome_page') }}</h1>
                <div class="welcome-logo-container">
                    <img    
                            :src="logoWelcome"
                            alt="Tainacan">
                </div>
            </div>
            <div class="column is-3">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <br>
                <div class="welcome-buttons">
                    <button
                            class="run-button"
                            @click="closeWelcome(true)">
                        <span class="icon">
                            <i class="tainacan-icon tainacan-icon-36px tainacan-icon-playfill" />
                        </span>
                        {{ $i18n.get('label_begin_tour') }}
                    </button>
                    <button
                            class="link-style has-text-blue5"
                            @click="closeWelcome(false)">
                        {{ $i18n.get('label_skip') }}
                </button>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
    export default {
        name: 'TainacanWelcome',
        data() {
            return {
                logoWelcome: tainacan_plugin.base_url + '/admin/images/logo_outline.png',
                backgroundWelcome: tainacan_plugin.base_url + '/admin/images/welcome_pattern.jpg',
            }
        },
        methods: {
            closeWelcome(shouldPerformTour) {
                this.$emit('onCloseWelcome', shouldPerformTour);
            }
        },
    }
</script>

<style lang="scss" scoped>

    .tainacan-welcome {
        position: absolute;
        z-index: 99999999999999999;
        width: 100%;
        height: 100%;
        width: 100vw;
        height: 100vh;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0;
        overflow: hidden;
        background-color: #01295c;

        @media screen and (max-width: 768px) {
            overflow: auto;
        }

        .close-button {
            border: none;
            border-radius: 2rem;
            position: absolute;
            right: 0;
            top: 0;
            padding: 1.125rem 1.5rem;
            cursor: pointer;
            z-index: 99;
        }

        .columns {
            margin: 0;
            height: 100%;
            height: 100vh;

            .column:first-of-type {
                background-size: cover;
                background-color: #01295c;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-content: center;

                h1 {
                    margin: 2rem;
                    margin-top: 20%;
                    margin-top: 20vh;
                    color: white;
                    font-weight: 600;
                    font-size: 80px;
                    animation-name: item-appear;
                    animation-duration: 0.6s;

                    @media screen and (max-width: 768px) {
                        margin-top: 8%;
                        margin-top: 8vh;
                        font-size: 64px;
                    }
                }

                img {
                    margin: 2rem;
                    margin-top: 10%;
                    margin-top: 10vh;
                    max-height: 120px;
                    height: 120px;
                    width: auto;
                    animation-name: appear;
                    animation-duration: 0.4s;
                }
            }
            .column:last-of-type {
                background: white;
                padding: 5rem 4.6666667%;
                padding: 5rem 4.6666667vw;
                overflow-x: hidden;
                overflow-y: auto;
                animation-name: page-right-in;
                animation-duration: 0.6s;
                animation-timing-function: ease;
                
                p {
                    color: #454647;
                    font-size: 1.125rem;
                }

                .welcome-buttons {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: 1.125rem;
                    margin: 3rem 1rem;

                    .run-button {
                        color: #298596;
                        font-weight: bold;
                        border: none !important;
                        background: transparent;
                        margin-bottom: 0.75rem;
                        cursor: pointer;

                        .icon {
                            margin-right: 1rem;
                            position: relative;
                            top: -3px;
                        }
                    }
                }
            }
        }

    }
</style>