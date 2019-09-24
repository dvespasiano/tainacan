<template>
    <div class="table-container">
        <div 
                ref="masonryWrapper"
                class="table-wrapper">

            <!-- Empty result placeholder -->
            <section
                    v-if="!isLoading && items.length <= 0"
                    class="section">
                <div class="content has-text-gray4 has-text-centered">
                    <p>
                        <span class="icon is-large">
                            <i class="tainacan-icon tainacan-icon-36px tainacan-icon-items" />
                        </span>
                    </p>
                    <p>{{ $i18n.get('info_no_item_found') }}</p>
                </div>
            </section>

            <!-- SKELETON LOADING -->
            <masonry
                    v-if="isLoading"
                    :cols="masonryCols"
                    :gutter="25"                    
                    class="tainacan-masonry-container">
                <div 
                        :key="item"
                        v-for="item in 12"
                        :style="{'min-height': randomHeightForMasonryItem() + 'px' }"
                        class="skeleton tainacan-masonry-item" />
            </masonry>

            <!-- MASONRY VIEW MODE -->
            <masonry
                    role="list"
                    v-if="!isLoading && items.length > 0" 
                    :cols="masonryCols"
                    :gutter="25"
                    class="tainacan-masonry-container">
                <a 
                        role="listitem"
                        :key="index"
                        v-for="(item, index) of items"
                        class="tainacan-masonry-item" 
                        :href="item.url">

                    <!-- Title -->
                    <div class="metadata-title">
                        <p>{{ item.title != undefined ? item.title : '' }}</p>                             
                    </div>

                    <!-- Thumbnail -->
                    <div 
                            v-if="item.thumbnail != undefined"
                            class="tainacan-masonry-item-thumbnail">  
                        <img 
                                :alt="$i18n.get('label_thumbnail')"
                                :style="{ minHeight: getItemImageHeight(item['thumbnail']['tainacan-medium-full'] ? item['thumbnail']['tainacan-medium-full'][1] : (item['thumbnail'].medium_large ? item['thumbnail'].medium_large[1] : 120), item['thumbnail']['tainacan-medium-full'] ? item['thumbnail']['tainacan-medium-full'][2] : (item['thumbnail'].medium_large ? item['thumbnail'].medium_large[2] : 120)) + 'px'}"
                                v-lazy="{
                                    src: item['thumbnail']['tainacan-medium-full'] ? item['thumbnail']['tainacan-medium-full'][0] : (item['thumbnail'].medium_large ? item['thumbnail'].medium_large[0] : thumbPlaceholderPath),
                                    error: thumbPlaceholderPath
                                }" >  
                    </div>
                </a> 
            </masonry>
        </div> 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ViewModeMasonry',
    props: {
        collectionId: Number,
        displayedMetadata: Array,
        items: Array,
        isLoading: false,
        itemsPerPage: Number,
        isFiltersMenuCompressed: Boolean
    },
    data () {
        return {
            thumbPlaceholderPath: tainacan_plugin.base_url + '/admin/images/placeholder_square.png',
            itemColumnWidth: Number,
            masonryCols: { default: 7, 1919: 6, 1407: 5, 1215: 4, 1023: 3, 767: 2, 343: 1 }
        }
    },
    methods: {
        ...mapGetters('search', [
            'getItemsPerPage',
        ]),
        goToItemPage(item) {
            window.location.href = item.url;   
        },
        renderMetadata(itemMetadata, column) {

            const metadata = itemMetadata[column.slug] != undefined ? itemMetadata[column.slug] : false;

            if (!metadata) {
                return '';
            } else {
                return metadata.value_as_html;
            }
        },
        randomHeightForMasonryItem() {
            const min = 120;
            const max = 360;

            return Math.floor(Math.random()*(max-min+1)+min);
        },
        getItemImageHeight(imageWidth, imageHeight) {  
            
            if (this.$refs.masonryWrapper != undefined && 
                this.$refs.masonryWrapper.children[0] != undefined && 
                this.$refs.masonryWrapper.children[0].children[0] != undefined && 
                this.$refs.masonryWrapper.children[0].children[0].clientWidth != undefined)
                    this.itemColumnWidth = this.$refs.masonryWrapper.children[0].children[0].clientWidth;

            return (imageHeight*this.itemColumnWidth)/imageWidth;
        },
        handleLoadedImages({ el }) {
            el.style.setProperty('min-height', 'unset');
        }
    },
    mounted() {
        if (this.$refs.masonryWrapper != undefined && 
            this.$refs.masonryWrapper.children[0] != undefined && 
            this.$refs.masonryWrapper.children[0].children[0] != undefined && 
            this.$refs.masonryWrapper.children[0].children[0].clientWidth != undefined) {
                this.itemColumnWidth = this.$refs.masonryWrapper.children[0].children[0].clientWidth;
        } else
            this.itemColumnWidth = 202;
    },
    created() {
        this.$Lazyload.$on('loaded', this.handleLoadedImages);
    },
    beforeDestroy() {
        this.$Lazyload.$off('loaded');
    }
}
</script>

<style  lang="scss" scoped>
    $turquoise1: #e6f6f8;
    $turquoise2: #d1e6e6;
    $tainacan-input-color: #1d1d1d;
    $gray1: #f2f2f2;
    $gray2: #e5e5e5;
    $gray3: #dcdcdc;
    $gray4: #555758;

    @import "../../src/admin/scss/_view-mode-masonry.scss";

    .tainacan-masonry-container .tainacan-masonry-item .metadata-title {
        margin: 0px 6px;
    }
</style>


