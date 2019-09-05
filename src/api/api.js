import { CONTENTDOCUMENTLINK_FILEDS } from '../constants';
import axios from 'axios';
import { buildNumber } from '../version.json';
export const appVersion = buildNumber;
const apiVersion = 'v44.0';


export const globalDescribe = (connection) => {
  return connection
    .describeGlobal()
    .then(({ sobjects }) => {
      sobjects.reduce((descriptions, sobject) => {
        descriptions[sobject.keyPrefix] = sobject;
        return descriptions;
      }, descriptions);

      return sobjects
    });
};

let acls = {};
export const hasPermission = (permission) => {
  return acls[permission]
};

export const descriptions = {};

export const fetchDescription = (connection, sobject) => {
  if (descriptions[sobject]) return Promise.resolve(descriptions[sobject]);
  descriptions[sobject] = null;

  return connection
    .sobject(sobject)
    .describe()
    .then(result => {
      result.fieldMap = result.fields.reduce(function(map, field) {
        map[field.name] = field;
        return map;
      }, {});

      var objKey = sobject.toLowerCase();
      var aliasKey = objKey.replace(/__c$/,'').replace(/^\w*__/,'').replace(/_/g,'');

      var obj = result;
      if(objKey !== aliasKey){
        acls[aliasKey + '_read'] = !!obj;
        acls[aliasKey + '_create'] = (obj && obj.createable) || false;
        acls[aliasKey + '_update'] = (obj && obj.updateable) || false;
        acls[aliasKey + '_delete'] = (obj && obj.deletable) || false;
      }

      acls[objKey + '_read'] = !!obj;
      acls[objKey + '_create'] = (obj && obj.createable) || false;
      acls[objKey + '_update'] = (obj && obj.updateable) || false;
      acls[objKey + '_delete'] = (obj && obj.deletable) || false;

      return (descriptions[sobject] = result);
    })
    .catch(error => {
      console.log(`%c>>>>  Error fetching description: `, `background-color: red; color:yellow;`, sobject, error);
      return null;
    });
};

export const getObjectInfo = (connection, sobject, id) => {
  return connection
    .sobject(sobject)
    .select('Name, FX5__Tracking_Number__c')
    .where(`Id = '${id}'`)
    .execute({ autoFetch: true })
    .then(records => {
      const rec = records[0];
      return rec.FX5__Tracking_Number__c;
    });
};



// ############################################################################

export const fetchFiles = (connection, sobjectId, embedded) => {
  let sortOpts = ['ContentDocument.LatestPublishedVersion.SystemModStamp DESC', 'SystemModStamp DESC'];
  if (embedded) {
    // sort by FX5__Sync__c first, so synced files show first in compact view
    sortOpts.splice(0,0,'ContentDocument.LatestPublishedVersion.FX5__Sync__c DESC');
  }
  return connection
    .sobject('ContentDocumentLink')
    .select(CONTENTDOCUMENTLINK_FILEDS.join(', '))
    .where(`LinkedEntityId = '${sobjectId}'`)
    .sort(sortOpts.join(','))
    .execute()
    .then(result => {
      console.log('fetchFiles:', result);
      return result;
    });
};


export const toggleSyncFlag = (connection, file) => {
  return connection
    .sobject('ContentVersion')
    .update({Id: file.Id, FX5__Sync__c: file.FX5__Sync__c})
    .then(result => {
      if (!result.success) {
        console.error(result.errors);
        return result.errors;
      }

      return result.success;
    });
}

// download: https://mobileteam--c.documentforce.com/sfc/servlet.shepherd/version/download/0680H0000055age?asPdf=false&operationContext=CHATTER
// download: https://mobileteam--c.documentforce.com/sfc/servlet.shepherd/version/download/0680H0000055aAs?asPdf=false&operationContext=CHATTER
export const deleteFile = (connection, fileInfo) => {
  return connection
    .sobject('ContentDocument')
    .destroy(fileInfo.ContentDocument.Id)
    .then(result => {
      if (!result.success) {
        console.error(result.errors);
        return result.errors;
      }

      return result.success;
    })
    .catch(err => {
      console.log(`%c>>>> error deleteFile `, `background-color: yellow; color:green;` , err, fileInfo );
    })
};


export const uploadFile = (connection, parentId, contentVersionData, onUploadProgress) => {
  if(!contentVersionData) return Promise.reject();

  var requestConfig = {
        headers: {
          ContentType: 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${connection.accessToken}`
        },
        onUploadProgress: onUploadProgress || function noOp() {}
      };

  return new Promise(function(resolve, reject) {

    return axios.post(`${appVersion === 'DEV' ? connection.instanceUrl : ''}/services/data/${apiVersion}/sobjects/ContentVersion/`, contentVersionData, requestConfig)
      .then(function(){
        console.log(`>>>> File uploaded successfully : `, contentVersionData.Title);
      })
      .catch(function(err) {
        // Unauthorized has no shape, it's just the string, "Unauthorized"
        // if (err.response && err.response.status === 401) throw err.response;
        // var error = (err.response && err.response.data && err.response.data[0] && (err.response.data[0].errorCode + ': ' + err.response.data[0].message)) || err;
        var error = (err.response && err.response.data && err.response.data[0]) || err;
        reject(error);
      })
      .then(resolve,reject);
  });
}

