import React from 'react';

const PRFilters = ({ filters, onFilterChange }) => {
  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sort: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleAssigneeChange = (e) => {
    onFilterChange({ ...filters, assignee: e.target.checked ? 'self' : 'all' });
  };

  const handleDateRangeChange = (e) => {
    onFilterChange({
      ...filters,
      dateRange: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>Sort by:</label>
        <select 
          value={filters.sort} 
          onChange={handleSortChange}
          style={styles.select}
        >
          <option value="updated">Last Updated</option>
          <option value="created">Created Date</option>
          <option value="comments">Most Comments</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Status:</label>
        <select 
          value={filters.status} 
          onChange={handleStatusChange}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.assignee === 'self'}
            onChange={handleAssigneeChange}
            style={styles.checkbox}
          />
          Assigned to me
        </label>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Date Range:</label>
        <select 
          value={filters.dateRange} 
          onChange={handleDateRangeChange}
          style={styles.select}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="year">Past Year</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f6f8fa',
    borderRadius: '6px',
    border: '1px solid #e1e4e8',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    color: '#24292e',
    fontWeight: '500'
  },
  select: {
    padding: '6px 12px',
    fontSize: '14px',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#24292e',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#0366d6'
    }
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#24292e',
    cursor: 'pointer'
  },
  checkbox: {
    cursor: 'pointer'
  }
};

export default PRFilters; 