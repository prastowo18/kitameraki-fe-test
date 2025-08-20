import { ReactElement, useId, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumnDefinition,
  TableHeader,
  TableHeaderCell,
  TableRow,
  createTableColumn,
  useTableColumnSizing_unstable,
  useTableFeatures,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  TableSelectionCell,
  Button,
  Select,
} from '@fluentui/react-components';

type CellRenderer<T> = (item: T) => ReactElement;

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export type DynamicColumn<T> = {
  id: string;
  header: string | ReactElement;
  render: CellRenderer<T>;
  sizing?: {
    minWidth?: number;
    idealWidth?: number;
    defaultWidth?: number;
  };
};

interface DynamicTableProps<T> {
  columns: DynamicColumn<T>[];
  items: T[];
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DynamicTable<T extends { id: string }>({
  columns,
  items,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  pagination,
  onPageChange,
  onPageSizeChange,
}: DynamicTableProps<T>) {
  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  const selectId = useId();

  const allRowsSelected =
    selectedRows.length === items.length && items.length > 0;
  const someRowsSelected = selectedRows.length > 0 && !allRowsSelected;

  const toggleAllRows = () => {
    const newSelection = allRowsSelected ? [] : items.map((x) => x.id);
    onSelectionChange?.(newSelection);
  };

  const toggleRow = (id: string) => {
    const newSelection = selectedRows.includes(id)
      ? selectedRows.filter((r) => r !== id)
      : [...selectedRows, id];
    onSelectionChange?.(newSelection);
  };

  const columnDefs: TableColumnDefinition<T>[] = useMemo(() => {
    return columns.map((c) =>
      createTableColumn<T>({
        columnId: c.id,
        renderHeaderCell: () => <>{c.header}</>,
      })
    );
  }, [columns]);

  const columnSizingOptions = useMemo(
    () =>
      columns.reduce(
        (acc, c) => ({
          ...acc,
          [c.id]: c.sizing ?? {},
        }),
        {}
      ),
    [columns]
  );

  const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
    {
      columns: columnDefs,
      items,
    },
    [
      useTableColumnSizing_unstable({
        columnSizingOptions,
        autoFitColumns: false,
      }),
    ]
  );

  const rows = getRows();

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          ref={tableRef}
          {...columnSizing_unstable.getTableProps()}
          noNativeElements
        >
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableSelectionCell
                  checked={
                    allRowsSelected ? true : someRowsSelected ? 'mixed' : false
                  }
                  onClick={toggleAllRows}
                  checkboxIndicator={{ 'aria-label': 'Select all rows' }}
                />
              )}
              {columnDefs.map((col) => (
                <Menu openOnContext key={col.columnId}>
                  <MenuTrigger>
                    <TableHeaderCell
                      {...columnSizing_unstable.getTableHeaderCellProps(
                        col.columnId
                      )}
                    >
                      {col.renderHeaderCell()}
                    </TableHeaderCell>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem
                        onClick={(e) =>
                          columnSizing_unstable.enableKeyboardMode(
                            col.columnId
                          )(e)
                        }
                      >
                        Keyboard Column Resizing
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '10px',
                    color: '#888',
                  }}
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ item }, idx) => (
                <TableRow key={item.id ?? idx}>
                  {selectable && (
                    <TableSelectionCell
                      checked={selectedRows.includes(item.id)}
                      onClick={() => toggleRow(item.id)}
                      checkboxIndicator={{
                        'aria-label': `Select row ${item.id}`,
                      }}
                    />
                  )}
                  {columns.map((c) => (
                    <TableCell
                      key={c.id}
                      {...columnSizing_unstable.getTableCellProps(c.id)}
                    >
                      {c.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor={selectId}>Rows per page:</label>
          <Select
            id={selectId}
            value={pageSize}
            disabled={items.length === 0}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            size="small"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || items.length === 0}
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx + 1}
              onClick={() => onPageChange(idx + 1)}
              size="small"
              disabled={items.length === 0}
              style={{
                fontWeight: page === idx + 1 ? 'bold' : 'normal',
                margin: '0 4px',
              }}
            >
              {idx + 1}
            </Button>
          ))}

          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || items.length === 0}
            size="small"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
