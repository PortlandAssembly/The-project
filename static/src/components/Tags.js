import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import * as actionCreators from '../actions/tags';

function mapStateToProps(state) {
    return {
        isFetching: state.tags.isFetching,
        loaded: state.tags.loaded,
        tags: state.tags.tags,
        types: [ 'location', 'skill', 'interest' ],
        newTag: {
            tag_type: '',
            tag_name: ''
        }
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Tags extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchTags } = this.props;
        //this.setState({
        //});
        fetchTags();
    }

    handleUpdateNewTagTypeField = (event, i, value) => {
        const { newTag } = this.props;
        newTag['tag_type'] = value;
        this.setState({ newTag });
    }

    updateNewTagNameField = (event, value) => {
        const { newTag } = this.props;
        newTag['tag_name'] = value;
        this.setState({ newTag });
    }

    render() {
        const { isFetching, loaded, tags, types, handleCreateTag, handleDeleteTag } = this.props;
        const { newTag } = this.props;
        return (
            <div className="col-md-8">
                <h1>{ tags.length } Tags</h1>
                <Divider inset={false} />
                <Paper zDepth={2} style={{marginTop: '10px', padding: '5px 10px 10px'}}>
                    <div className="row">
                        <div className="container-fluid">
                            <h4 className="col-md-2">Add new Tag</h4>
                            <div className="col-md-4">
                                <SelectField 
                                    name="tag_type"
                                    fullWidth={true}
                                    value={newTag.tag_type}
                                    onChange={this.handleUpdateNewTagTypeField}
                                    floatingLabelText="Tag Type" >
                                    { types.map( type => (
                                        <MenuItem value={type} primaryText={type} >{type}</MenuItem>
                                        ) ) }
                                </SelectField>
                            </div>
                            <div className="col-md-4">
                                <TextField 
                                    name="tag_name" 
                                    value={newTag.tag_name}
                                    onChange={this.updateNewTagNameField}
                                    fullWidth={true} 
                                    floatingLabelText="Tag Name" />
                            </div>
                            <div className="col-md-1">
                                <RaisedButton 
                                    label="Save Changes" 
                                    primary={true} 
                                    onTouchTap={() => handleCreateTag(newTag)}
                                    />
                            </div>
                        </div>
                    </div>
                </Paper>
                <List> 
                    { types.map( type => {
                        const tagsOfType = tags.filter( tag => tag.tag_type === type );
                        return (
                            <ListItem key={type} className="container">
                                <h2>{ type }</h2>
                                { tagsOfType.map( tag => {
                                    return (
                                        <Chip key={tag.id} 
                                            style={{
                                                float: 'left',
                                                marginRight: '0.25em'
                                            }}
                                            onRequestDelete={() => handleDeleteTag(tag)} >
                                                { tag.tag_type }: { tag.tag_name }
                                        </Chip>
                                    ) }
                                 ) }
                            </ListItem>
                        );
                    } ) }
                </List>
                <hr />
            </div>
        );
    }
}

export default Tags;
