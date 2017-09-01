import React from 'react';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete'

class TagSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor( props ) {
        super( props );
        this.state = { searchText: '' };
    }

    render() {
        const { header, searchLabel, currentTags, availableTags, onUpdateTags } = this.props;
        const { searchText } = this.state;

        const requestDelete = tag => 
            onUpdateTags( currentTags.filter( _tag => _tag !== tag ) );

        const requestAdd = addTag => {
            currentTags.push( addTag.valueKey );
            onUpdateTags( currentTags );
            this.setState({ searchText: '' });
        };

        const updateSearchText = searchText => this.setState({ searchText });

        const autocompleteData = availableTags.map( tag => ( { textKey: `${tag.tag_type}: ${tag.tag_name}`, valueKey: tag.id } ) );

        return (
            <div>
                <div className="container row">
                    <h5>{ header }</h5>
                    { currentTags.map( tag => {
                        const _tag = availableTags.find( t => t.id == tag );
                        if ( ! _tag ) {
                            return null;
                        }
                        return ( 
                            <Chip key={tag} 
                                style={{ float: 'left', marginRight: '0.25em' }}
                                onRequestDelete={() => requestDelete(tag)} >
                                { _tag.tag_type }: { _tag.tag_name }
                            </Chip>
                       );
                    } ) }
                </div>
                <AutoComplete
                    searchText={searchText}
                    onNewRequest={requestAdd}
                    onUpdateInput={updateSearchText}
                    floatingLabelText={searchLabel}
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={autocompleteData}
                    openOnFocus={true}
                    dataSourceConfig={{ value: 'valueKey', text: 'textKey' }}
                />
            </div>
        );
    }
}

export default TagSelector;
