import React from 'react';
import ReactDOM from 'react-dom';
import { IconSettings } from '@salesforce/design-system-react';
import {
  LightningContextProvider,
  UserContextProvider,
  DataContextProvider,
} from './components/Context';
import App from './App';
import { DESIGN_ATTRIBUTES } from './constants';

export default function LightningComponent({ children, dataService, settings, events }) {
  return (
    <LightningContextProvider dataService={dataService} settings={settings} events={events}>
      <UserContextProvider>
        <DataContextProvider>
          <IconSettings iconPath="/_slds/assets/icons">
            <App dataService={dataService} events={events} settings={settings} />
            {children}
          </IconSettings>
        </DataContextProvider>
      </UserContextProvider>
    </LightningContextProvider>
  );
}

export function init(component, eventService) {
  const containerElement = component.find('root').getElement();
  const aura = window.$A;
  function wrap(method, params, needsParse) {
    return new Promise((resolve, reject) => {
      const action = component.get(`c.${method}`);
      if (params) action.setParams(params);

      action.setCallback(this, function setResponseCallback(response) {
        if (response.getState() === 'SUCCESS') {
          //we have to json parse because metadata types are unsupported by AuraEnabled endpoints
          const returnValue = response.getReturnValue();
          resolve(needsParse ? JSON.parse(returnValue) : returnValue);
        }
        if (response.getState() === 'ERROR') {
          reject(response.getError()[0]);
        }
      });

      aura.getCallback(function enqueueAction() {
        aura.enqueueAction(action);
      })();
    });
  }

  const dataService = {
    describe: sobjectType => wrap('describe', { sobjectType }, true),
    describeChildRelationships: sobjectType =>
      wrap('describeChildRelationships', { sobjectType }, true),
    describeFields: sobjectType => wrap('describeFields', { sobjectType }, true),
    describePicklist: (sobjectType, fieldName) =>
      wrap('describePicklist', { sobjectType, fieldName }, true),
    query: soql => wrap('query', { soql }),
    queryCount: soql => wrap('countQuery', { soql }),
    apexRest: (method, payload) => wrap('restEndpoint', { method, payload }),
    getUser: () => wrap('fetchUser', null, true),
  };

  const settings = DESIGN_ATTRIBUTES.reduce(
    (settings, { name }) => {
      settings[name] = component.get(`v.${name}`);
      return settings;
    },
    { componentId: component.getGlobalId() },
  );

  ReactDOM.render(
    <LightningComponent dataService={dataService} settings={settings} events={eventService} />,
    containerElement,
  );
}
