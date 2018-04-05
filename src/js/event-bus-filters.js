import Vue from 'vue';
import store from './store/store'
import router from './../admin/js/router.js';

export const eventFilterBus = new Vue({
    router,
    store,
    data: {
        componentsTag: [],
        errors : [],
        query: {}
    },
    created(){
        this.$on('input', data => {
            this.add_metaquery(data) 
            router.push({ query: {} });
            router.push({ query: store.getters['search/getPostQuery'] });
        });
    },
    watch: {
        '$route.query' () {
            if (this.$route.query.perpage == undefined)
                this.$route.query.perpage = 12;
            if (this.$route.query.paged == undefined)
            this.$route.query.paged = 1;

            store.dispatch('search/set_postquery', this.$route.query);
            //console.log(this.$route.query);
        }
    },
    methods: {
        add_metaquery( data ){
            if ( data && data.collection_id ){
                store.dispatch('search/add_metaquery', data );
            }
        },
        getErrors( filter_id ){
            let error = this.errors.find( errorItem => errorItem.field_id === filter_id );
            return ( error ) ? error.errors : false
        },

        /* Dev interfaces methods */

        registerComponent( name ){
            if (this.componentsTag.indexOf(name) < 0) {
                this.componentsTag.push( name );
            }
        },
        getAllComponents(){
            const components = [];
            for( let component of this.componentsTag ){
                const eventElements = document.getElementsByTagName( component );
                if( eventElements ) {
                    for (let eventElement of eventElements){
                        components.push( eventElement );
                    }
                }
            }
            return components;
        },
        listener(){
            const components = this.getAllComponents();
            for (let eventElement of components){
                eventElement.addEventListener('input', (event) => {
                    if( event.detail ) {
                        this.add_metaquery( event.detail[0] );
                    }
                });
            }
        },
        setPage(page) {
            store.dispatch('search/setPage', page);
            router.push({ query: {} });
            router.push({ query: store.getters['search/getPostQuery'] });
        },
        setItemsPerPage(itemsPerPage) {
            store.dispatch('search/setItemsPerPage', itemsPerPage);
            router.push({ query: {} });
            router.push({ query: store.getters['search/getPostQuery'] });
        }
    }
});