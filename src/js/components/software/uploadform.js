import React from 'react';
var AppStore = require('../../stores/app-store');

import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

var UploadForm = React.createClass({
  getInitialState: function() {
    return {
      groups: AppStore.getGroups()
    };
  },
  _handleFieldChange: function(field, e) {
    var newState = {};
    newState[field] = e.target.value;
    this.setState({newImage: newState});
  },
  render: function() {

    var groupItems = [];
    for (var i=0; i<this.state.groups.length;i++) {
      var tmp = { payload:this.state.groups[i].id, text: this.state.groups[i].name };
      groupItems.push(tmp);
    }
    return (
      <form>

        <TextField
          hintText="Name"
          floatingLabelText="Name" 
          onChange={this._handleFieldChange.bind(null, 'software')}
          errorStyle={{color: "rgb(171, 16, 0)"}}/>

        <p><input type="file" /></p>

        <TextField
          value="Acme Model 1"
          floatingLabelText="Device compatibility"
          onChange={this._handleFieldChange.bind(null, 'device_type')}
          errorStyle={{color: "rgb(171, 16, 0)"}} />

        <TextField
          hintText="Description"
          floatingLabelText="Description" 
          multiLine={true}
          style={{display:"block"}}
          errorStyle={{color: "rgb(171, 16, 0)"}}
          onChange={this._handleFieldChange.bind(null, 'description')} />
      </form>
    );
  }
});


module.exports = UploadForm;