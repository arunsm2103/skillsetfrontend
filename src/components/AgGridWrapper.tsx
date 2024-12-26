'use client';

import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AgGridWrapper(props: any) {
  const defaultProps = {
    suppressCellFocus: true,
    enableCellTextSelection: true,
    animateRows: true,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true
    }
  };

  return <AgGridReact {...defaultProps} {...props} />;
} 