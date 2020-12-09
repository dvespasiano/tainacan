const { registerBlockType } = wp.blocks;
const { IconButton, Button, ToggleControl, Placeholder, Toolbar, ToolbarGroup, PanelBody, ToolbarButton } = wp.components;

const { InspectorControls, BlockControls } = wp.editor;

registerBlockType('tainacan/title-styles', {
    title: __('Tainacan Title', 'tainacan'),
    //escolher icon
    icon: {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="24px"
        width="24px">
        <path
            fill="#298596"
            d="M21.43,14.64,19.32,17a2.57,2.57,0,0,1-2,1H12.05a6,6,0,0,0-6-6H6V10.64A2.59,2.59,0,0,1,8.59,8H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,14.64ZM4,4A2,2,0,0,0,2,6v7.63a5.74,5.74,0,0,1,2-1.2V6H16V4ZM7,15.05v6.06l3.06-3.06ZM5,21.11V15.05L1.94,18.11Z" />
    </svg> */},
    category: 'tainacan-blocks',
    keywords: [__('title', 'tainacan')],
    description: __('Style Title.', 'tainacan'),
    example: {
        attributes: {
            content: 'preview'
        }
    },
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: 'h1'
        },
    },

    edit: function (props) {
        var conteudo = props.attributes.conteudo;
        function onChangeConteudo(novoConteudo) {
            console.log(novoConteudo)
            props.setAttributes({ conteudo: novoConteudo });
        }
        return (
            <div className={'title-tainacan'}>
                <h1 value={conteudo} onChange={onChangeConteudo}></h1>
                <div className={'tainacan-title-bar'}></div>
            </div>
        );
    },

    save: function (props) {
        return (
            <div className={'title-tainacan'}>
                <h1 value={props.atributes.conteudo} onChange={onChangeConteudo}></h1>
                <div className={'tainacan-title-bar'}></div>
            </div>
        );
    },
})

