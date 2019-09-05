// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useFields, useInitialFields, useProcessedRows, useMetadata, useDebounce } from '../hooks';
// import { LightningContext } from '.';
// import { cleanParentsOnDelete } from '../../helpers';
// import { fetchRows, fetchCount } from '../../api/fetchRows';

// export const DataContext = createContext();

// export const DataContextProvider = props => {
//   const { dataService, handleLightningSelect, settings } = useContext(LightningContext);
//   const [page, setPage] = useState(0);
//   const [rows, setRows] = useState([]);
//   const [countOfRows, setCountOfRows] = useState(0);
//   const [rowsLoading, setRowsLoading] = useState(false);
//   const [rowsError, setRowsError] = useState(null);
//   const [gridMeta, setGridMeta] = useState({
//     rowCount: 0,
//     totalLoaded: 0,
//   });
//   const [selectedRowIds, setSelectedRowIds] = useState([]);
//   const [successfulDelete, setSuccessfulDelete] = useState(false);
//   const [fields, shouldUpdate, setShouldUpdate, readOnlyRow] = useFields();
//   const { fieldsWarning } = useInitialFields();

//   const processedRows = useProcessedRows(rows, fields);
//   const [expanded, setExpanded] = useState({ expandedRows: {}, rows: [] });
//   const [filters, setFilters] = useState({});
//   const [queryFilters, setQueryFilters] = useState({});
//   const [sortSettings, setSortSettings] = useState({
//     field: settings.initialSortColApiName && settings.initialSortColApiName.trim(),
//     direction: settings.initialSortDirection,
//   });
//   const { description, fieldDescriptions, childRelationships } = useMetadata();
//   const debouncedFilters = useDebounce(queryFilters, 1500);

//   useEffect(() => {
//     const unsupportedFilterTypes = ['double', 'percent', 'currency', 'datetime', 'date', 'time'];
//     const newFilters = {};
//     let changed = false;
//     Object.keys(filters).forEach(key => {
//       if (!unsupportedFilterTypes.includes(filters[key].column.type)) {
//         newFilters[key] = filters[key];
//         if (!queryFilters[key] || queryFilters[key].rawValue !== filters[key].rawValue)
//           changed = true;
//       }
//     });
//     if (changed) setQueryFilters(newFilters);
//   }, [filters, queryFilters]);

//   useEffect(() => {
//     if (!settings.fieldsList || !fieldDescriptions || !childRelationships) return;
//     let canceled = false;
//     setRowsLoading(true);

//     const params = {
//       ...settings,
//       rowLimit: (page + 1) * settings.rowsPerPage,
//       filters: debouncedFilters,
//       fieldDescriptions,
//       childRelationships,
//       dataService,
//       sortSettings,
//     };
//     Promise.all([fetchRows(params), fetchCount(params)])
//       .then(([data, count]) => {
//         if (canceled) return;
//         setRows(data);
//         setCountOfRows(count);
//         setExpanded({ expandedRows: {}, rows: [] });
//         setGridMeta({ rowCount: count, totalLoaded: params.rowLimit >= count });
//       })
//       .catch(e => {
//         setRowsError(e);
//       })
//       .then(() => setRowsLoading(false));
//     return () => {
//       canceled = true;
//     };
//   }, [
//     fields,
//     debouncedFilters,
//     fieldDescriptions,
//     childRelationships,
//     page,
//     dataService,
//     settings,
//     sortSettings,
//   ]);

  
//   const value = {
//     countOfRows,
//     fields,
//     shouldUpdate,
//     setShouldUpdate,
//     readOnlyRow,
//     filters,
//     setFilters,
//     sortSettings,
//     setSortSettings,
//     fieldsWarning,
//     pluralLabel: description && description.labelPlural,
//     rows: {
//       rows: processedRows,
//       rowsLoading,
//       setRowsError,
//       rowsError,
//       setRows,
//       gridMeta,
//       handleRowDelete,
//       setSuccessfulDelete,
//       successfulDelete,
//     },
//     pages: {
//       page,
//       setPage,
//     },
//     expanded,
//     setExpanded,
//     selected: {
//       selectedRowIds,
//       setSelectedRowIds,
//     },
//   };

//   return <DataContext.Provider value={value} {...props} />;
// };
