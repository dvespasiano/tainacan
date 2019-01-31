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

        function prepareCollectionForModal(collection) {
            return (
                <li>
                    <Button 
                            id={ `collection-modal-${collection.id}` }
                            className={ selectedCollections.indexOf(collection.id) != -1 ? 'is-selected' : ''}
                            isToggled
                            onClick={ () => selectCollection(collection.id) }>
                        <div class="collection-name">
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
            return selectedCollections.indexOf(collection.id) != -1 ? (
                <li>
                    <a 
                            href={ collection.url }
                            targe="_blank"
                            id={ `collection-editor-${collection.id}` }>
                        <div class="collection-name">
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
                        <div class="collection-control-area">
                            <IconButton 
                                    onClick={ ($event) => removeCollection($event, index) }
                                    icon="trash"
                                    label={ __("Remove collection", "tainacan") } />
                        </div>
                    </a>
                </li>
            ) : null;
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

        function selectCollection(collectionId) {
            let existingIndex = selectedCollections.findIndex((collection) => collection == collectionId);
            if (existingIndex >= 0) {
                selectedCollections.splice(existingIndex, 1);
            } else {
                selectedCollections.push(collectionId);
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
            setAttributes({
                content: selectedCollections.length > 0 ? (
                    <div className={ className }>
                        <ul className="collections-grid">
                            {   
                                collections.map((collection, index) => prepareCollectionForEditor(collection, index))
                            }    
                        </ul>
                    </div>
                ) : null
            });
        }
        return (
            <div className={ className }>
                { isSelected ? 
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
                            { collections.map((collection) => prepareCollectionForModal(collection)) }    
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

        return <div>{content}</div>
    },
});