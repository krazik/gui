import React from 'react';
import { Link } from 'react-router';
var Time = require('react-time');
var AppActions = require('../../actions/app-actions');

// material ui
var mui = require('material-ui');
var Table = mui.Table;
var TableHeader = mui.TableHeader;
var TableHeaderColumn = mui.TableHeaderColumn;
var TableBody = mui.TableBody;
var TableRow = mui.TableRow;
var TableRowColumn = mui.TableRowColumn;
var FlatButton = mui.FlatButton;
var List = mui.List;
var ListItem = mui.ListItem;
var Divider = mui.Divider;
var FontIcon = mui.FontIcon;
var Checkbox = mui.Checkbox;

var mockSuccess = [
    {
        "id": "00a0c91e6-7dec-11d0-a765-f81d4faebf3",
        "finished": "2016-03-25 00:13:00 +0000 UTC",
        "status": "success",
        "started": "2016-03-24 24:00:00 +0000 UTC",
        "model": "Raspberry Pi 3",
        "version_from": "Application 0.1"
    },
    {
        "id": "00a0c91e6-7dec-11d0-a765-f81d4faebf2",
        "finished": "2016-03-25 00:12:00 +0000 UTC",
        "status": "success",
        "started": "2016-03-24 24:00:00 +0000 UTC",
        "model": "Raspberry Pi 3",
        "version_from": "Application 0.1"
    },
    {
        "id": "00a0c91e6-7dec-11d0-a765-f81d4faebf1",
        "finished": "2016-03-25 00:04:00 +0000 UTC",
        "status": "success",
        "started": "2016-03-24 24:00:00 +0000 UTC",
        "model": "Raspberry Pi 3",
        "version_from": "Application 0.1"
    }
];

var Report = React.createClass({
  getInitialState: function() {
    return {
      failsOnly: this.props.update.status === "Failed",
      stats: {
        failure: null
      }
    };
  },
   componentDidMount: function() {
    if (this.props.update.id === "00a0c91e6-7dec-11d0-a765-f81d4faebf6") {
      this._updateState("devices", mockSuccess);
    } else {
      AppActions.getSingleUpdateStats(this.props.update.id, function(stats) {
        this._updateState("stats",stats);
      }.bind(this));
      AppActions.getSingleUpdateDevices(this.props.update.id, function(devices) {
        this._updateState("devices",devices);
      }.bind(this));
    }
  },
  _updateState: function (key, val) {
    var state = {};
    state[key] = val;
    this.setState(state);
  },
  _getDeviceDetails: function (id) {
    // get device details not listed in schedule data
    //return AppActions.getSingleDeviceReport(id)
  },
  _handleCheckbox: function (e, checked) {
    this.setState({failsOnly:checked});
  },
  _retryUpdate: function () {
    // replace contents of dialog, also change size, return contents and size on 'cancel'?
    this.props.retryUpdate(this.props.update);
  },
  _formatTime: function (date) {
    return date.replace(' ','T').replace(/ /g, '').replace('UTC','');
  },
  exportLog: function (id) {
    AppActions.getDeviceLog(this.props.update.id, id, function(data) {
      var content = data;
      var uriContent = "data:application/octet-stream," + encodeURIComponent(content);
      var newWindow = window.open(uriContent, 'deviceLog');
    });
  },
  render: function () {
    var deviceList = [];
    var encodedSoftware = encodeURIComponent(this.props.update.version); 
    var softwareLink = (
      <div>
        <Link style={{fontWeight:"500"}} to={`/software/${encodedSoftware}`}>{this.props.update.version}</Link>
      </div>
    )

    if (this.state.devices) {
      deviceList = this.state.devices.map(function(device, index) {
        var encodedDevice = encodeURIComponent("name="+device.id); 
        var deviceLink = (
        <div>
          <Link style={{fontWeight:"500"}} to={`/devices/0/${encodedDevice}`}>{device.id}</Link>
        </div>
        );
        //var deviceDetails = this._getDeviceDetails(device.id);
        if ((device.status==="Failed")||(this.state.failsOnly===false)){
          return (
            <TableRow key={index}>
              <TableRowColumn>{deviceLink}</TableRowColumn>
              <TableRowColumn>{device.model}</TableRowColumn>
              <TableRowColumn>{softwareLink}</TableRowColumn>
              <TableRowColumn><Time value={this._formatTime(device.finished)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
              <TableRowColumn>{device.status || "--"}</TableRowColumn>
              <TableRowColumn><FlatButton onClick={this.exportLog.bind(null, device.id)} label="Export log" /></TableRowColumn>
            </TableRow>
          )
        }
      }, this);
    }
    var status = (this.props.update.status === "inprogress") ? "In progress" : this.props.update.status;
    return (
      <div>
        <div className="report-list">
          <List>
            <ListItem disabled={true} primaryText="Group" secondaryText={this.props.update.name} />
            <Divider />
            <ListItem disabled={true} primaryText="Device type" secondaryText={this.props.update.model || "--"} />
            <Divider />
            <ListItem disabled={true} primaryText="Start time" secondaryText={<Time value={this._formatTime(this.props.update.created)} format="YYYY-MM-DD HH:mm" />} />
          </List>
        </div>
        <div className="report-list">
         <List>
            <ListItem disabled={true} primaryText="Number of devices" secondaryText={deviceList.length} />
            <Divider />
            <ListItem disabled={true} primaryText="Target software" secondaryText={softwareLink} />
            <Divider />
            <ListItem disabled={true} primaryText="End time" secondaryText={<Time value={this._formatTime(this.props.update.finished)} format="YYYY-MM-DD HH:mm" />} />
          </List>
        </div>
        <div className="report-list">
         <List>
            <ListItem 
              disabled={this.props.update.status!=='Failed'}
              primaryText="Status"
              secondaryText={<p>{status}{this.props.update.status!=='Failed' ? '' : ' - Click to retry'}</p>}
              leftIcon={<FontIcon className={this.props.update.status==="inprogress" ? "hidden" : "material-icons error-icon"}>{this.props.update.status !=='Failed' ? 'check_circle' : 'error'}</FontIcon>} 
              onTouchTap={this._retryUpdate} />
          </List>
        </div>
        <div className={this.props.update.status==='Complete' ? "hidden" : null} style={{display:"inline-block", width:"200px"}}>
          <Checkbox
            label="Show only failures"
            defaultChecked={this.props.update.status==='Failed'}
            checked={this.state.failsOnly}
            onCheck={this._handleCheckbox}
            className={this.state.stats.failure ? null : "hidden"} />
        </div>

        <div style={{minHeight:"20vh"}}>

          <Table
            className={deviceList.length ? null : "hidden"}
            selectable={false}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn tooltip="Device name">Device name</TableHeaderColumn>
                <TableHeaderColumn tooltip="Device type">Device type</TableHeaderColumn>
                <TableHeaderColumn tooltip="Target software">Updated to</TableHeaderColumn>
                <TableHeaderColumn tooltip="Update end time">End time</TableHeaderColumn>
                <TableHeaderColumn tooltip="Update status">Update status</TableHeaderColumn>
                <TableHeaderColumn tooltip=""></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}>
              {deviceList}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
});

module.exports = Report;