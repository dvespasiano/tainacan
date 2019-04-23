<template>
    <div class="home-page page-container">
        <transition name="appear">
            <tainacan-welcome
                    v-if="showWelcome"
                    @onCloseWelcome="onCloseWelcome"/>
        </transition>
        <b-loading :active.sync="isLoadingCollections"/>
        <section class="home-section home-section-repository">
            <tainacan-tour
                    name="homeTour"
                    :steps="homeTourSteps"
                    position="bottom"/>
            <div 
                    class="section-connector" 
                    aria-hidden/>
            <div class="home-section-header repository-section-header">
                <div class="home-section-icon">
                    <span class="icon">
                        <i class="tainacan-icon tainacan-icon-repository"/>
                    </span>
                </div>
                
                <h1>{{ $i18n.get('repository') + ' ' }}<span class="has-text-weight-semibold">{{ repositoryName }}</span></h1>
                <a
                        target="_blank"
                        :href="themeCollectionListURL">
                    <span class="icon">
                        <i class="tainacan-icon tainacan-icon-20px tainacan-icon-see"/>
                    </span>
                    <span class="menu-text">{{ $i18n.get('label_view_on_theme') }}</span>
                </a>
            </div>
            <nav>
                <ul class="repository-menu-list">
                    <!-- <li>
                        <router-link
                                tag="a"
                                to="/collections">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-collections"/>
                            </span>
                            <span class="menu-text">{{ $i18n.getFrom('collections', 'name') }}</span>
                        </router-link>
                    </li> -->
                    <!-- <li>
                        <router-link
                                tag="a"
                                to="/items">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-items"/>
                            </span>
                            <span class="menu-text">{{ $i18n.get('label_all_items') }}</span>
                        </router-link>
                    </li> -->
                    <li data-v-step="1">
                        <router-link
                                tag="a"
                                to="/metadata">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-metadata"/>
                            </span>
                            <span class="menu-text">{{ $i18n.get('title_repository_metadata_page' ) }}</span>
                        </router-link>
                    </li>
                    <li data-v-step="2">
                        <router-link
                                tag="a"
                                to="/filters">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-filters"/>
                            </span>
                            <span class="menu-text">{{ $i18n.get('title_repository_filters_page') }}</span>
                        </router-link>
                    </li>
                    <li data-v-step="3">
                        <router-link
                                tag="a"
                                to="/taxonomies">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-taxonomies"/>
                            </span>
                            <span class="menu-text">{{ $i18n.getFrom('taxonomies', 'name') }}</span>
                        </router-link>
                    </li>
                    <li data-v-step="4">
                        <router-link
                                tag="a"
                                to="/activities">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-activities"/>
                            </span>
                            <span class="menu-text">{{ $i18n.get('title_repository_activities_page') }}</span>
                        </router-link>
                    </li>
                    <li data-v-step="5">
                        <router-link
                                tag="a"
                                to="/importers">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-importers"/>
                            </span>
                            <span class="menu-text menu-text-import">{{ $i18n.get('importers') }}</span>
                        </router-link>
                    </li>
                    <li data-v-step="6">
                        <router-link
                                tag="a"
                                to="/exporters">
                            <span class="icon is-medium">
                                <i class="tainacan-icon tainacan-icon-36px tainacan-icon-export"/>
                            </span>
                            <span class="menu-text">{{ $i18n.get('exporters') }}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </section>

        <section class="home-section home-section-collection">
            <div class="home-section-header collections-section-header">
                <div class="home-section-icon">
                    <router-link
                        tag="span"
                        class="icon"
                        to="/collections">
                        <i class="tainacan-icon tainacan-icon-collections"/>
                    </router-link>
                </div>
                <h1>{{ $i18n.get('collections') }}</h1>
                <router-link
                        tag="a"
                        to="/collections">
                    <span class="icon">
                        <i class="tainacan-icon tainacan-icon-20px tainacan-icon-viewtable"/>
                    </span>
                    <span class="menu-text">{{ $i18n.get('label_view_all_collections') }}</span>
                </router-link>
            </div>
            <collections-home-list
                    :is-loading="isLoadingCollections"
                    :collections="collections"/> 
        </section>

    </div>   
</template>

<script>
import CollectionsHomeList from '../components/lists/collections-home-list.vue';
import { mapActions, mapGetters } from 'vuex';
import TainacanWelcome from '../components/other/tainacan-welcome.vue';
import TainacanTour from '../components/other/tainacan-tour.vue';

export default {
    name: 'HomePage',
    data(){
        return {
            isLoadingCollections: false,
            repositoryName: tainacan_plugin.repository_name,
            themeCollectionListURL: tainacan_plugin.theme_collection_list_url,
            homeTourSteps: [
                {
                    target: '[data-v-step="1"]',
                    content: {
                        icon: 'metadata',
                        title: this.$i18n.get('title_repository_metadata_page' ),
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et <a href="wiki.tainacan.org" target="_blank">link para a wiki</a> magna aliqua.'
                    },
                },
                {   
                    target: '[data-v-step="2"]',
                    content: {
                        icon: 'filters',
                        title: this.$i18n.get('title_repository_filters_page'),
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et <a href="wiki.tainacan.org" target="_blank">link para a wiki</a> magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    }
                },
                {   
                    target: '[data-v-step="3"]',
                    content: {
                        icon: 'taxonomies',
                        title: this.$i18n.getFrom('taxonomies', 'name'),
                        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                },
                {
                    target: '[data-v-step="4"]',
                    content: {
                        icon: 'activities',
                        title: this.$i18n.get('title_repository_activities_page'),
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et <a href="wiki.tainacan.org" target="_blank">link para a wiki</a> magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                },
                {   
                    target: '[data-v-step="5"]',
                    content: {
                        icon: 'importers',
                        title: this.$i18n.get('importers'),
                        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                },
                {   
                    target: '[data-v-step="6"]',
                    content: {
                        icon: 'export',
                        title: this.$i18n.get('exporters'),
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et <a href="wiki.tainacan.org" target="_blank">link para a wiki</a> magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    }
                }
            ],
            showWelcome: false,
        }
    },
    components: {
        CollectionsHomeList,
        TainacanTour,
        TainacanWelcome
    },
    computed: {
        collections() {
            return this.getCollections(); 
        }
    },
    methods: {
         ...mapActions('collection', [
            'fetchCollections',
            'cleanCollections'
        ]),
        ...mapGetters('collection', [
            'getCollections'
        ]),
        loadCollections() {
            this.cleanCollections();    
            this.isLoadingCollections = true;
            this.fetchCollections({ page: 1, collectionsPerPage: 5, status: undefined, contextEdit: true })
            .then(() => {
                this.isLoadingCollections = false;
            }) 
            .catch(() => {
                this.isLoadingCollections = false;
            });
        },
        onCloseWelcome(shouldPerformTour) {

            this.showWelcome = false;

            if (shouldPerformTour)
                this.$tours.homeTour.start();

        }
    },
    mounted(){
        this.loadCollections();
        
        // if (this.$userPrefs.get('hasShownHomeWelcome') != true) {
            this.showWelcome = true;
            this.$userPrefs.set('hasShownHomeWelcome', true);
        //}
    }
}
</script>

<style lang="scss" scoped>

    @import '../../scss/_variables.scss';

    .home-page {
        margin-top: $header-height;
        background-color: white;
        height: calc(100% - 52px);
        padding: 25px 8.333333333% !important;
        width: 100vw;

        .home-section {
            
            &.home-section-repository{
                position: relative;
                &>nav {
                    padding-left: 52px;
                }
            }
            &.home-section-collection {
                margin-left: 52px;
            }

            .section-connector {
                border-left: 1px solid $gray2;
                border-bottom: 1px solid $gray2;
                position: absolute;
                width: 42px;
                height: 100%;
                top: 43px;
                left: 26px;
            }

            .home-section-header {
                width: 100%;
                margin-top: 1rem;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                height: 52px;

                .home-section-icon {
                    background-color: white;
                    padding: 0.75rem;
                    height: 52px;
                    width: 52px;
                    font-size: 30px;
                    text-align: center;
                    z-index: 9;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .icon:hover {
                        cursor: pointer;
                    }
                }

                h1 {
                    color: $gray5;
                    font-size: 1.375rem;
                    font-weight: normal;
                    padding: 0.75rem 1.375rem;
                    margin-right: auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                a {
                    margin-right: 2rem;
                    display: inline-flex;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    .menu-text { margin-left: 0.5rem;}
                }

                &.repository-section-header {
                    border-bottom: 1px solid $blue5;
                    a {
                        color: $blue5;
                    }
                    .home-section-icon {
                        background-color: $blue5;
                        color: white;
                    }
                }
                &.collections-section-header {
                    border-bottom: 1px solid $turquoise5;
                    a {
                        color: $turquoise5;
                    }
                    .home-section-icon {
                        background-color: $turquoise5;
                        color: white;
                    }
                }
            }
        }

        .repository-menu-list {
            display: flex;
            width: calc(100% + 1.25rem);
            justify-content: space-between;
            flex-wrap: wrap;
            margin: 0 -0.75rem;

            li {
                padding: 1rem;
                display: flex;
                background-color: $gray1;
                flex-grow: 1;
                margin: 0.75rem;
                height: 120px; 
                min-width: 13%;
                flex-basis: 13%;
                max-width: 15%;

                @media screen and (max-width: 580px) {
                    max-width: calc(100% - 52px);
                    min-width: calc(100% - 52px);
                }
                @media screen and (min-width: 581px) and (max-width: 767px) {
                    min-width: calc(50% - 26px);
                    max-width: calc(50% - 26px);
                }
                @media screen and (min-width: 768px) and (max-width: 1023px) {
                    min-width: calc(33.33% - 26px);
                    max-width: calc(33.33% - 26px);
                }
                @media screen and (min-width: 1024px) and (max-width: 1280px) {
                    min-width: 30%;
                    max-width: 30%;
                }

                &:hover {
                    background-color: $gray2;
                }

                a { 
                    width: 100%;
                    color: $blue5; 
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-evenly;
                }
                .menu-text {
                    text-align: center; 
                }
            }
        }

    }

</style>


