import React from 'react';
// import * as api from '../api/api';
import { Modal, Button }  from '@salesforce/design-system-react';
import './AddFileDialog.css';

export default function AddFileDialog(props) {
  const { connection, onSave, parentId } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [percentCompleted, setPercentCompleted] = React.useState(null);
  const [showPercentCompleted, setShowPercentCompleted] = React.useState(false);
  const [uploadError, setUploadError] = React.useState(null);
  const [hasNewFile, setHasNewFile] = React.useState(false);

  function uploadFile() {
    const fxFileInput = document.getElementById('fxFileInput');

  }
}
