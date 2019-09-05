import React, { Component, Fragment } from 'react';
import { Icon, IconSettings, Card, Button, DataTable, DataTableColumn, DataTableRowActions, Dropdown }  from '@salesforce/design-system-react';
import Loading from './Loading';
import queryString from 'query-string';
// import moment from 'moment';
// import * as api from '../api/api';
import './FileApiView.js';
import AddFileDialog from './AddFileDialog';
import { isTemplateElement } from '@babel/types';
import Style from './FileApiView.css';

class FileApiView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: props.connection,
      parentId: null,
      sessionExpired: false,
      isBusy: true,
      isDirty: false,
      fileToDelete: null,
      showDeletePrompt: false,
      embedded: (window.FX && window.FX.SALESFORCE && window.FX.SALESFORCE.embedded) || (queryString.parse(document.location.search).embedded && JSON.parse(queryString.parse(document.location.search).embedded)) || false,
      sObjectId: (window.FX && window.FX.SALESFORCE && window.FX.SALESFORCE.currentObjectId) || queryString.parse(document.location.search).id
    };
  }
  handleRowAction = (item, action) => {
    console.log(item, action);
  };

  render() {

    
    return (
      <IconSettings iconPath="/assets/icons">
        <div className="slds-grid slds-grid_vertical component-container">
          <Card
          heading="Files"
          icon={<Icon category="standard" name="document" size="small" />}
          headerActions={
            (<Button
              label="Attach File"
              onClick={this.handleRowAction}
              />
            )
          }
          >

            <DataTable>
              <DataTableColumn
                label="Title" />
              <DataTableColumn
                label="Owner" />
              <DataTableColumn
                label="Last Modified" />
              <DataTableColumn
                label="Size" />
            </DataTable>
            <DataTableRowActions
            options={[
              {label: "Preview"},
              {label: "Delete"},
              {label: "Dowload"}
            ]}
            menuPostion="overflowBoundaryElement"
            onAction={this.handleRowAction}
            dropdown={<Dropdown dir="rtl" />}
            />
          </Card>
        </div>
      </IconSettings>
    
    )
  }



}

export default FileApiView;
