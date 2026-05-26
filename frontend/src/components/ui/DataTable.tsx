import React, { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface BulkAction<T> {
  label: string;
  onClick: (selectedItems: T[]) => void;
  variant?: 'primary' | 'danger' | 'secondary';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  bulkActions?: BulkAction<T>[];
  onRowClick?: (row: T) => void;
  rowsPerPage?: number;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  bulkActions = [],
  onRowClick,
  rowsPerPage = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // 1. Sort Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // 2. Filter & Sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchTerm && searchKey) {
      result = result.filter((item) => {
        const value = item[searchKey];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Sort
    if (sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === undefined || valB === undefined) return 0;
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
        if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKey, sortKey, sortOrder]);

  // 3. Pagination
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  // Reset page when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  // 4. Selection Management
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((item) => item.id);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid row click trigger
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedIds.has(item.id));
  }, [data, selectedIds]);

  return (
    <div className="datatable-container">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        {searchKey && (
          <div className="search-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        )}

        {/* Bulk Action Controls */}
        {selectedIds.size > 0 && bulkActions.length > 0 && (
          <div className="bulk-actions-wrapper">
            <span className="selected-count">
              {selectedIds.size} selected
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {bulkActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    action.onClick(selectedItems);
                    setSelectedIds(new Set()); // Reset selection
                  }}
                  className={`btn ${
                    action.variant === 'danger'
                      ? 'btn-danger'
                      : action.variant === 'secondary'
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="table-responsive">
        <table className="sms-table">
          <thead>
            <tr>
              {bulkActions.length > 0 && (
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {col.title}
                    {col.sortable && sortKey === col.key && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {bulkActions.length > 0 && (
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedIds);
                          if (e.target.checked) {
                            newSelected.add(row.id);
                          } else {
                            newSelected.delete(row.id);
                          }
                          setSelectedIds(newSelected);
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render((row as any)[col.key], row)
                        : (row as any)[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, processedData.length)} of {processedData.length} records
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem' }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem' }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <style>{`
        .datatable-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          width: 100%;
        }
        .table-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          border-bottom: 1px solid var(--border-color);
          background-color: rgba(var(--accent-primary-rgb), 0.01);
          flex-wrap: wrap;
          gap: var(--space-md);
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-tertiary);
          pointer-events: none;
        }
        .search-input {
          padding: 0.55rem 0.8rem 0.55rem 2.2rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          border-radius: var(--radius-md);
          outline: none;
          font-size: 0.875rem;
          width: 250px;
          transition: border-color var(--transition-fast);
        }
        .search-input:focus {
          border-color: var(--accent-primary);
        }
        .bulk-actions-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .selected-count {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-primary);
        }
        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }
        .sms-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }
        .sms-table th {
          background-color: rgba(var(--accent-primary-rgb), 0.02);
          color: var(--text-secondary);
          font-weight: 600;
          padding: var(--space-md);
          border-bottom: 1px solid var(--border-color);
          user-select: none;
        }
        .sms-table td {
          padding: var(--space-md);
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
          white-space: nowrap;
        }
        .sms-table tbody tr {
          transition: background-color var(--transition-fast);
        }
        .sms-table tbody tr:hover {
          background-color: var(--bg-tertiary);
        }
        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background-color: rgba(var(--accent-primary-rgb), 0.01);
          border-top: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: var(--space-md);
        }
      `}</style>
    </div>
  );
}
