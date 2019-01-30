const { registerBlockType } = wp.blocks;

const { Modal, Button, IconButton } = wp.components;

const { RichText } = wp.editor;

const { __ } = wp.i18n;

import tainacan from '../../api-client/axios.js';

registerBlockType('tainacan/collections-grid', {
    title: __('Tainacan Collections Grid', 'tainacan'),
    icon: 'grid-view',
    category: 'tainacan-blocks',
    attributes: {
        isModalOpen: {
            type: Boolean,
            default: false
        },
        selectedCollections: {
            type: Array,
            default: []
        },
        collections: {
            type: 'array',
            source: 'query',
            selector: 'li>a',
            query: {
                url: {
                    source: 'attribute',
                    attribute: 'href'
                },
                img: {
                    source: 'query',
                    selector: 'img',
                    query: {
                        src: {
                            source: 'attribute',
                            attribute: 'src'
                        },
                        alt: {
                            source: 'attribute',
                            attribute: 'alt'
                        },
                    }
                }
            },
            default: [],
        },
        contentTemp: {
            type: Array,
            default: [],
        },
        content: {
            type: 'array',
            source: 'children',
            selector: 'div'
        },
    },
    supports: {
        align: ['full', 'left', 'right', 'wide'],
        html: false
    },
    keywords: [__('tainacan', 'tainacan'), __('grid', 'tainacan'), __('collections', 'tainacan')],
    edit({ attributes, setAttributes, className }) {
        console.log('Edit attributes: ', attributes);

        let { selectedCollections, collections, isModalOpen, contentTemp, content } = attributes;

        function prepareCollection(collection) {
            return (
                <a href={collection.url}>
                    <img
                        src={
                            (collection.thumbnail && collection.thumbnail.thumbnail) ?
                                collection.thumbnail.thumbnail[0] :
                                ( (collection.img && collection.img[0].src) ?
                                    collection.img[0].src : `${tainacan_plugin.base_url}/admin/images/placeholder_square.png`)
                        }
                        alt={ collection.alt ? collection.alt : collection.name } />
                </a>
            );
        }

        function getCollections() {
           return tainacan.get(`/collections?perpage=3&paged=1&orderby=date`)
               .then(response => {
                   return response.data;
               })
               .catch(error => {
                   console.error(error);
               });
        }

        function removeCollection(collectionID) {
            let index = contentTemp.findIndex((coll) => {
                return coll.key == collectionID;
            });

            if(index >= 0){
               contentTemp.splice(index, 1);
               selectedCollections.splice(index, 1);

               setAttributes({contentTemp: contentTemp});
               updateContent(contentTemp);
            }
        }

        return (
            <div className={ className }>
                <div style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>
                    <Button
                        style={{
                            justifyContent: 'center',
                        }}
                        isDefault
                        onClick={ () => setAttributes( { isModalOpen: true } ) }>{ __('Add collection', 'tainacan') }</Button>
                </div>

                { isModalOpen ?
                    <Modal
                        shouldCloseOnClickOutside={ false }
                        shouldCloneOnEsc={false}
                        focusOnMount={false}
                        title={ __('Add collection', 'tainacan') }
                        onRequestClose={ () => {
                            setAttributes( { isModalOpen: false } );
                            updateContent(contentTemp);
                        }}>

                        <div>
                            <Button isDefault onClick={ () => {
                                setAttributes( { isModalOpen: false } );
                                updateContent(contentTemp);
                            } }>
                                { __('Close', 'tainacan') }
                            </Button>
                        </div>
                    </Modal>
                    : null
                }

            </div>
        );
    },
    save({ attributes }) {
        console.log('save', attributes);

        const { content } = attributes;

        return <div>{content}</div>
    },
});