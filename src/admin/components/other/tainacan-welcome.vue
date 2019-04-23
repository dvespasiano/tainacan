<template>
    <div class="tainacan-welcome">
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
        }
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

        .columns {
            margin: 0;
            height: 100%;
            height: 100vh;

            .column:first-of-type {
                background-size: cover;
                background-color: #284472;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-content: center;

                h1 {
                    margin: 2rem;
                    margin-top: 18%;
                    margin-top: 18vh;
                    color: white;
                    font-weight: 600;
                    font-size: 80px;

                    @media screen and (max-width: 768px) {
                        margin-top: 8%;
                        margin-top: 8vh;
                        font-size: 64px;
                    }
                }

                img {
                    margin: 2rem;
                    margin-top: 5%;
                    margin-top: 5vh;
                    max-height: 98px;
                    height: 98px;
                    width: auto;
                }
            }
            .column:last-of-type {
                background: white;
                padding: 5rem 4.6666667%;
                padding: 5rem 4.6666667vw;
                overflow-x: hidden;
                overflow-y: auto;
                
                p {
                    color: #454647;
                    font-size: 1.25rem;
                }
            }
        }

    }
</style>