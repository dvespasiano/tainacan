import Vue from 'vue';

document.addEventListener("DOMContentLoaded", function() {
    new Vue({
        el: '#tainacan-block-grid-item',
        data: {
            test: 'VUE IS ALIVE',
            collectionId: ''
        },
        created: function () {
            console.log(this.test);
        },
        beforeMount () {
            this.collectionId = this.$el.attributes['collection-id'] != undefined ? this.$el.attributes['collection-id'].value : undefined;
            this.test += this.collectionId;
        }
    });
});
