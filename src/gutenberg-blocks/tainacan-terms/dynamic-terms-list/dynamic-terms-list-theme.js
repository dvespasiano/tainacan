import Vue from 'vue';
import DynamicTermsListTheme from './dynamic-terms-list-theme.vue';

// This is rendered on the theme side.
document.addEventListener("DOMContentLoaded", () => {

    // Configure Vue logic before passing it to constructor:
    let vueOptions = {
        data: {
            taxonomyId: '',  
            showImage: true,
            showName: true,
            layout: 'grid',
            gridMargin: 0,
            searchURL: '',
            maxTermsNumber: 12,
            order: 'asc',
            showSearchBar: false,
            showTaxonomyHeader: false,
            showTaxonomyLabel: false,
            taxonomyBackgroundColor: '#454647',
            taxonomyTextColor: '#ffffff',
            tainacanApiRoot: '',
            tainacanBaseUrl: '',
            className: ''
        },
        render(h){ 
            return h(DynamicTermsListTheme, {
                props: {
                    taxonomyId: this.taxonomyId,  
                    showImage: this.showImage,
                    showName: this.showName,
                    layout: this.layout,
                    gridMargin: this.gridMargin,
                    searchURL: this.searchURL,
                    maxTermsNumber: this.maxTermsNumber,
                    order: this.order,
                    showSearchBar: this.showSearchBar,
                    showTaxonomyHeader: this.showTaxonomyHeader,
                    showTaxonomyLabel: this.showTaxonomyLabel,
                    taxonomyBackgroundColor: this.taxonomyBackgroundColor,
                    taxonomyTextColor: this.taxonomyTextColor,
                    tainacanApiRoot: this.tainacanApiRoot,
                    tainacanBaseUrl: this.tainacanBaseUrl,
                    className: this.className    
                }
            });
        },
        beforeMount () {
            this.className = this.$el.attributes.class != undefined ? this.$el.attributes.class.value : undefined;
            this.searchURL = this.$el.attributes['search-url'] != undefined ? this.$el.attributes['search-url'].value : undefined;
            this.taxonomyId = this.$el.attributes['taxonomy-id'] != undefined ? this.$el.attributes['taxonomy-id'].value : undefined;
            this.showImage = this.$el.attributes['show-image'] != undefined ? this.$el.attributes['show-image'].value == 'true' : true;
            this.showName = this.$el.attributes['show-name'] != undefined ? this.$el.attributes['show-name'].value == 'true' : true;
            this.layout = this.$el.attributes['layout'] != undefined ? this.$el.attributes['layout'].value : undefined;
            this.gridMargin = this.$el.attributes['grid-margin'] != undefined ? Number(this.$el.attributes['grid-margin'].value) : undefined;
            this.maxTermsNumber = this.$el.attributes['max-terms-number'] != undefined ? this.$el.attributes['max-terms-number'].value : undefined;
            this.order = this.$el.attributes['order'] != undefined ? this.$el.attributes['order'].value : undefined;
            this.showSearchBar = this.$el.attributes['show-search-bar'] != undefined ? this.$el.attributes['show-search-bar'].value == 'true' : false;
            this.showTaxonomyHeader = this.$el.attributes['show-taxonomy-header'] != undefined ? this.$el.attributes['show-taxonomy-header'].value == 'true' : false;
            this.showTaxonomyLabel = this.$el.attributes['show-taxonomy-label'] != undefined ? this.$el.attributes['show-taxonomy-label'].value == 'true' : false;
            this.taxonomyBackgroundColor = this.$el.attributes['taxonomy-background-color'] != undefined ? this.$el.attributes['taxonomy-background-color'].value : undefined;
            this.taxonomyTextColor = this.$el.attributes['taxonomy-text-color'] != undefined ? this.$el.attributes['taxonomy-text-color'].value : undefined;
            this.tainacanApiRoot = this.$el.attributes['tainacan-api-root'] != undefined ? this.$el.attributes['tainacan-api-root'].value : undefined;
            this.tainacanBaseUrl = this.$el.attributes['tainacan-base-url'] != undefined ? this.$el.attributes['tainacan-base-url'].value : undefined;
        },
        methods: {
            __(text, domain) {
                return wp.i18n.__(text, domain);
            }
        }
    };

    // Gets all divs with content created by our block;
    let blocks = document.getElementsByClassName('wp-block-tainacan-dynamic-terms-list');
    
    if (blocks) {
        let blockIds = Object.values(blocks).map((block) => block.id);

        // Creates a new Vue Instance to manage each block isolatelly
        for (let blockId of blockIds) {
            new Vue( Object.assign({ el: '#' + blockId }, jQuery.extend(true, {}, vueOptions)) );
        }
    }
});