import tainacan from '../../api-client/axios.js';
import axios from 'axios';

const { __ } = wp.i18n;

const { TextControl, Button, Modal, RadioControl, Spinner } = wp.components;

export default class DynamicTermsModal extends React.Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            taxonomiesPerPage: 24,
            taxonomyId: undefined,  
            taxonomyName: '', 
            isLoadingTaxonomies: false, 
            modalTaxonomies: [],
            totalModalTaxonomies: 0, 
            taxonomyPage: 1,
            temporaryTaxonomyId: '',
            searchTaxonomyName: '',
            taxonomies: [],
            taxonomiesRequestSource: undefined
        };
        
        // Bind events
        this.resetTaxonomies = this.resetTaxonomies.bind(this);
        this.selectTaxonomy = this.selectTaxonomy.bind(this);
        this.fetchTaxonomies = this.fetchTaxonomies.bind(this);
        this.fetchModalTaxonomies = this.fetchModalTaxonomies.bind(this);
        this.fetchTaxonomy = this.fetchTaxonomy.bind(this);
    }

    componentWillMount() {
        
        this.setState({ 
            taxonomyId: this.props.existingTaxonomyId,
            taxonomyPage: 1 
        });
        
        this.fetchModalTaxonomies();
    }

    // TAXONOMIES RELATED --------------------------------------------------
    fetchModalTaxonomies() {

        let someModalTaxonomies = this.state.modalTaxonomies;
        if (this.state.taxonomyPage <= 1)
            someModalTaxonomies = [];

        let endpoint = '/taxonomies/?orderby=title&order=asc&perpage=' + this.state.taxonomiesPerPage + '&paged=' + this.state.taxonomyPage;

        this.setState({ 
            isLoadingTaxonomies: true,
            taxonomyPage: this.state.taxonomyPage + 1, 
            modalTaxonomies: someModalTaxonomies
        });

        tainacan.get(endpoint)
            .then(response => {

                let otherModalTaxonomies = this.state.modalTaxonomies;
                for (let taxonomy of response.data) {
                    otherModalTaxonomies.push({ 
                        name: taxonomy.name, 
                        id: taxonomy.id
                    });
                }

                this.setState({ 
                    isLoadingTaxonomies: false, 
                    modalTaxonomies: otherModalTaxonomies,
                    totalModalTaxonomies: response.headers['x-wp-total']
                });
            
                return otherModalTaxonomies;
            })
            .catch(error => {
                console.log('Error trying to fetch taxonomies: ' + error);
            });
    }

    fetchTaxonomy(taxonomyId) {
        tainacan.get('/taxonomies/' + taxonomyId)
            .then((response) => {
                this.setState({ taxonomyName: response.data.name });
            }).catch(error => {
                console.log('Error trying to fetch taxonomy: ' + error);
            });
    }

    selectTaxonomy(selectedTaxonomyId) {
        this.setState({
            taxonomyId: selectedTaxonomyId
        });

        this.props.onSelectTaxonomy(selectedTaxonomyId);
    }

    fetchTaxonomies(name) {

        if (this.state.taxonomiesRequestSource != undefined)
            this.state.taxonomiesRequestSource.cancel('Previous taxonomies search canceled.');

        let aTaxonomyRequestSource = axios.CancelToken.source();

        this.setState({ 
            taxonomiesRequestSource: aTaxonomyRequestSource,
            isLoadingTaxonomies: true, 
            taxonomies: []
        });

        let endpoint = '/taxonomies/?orderby=title&order=asc&perpage=' + this.state.taxonomiesPerPage;
        if (name != undefined && name != '')
            endpoint += '&search=' + name;

        tainacan.get(endpoint, { cancelToken: aTaxonomyRequestSource.token })
            .then(response => {
                let someTaxonomies = response.data.map((taxonomy) => ({ name: taxonomy.name, id: taxonomy.id + '' }));

                this.setState({ 
                    isLoadingTaxonomies: false, 
                    taxonomies: someTaxonomies
                });
                
                return someTaxonomies;
            })
            .catch(error => {
                console.log('Error trying to fetch taxonomies: ' + error);
            });
    }

    applySelectedSearchURL() {    
        this.props.onApplySearchURL(document.getElementById("termsFrame").contentWindow.location.href);
    }

    resetTaxonomies() {

        this.setState({
            taxonomyId: null,
            taxonomyPage: 1,
            modalTaxonomies: []
        });
        this.fetchModalTaxonomies(); 
    }

    cancelSelection() {

        this.setState({
            modalTaxonomies: []
        });

        this.props.onCancelSelection();
    }

    render() {
        return (
        // Taxonomies modal
        <Modal
                className="wp-block-tainacan-modal"
                title={__('Select a taxonomy to fetch terms from', 'tainacan')}
                onRequestClose={ () => this.cancelSelection() }
                contentLabel={__('Select terms', 'tainacan')}>
                <div>
                    <div className="modal-search-area">
                        <TextControl 
                                label={__('Search for a taxonomy', 'tainacan')}
                                value={ this.state.searchTaxonomyName }
                                onChange={(value) => {
                                    this.setState({ 
                                        searchTaxonomyName: value
                                    });
                                    _.debounce(this.fetchTaxonomies(value), 300);
                                }}/>
                    </div>
                    {(
                    this.state.searchTaxonomyName != '' ? (
                        this.state.taxonomies.length > 0 ?
                        (
                            <div>
                                <div className="modal-radio-list">
                                    {
                                    <RadioControl
                                        selected={ this.state.temporaryTaxonomyId }
                                        options={
                                            this.state.taxonomies.map((taxonomy) => {
                                                return { label: taxonomy.name, value: '' + taxonomy.id }
                                            })
                                        }
                                        onChange={ ( aTaxonomyId ) => { 
                                            this.setState({ temporaryTaxonomyId: aTaxonomyId });
                                        } } />
                                    }                                      
                                </div>
                            </div>
                        ) :
                        this.state.isLoadingTaxonomies ? (
                            <Spinner />
                        ) :
                        <div className="modal-loadmore-section">
                            <p>{ __('Sorry, no taxonomy found.', 'tainacan') }</p>
                        </div> 
                    ):
                    this.state.modalTaxonomies.length > 0 ? 
                    (   
                        <div>
                            <div className="modal-radio-list">
                                {
                                <RadioControl
                                    selected={ this.state.temporaryTaxonomyId }
                                    options={
                                        this.state.modalTaxonomies.map((taxonomy) => {
                                            return { label: taxonomy.name, value: '' + taxonomy.id }
                                        })
                                    }
                                    onChange={ ( aTaxonomyId ) => { 
                                        this.setState({ temporaryTaxonomyId: aTaxonomyId });
                                    } } />
                                }                                     
                            </div>
                            <div className="modal-loadmore-section">
                                <p>{ __('Showing', 'tainacan') + " " + this.state.modalTaxonomies.length + " " + __('of', 'tainacan') + " " + this.state.totalModalTaxonomies + " " + __('taxonomies', 'tainacan') + "."}</p>
                                {
                                    this.state.modalTaxonomies.length < this.state.totalModalTaxonomies ? (
                                    <Button 
                                        isDefault
                                        isSmall
                                        onClick={ () => this.fetchModalTaxonomies() }>
                                        {__('Load more', 'tainacan')}
                                    </Button>
                                    ) : null
                                }
                            </div>
                        </div>
                    ) : this.state.isLoadingTaxonomies ? <Spinner/> :
                    <div className="modal-loadmore-section">
                        <p>{ __('Sorry, no taxonomy found.', 'tainacan') }</p>
                    </div>
                )}
                <div className="modal-footer-area">
                    <Button 
                        isDefault
                        onClick={ () => { this.cancelSelection() }}>
                        {__('Cancel', 'tainacan')}
                    </Button>
                    <Button
                        isPrimary
                        disabled={ this.state.temporaryTaxonomyId == undefined || this.state.temporaryTaxonomyId == null || this.state.temporaryTaxonomyId == ''}
                        onClick={ () => { this.selectTaxonomy(this.state.temporaryTaxonomyId);  } }>
                        {__('Configure search', 'tainacan')}
                    </Button>
                </div>
            </div>
        </Modal> 
        );
    }
}