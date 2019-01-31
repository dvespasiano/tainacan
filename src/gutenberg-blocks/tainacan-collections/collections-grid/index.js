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
            type: 'array',
            source: 'query',
            selector: 'li>a',
            query: {
                id: {
                    source: 'attribute',
                    attribute: 'id'
                },
                name: {
                    source: 'text',
                    selector: '.collection-name'
                },
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
            default: []
        },
        collections: {
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
    edit({ attributes, setAttributes, className, isSelected }) {
        console.log('Edit attributes: ', attributes);

        let { selectedCollections, collections, isModalOpen, content } = attributes;

        function prepareCollectionForModal(collection, index) {
            return (
                <li key={ index }>
                    <Button 
                            className={ selectedCollections.findIndex((aCollection) => aCollection.id == `collection-${collection.id}`) >= 0 ? 'is-selected' : ''}
                            isToggled
                            onClick={ () => selectCollection(collection) }>
                        <div className="collection-name">
                            { collection.name ? collection.name : __("Name not informed", 'tainacan')}
                        </div>
                        <img
                            src={
                                (collection.thumbnail && collection.thumbnail.thumbnail) ?
                                    collection.thumbnail.thumbnail[0] :
                                    ( (collection.img && collection.img[0].src) ?
                                        collection.img[0].src : `${tainacan_plugin.base_url}/admin/images/placeholder_square.png`)
                            }
                            alt={ collection.alt ? collection.alt : collection.name } />
                    </Button>
                </li>
            );
        }

        function prepareCollectionForEditor(collection, index) {
            return (
                <li >
                    <a 
                            key={ index }
                            href={ collection.url }
                            targe="_blank"
                            id={ collection.id }>
                        <div className="collection-name">
                            { collection.name ? collection.name : __("Name not informed", 'tainacan')}
                        </div>
                        <img
                            src={ collection.img.src }
                            alt={ collection.img.alt } />
                        <div className="collection-control-area">
                            <IconButton 
                                    onClick={ ($event) => removeCollection($event, index) }
                                    icon="trash"
                                    label={ __("Remove collection", "tainacan") } />
                        </div>
                    </a>
                </li>
            )
        }

        function fetchCollections() {
           return tainacan.get(`/collections?orderby=date`)
               .then(response => {
                   collections = response.data;
                   setAttributes({ collections: collections });
               })
               .catch(error => {
                   console.error(error);
               });
        }

        function selectCollection(collection) {
            let existingIndex = selectedCollections.findIndex((aCollection) => aCollection.id == collection.id);
            if (existingIndex >= 0) {
                selectedCollections.splice(existingIndex, 1);
            } else {
                selectedCollections.push({
                    name: collection.name,
                    id:  `collection-${collection.id}`,
                    url: collection.url,
                    img: {
                        src: (collection.thumbnail && collection.thumbnail.thumbnail) ? collection.thumbnail.thumbnail[0] :
                                ((collection.img && collection.img[0].src) ? collection.img[0].src 
                                    : `${tainacan_plugin.base_url}/admin/images/placeholder_square.png`),
                        alt: collection.name
                    }
                });
            }
            setAttributes({ selectedCollections: selectedCollections });
            updateContent()
        }

        function removeCollection($event, index) {
            $event.preventDefault();
            $event.stopPropagation();
            selectedCollections.splice(index, 1);

            setAttributes({ selectedCollections: selectedCollections });
            updateContent();
        }

        function updateContent() {
            content = selectedCollections.length > 0 ? (
                <ul 
                        className="collections-grid">
                    { selectedCollections.map((collection, index) => prepareCollectionForEditor(collection, index)) }    
                </ul>
            ) : null;

            setAttributes({ content: content });
        }
        return (
            <div className={ className }>
                { isSelected || selectedCollections.length <= 0? 
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
                                onClick={ () => {
                                    setAttributes( { isModalOpen: true } );
                                    fetchCollections();
                                }}>
                            { __('Select collections', 'tainacan') }
                        </Button>
                    </div>
                    : null
                }

                { isModalOpen ?
                    <Modal
                        className="wp-block-tainacan-collections-grid__modal"
                        shouldCloseOnClickOutside={ false }
                        shouldCloneOnEsc={false}
                        focusOnMount={false}
                        title={ __('Select collections to show', 'tainacan') }
                        contentLabel={ __('Click on a collection to add it to the grid view.', 'tainacan') }
                        onRequestClose={ () => {
                            setAttributes({ isModalOpen: false });
                        }}>
                        <ul className="collections-grid">
                            { collections.map((collection, index) => prepareCollectionForModal(collection, index)) }    
                        </ul>
                        <div>
                            <Button isDefault onClick={ () => {
                                setAttributes({ isModalOpen: false });
                                updateContent();
                            } }>
                                { __('Done', 'tainacan') }
                            </Button>
                        </div>
                    </Modal>
                    : null
                }

                { content ? content : null }

            </div>
        );
    },
    save({ attributes }) {
        console.log('Save attributes', attributes);

        const { content } = attributes;
        
        return <div>{ content }</div>
    },
});