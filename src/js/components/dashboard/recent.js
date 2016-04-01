import React from 'react';
var GroupDevices = require('../updates/groupdevices');

var Time = require('react-time');
var AppActions = require('../../actions/app-actions');

import { Router, Route, Link } from 'react-router';

// material ui
var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var Divider = mui.Divider;
var FontIcon = mui.FontIcon;

var Recent = React.createClass({
  getInitialState: function() {
    return {
      devices: {} 
    };
  },
  _clickHandle: function(id) {
    var params = {};
    params.id = id;
    params.route="updates";
    params.open=true;
    this.props.clickHandle(params);
  },
  _formatTime: function(date) {
    return date.replace(' ','T').replace(/ /g, '').replace('UTC','');
  },
  render: function() {
    var recent = this.props.updates.map(function(update, index) {
      if (index<5) {

        var group = (
            <span className="progress-group">
              <span>{update.name} </span>(<GroupDevices update={update.id} />)
            </span>
        );
        var last = (this.props.updates.length === index+1) || index===4;
        var status = update.status === "Failed" ? "warning" : "check";
        var icon = (
          <FontIcon className="material-icons">
            {status}
          </FontIcon>
        );
        return (
          <div key={index} className={status==="warning" ? "fail" : null}>
            <ListItem
              disabled={false}
              primaryText={update.version}
              secondaryText={group}
              onClick={this._clickHandle.bind(null, update.id)}
              leftIcon={icon}
              rightIcon={<Time style={{float:"right", position:"initial", width:"auto", marginRight:"-56", whiteSpace:"nowrap", fontSize:"14"}} value={this._formatTime(update.finished)} format="YYYY-MM-DD HH:mm" />} />
            <Divider inset={true} className={last ? "hidden" : null} />
          </div>
        )
      }
    }, this);
    return (
      <div className="updates-container">
        <div className="dashboard-header subsection">
          <h3>Recent<span className="dashboard-number">{recent.length}</span></h3>
        </div>
        <div>
          <List>
            {recent}
          </List>
          <div className={recent.length ? 'hidden' : null}>
            <p className="italic">No recent updates</p>
          </div>
          <div>
            <Link to="/updates" className="float-right">All updates</Link>
          </div>
        </div>
      </div>
    );
  }
});

Recent.contextTypes = {
  router: React.PropTypes.object
};

module.exports = Recent;