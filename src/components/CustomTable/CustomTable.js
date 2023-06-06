import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { strings, translateString } from '../../utilities';

/**
 * A custom table component.
 */
const CustomTable = ({
  columns,
  data,
  pages,
  loading,
  onFetchData,
  defaultPageSize,
  filterable,
  filtered,
  onFilteredChange,
}) => {
  return (
    <ReactTable
      data={data} // should default to []
      pages={pages}
      loading={loading}
      columns={columns}
      pageSize={data ? (data.length === 0 ? 2 : data.length) : 2}
      manual // informs React Table that you'll be handling sorting and pagination server-side
      onFetchData={(state, instance) => {
        onFetchData(state, instance);
      }}
      showPagination={true}
      showPaginationTop={false}
      showPaginationBottom={true}
      showPageSizeOptions={false}
      defaultPageSize={defaultPageSize}
      filterable={filterable}
      filtered={filtered}
      onFilteredChange={onFilteredChange}
      previousText={translateString(strings.table.previousText)}
      nextText={translateString(strings.table.nextText)}
      loadingText={translateString(strings.table.loadingText)}
      noDataText={translateString(strings.table.noDataText)}
      pageText={translateString(strings.table.pageText)}
      ofText={translateString(strings.table.ofText)}
      rowsText={translateString(strings.table.rowsText)}
    />
  );
};

export default CustomTable;

CustomTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  pages: PropTypes.number,
  loading: PropTypes.bool,
  onFetchData: PropTypes.func,
  defaultPageSize: PropTypes.number,
  filterable: PropTypes.bool,
  filtered: PropTypes.bool,
  onFilteredChange: PropTypes.func,
};
