// FILE INI BERISI LOGIC UNTUK TABLE
// UNTUK MEMAHAMI CODE INI CUKUP SULIT

import { MantineColor, Table, Text } from "@mantine/core";
import { Icon } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ListResult, RecordModel } from "pocketbase";
import {
  ReactNode,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  TableActionsCell,
  TableSelectCell,
  TableStatusCell,
} from "../components/table/TableCells";
import {
  TableHeaderSelect,
  TableHeaderSorted,
  TableHeaderUnsorted,
} from "../components/table/TableHeaders";
import { type DeepKeyOf } from "../utils/generics";
import { deepGet, filterSearchObject } from "../utils/objects";

export type UseTableColumnType = "text" | "date" | "code";

export type UseTableColumn<TModel extends RecordModel> = {
  name: DeepKeyOf<TModel>;
  type: UseTableColumnType;
  header?: string;
  onFormat?: (value: unknown) => string;
  onClick?: (row: TModel) => void;
};

export type UseTableAction<TModel extends RecordModel> = {
  color: MantineColor;
  icon: Icon;
  name: string;
  onClick: (row: TModel) => void;
};

export type UseTableParams<TModel extends RecordModel> = {
  columns: UseTableColumn<TModel>[];
  source: (
    page: number,
    perPage: number,
    sort: string
  ) => ListResult<TModel> | Promise<ListResult<TModel>>;
  status?: boolean;
  actions?: UseTableAction<TModel>[];
  page?: number;
  perPage?: number;
};

export type UseTableHeader = {
  key: string;
  text: string;
  visible: boolean;
  node: ReactNode;
};

export type UseTableCell = {
  key: string;
  node: ReactNode;
  visible: boolean;
};

export type UseTableRow<TModel extends RecordModel> = {
  key: string;
  selected: boolean;
  cells: UseTableCell[];
  data: TModel;
};

export type UseTableReturns<TModel extends RecordModel> = {
  headers: UseTableHeader[];

  rows: UseTableRow<TModel>[];

  pageState: PageState;
  pageCount: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  search: string;
  setSearch: (query: string) => void;

  hide: (...hidden: string[]) => void;
  unhide: (...hidden: string[]) => void;

  reload: () => void;
};

export type SortState = {
  name: string;
  direction: "asc" | "desc";
};

export type PageState = {
  page: number;
  perPage: number;
};

function createCell<TModel extends RecordModel>(
  column: UseTableColumn<TModel>,
  row: TModel,
  hidden: string[]
): UseTableCell {
  let value: string = deepGet(row, column.name) as string;
  if (column.onFormat) value = column.onFormat(value);

  switch (column.type) {
    case "text":
      return {
        key: column.name,
        visible: !hidden.includes(column.name),
        node: (
          <Table.Td key={column.name}>
            <Text c="gray.8" fw="500" size="sm">
              {value || "-"}
            </Text>
          </Table.Td>
        ),
      };
    case "date":
      return {
        key: column.name,
        visible: !hidden.includes(column.name),
        node: (
          <Table.Td key={column.name}>
            <Text c="gray.8" size="sm">
              {value ? dayjs(value).format("DD/MM/YYYY") : "-"}
            </Text>
          </Table.Td>
        ),
      };
    case "code":
      return {
        key: column.name,
        visible: !hidden.includes(column.name),
        node: (
          <Table.Td
            key={column.name}
            onClick={() => {
              if (column.onClick) column.onClick(row);
            }}
          >
            <Text c="brand.3" size="sm" style={{ cursor: "pointer" }}>
              {value || "-"}
            </Text>
          </Table.Td>
        ),
      };
  }
}

type ReducerState<TModel extends RecordModel> = {
  sorts: SortState[];
  sortQuery: string;
  data: TModel[];
  pageCount: number;
  selected: string[];
  hidden: string[];
  search: string;
} & PageState;

type ReducerAction<TModel extends RecordModel> =
  | {
      type: "reload";
      result: ListResult<TModel>;
    }
  | {
      type: "select";
      id: string;
      value: boolean;
    }
  | {
      type: "selects";
      value: string[];
    }
  | {
      type: "sorts";
      value: SortState[];
    }
  | {
      type: "search";
      value: string;
    }
  | {
      type: "hide";
      value: string[];
    }
  | {
      type: "pageState";
      value: PageState;
    };

function createSortQuery(sortStates: SortState[]): string {
  return sortStates
    .map((s) => `${s.direction === "asc" ? "+" : "-"}${s.name}`)
    .join(",");
}

function reducerInitializer<TModel extends RecordModel>(
  prevState: ReducerState<TModel>
): ReducerState<TModel> {
  return {
    ...prevState,
    sortQuery: createSortQuery(prevState.sorts),
  };
}

function reducer<TModel extends RecordModel>(
  state: ReducerState<TModel>,
  action: ReducerAction<TModel>
): ReducerState<TModel> {
  if (action.type === "reload") {
    return {
      ...state,
      data: action.result.items,
      pageCount: action.result.totalPages,
      page:
        state.page > action.result.totalPages
          ? action.result.totalPages
          : state.page,
    };
  } else if (action.type === "select") {
    return {
      ...state,
      selected: action.value
        ? [...state.selected, action.id]
        : state.selected.filter((id) => id !== action.id),
    };
  } else if (action.type === "selects") {
    return {
      ...state,
      selected: action.value,
    };
  } else if (action.type === "sorts") {
    return {
      ...state,
      sorts: action.value,
      sortQuery: createSortQuery(action.value),
    };
  } else if (action.type === "search") {
    return {
      ...state,
      search: action.value,
    };
  } else if (action.type === "hide") {
    return {
      ...state,
      hidden: action.value,
    };
  } else if (action.type === "pageState") {
    return {
      ...state,
      page: action.value.page,
      perPage: action.value.perPage,
      selected: [],
    };
  }

  return state;
}

export function useTable<TModel extends RecordModel>(
  params: UseTableParams<TModel>
): UseTableReturns<TModel> {
  const { source } = params;

  const [state, dispatch] = useReducer<
    Reducer<ReducerState<TModel>, ReducerAction<TModel>>,
    ReducerState<TModel>
  >(
    reducer,
    {
      sorts: [],
      sortQuery: "",
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
      data: [],
      pageCount: 1,
      selected: [],
      hidden: [],
      search: "",
    },
    reducerInitializer
  );

  const reload = useCallback(() => {
    Promise.resolve(source(state.page, state.perPage, state.sortQuery)).then(
      (result) => dispatch({ type: "reload", result: result })
    );
  }, [source, state.page, state.perPage, state.sortQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reload(), [state.page, state.perPage, state.sortQuery]);

  const rows = useMemo<UseTableRow<TModel>[]>(() => {
    return state.data
      .map((row) => {
        const cells: UseTableCell[] = [
          {
            key: "select",
            visible: !state.hidden.includes("select"),
            node: (
              <TableSelectCell
                key="select"
                value={state.selected.includes(row.id)}
                setValue={(value) =>
                  dispatch({ type: "select", id: row.id, value })
                }
                disabled={false}
              />
            ),
          },
          ...params.columns
            .filter((column) => !state.hidden.includes(column.name))
            .map((column) => createCell(column, row, state.hidden)),
        ];

        if (params.status) {
          cells.push({
            key: "status",
            visible: !state.hidden.includes("status"),
            node: (
              <TableStatusCell
                key="status"
                row={row}
                value={row["status"]}
                reload={reload}
              />
            ),
          });
        }

        if (params.actions) {
          cells.push({
            key: "actions",
            visible: !state.hidden.includes("actions"),
            node: (
              <TableActionsCell<TModel>
                key="actions"
                actions={params.actions}
                row={row}
              />
            ),
          });
        }

        return {
          key: row.id,
          selected: state.selected.includes(row.id) || false,
          cells,
          data: row,
        };
      })
      .filter((row) => filterSearchObject(row.data, state.search));
  }, [
    state.data,
    state.hidden,
    state.selected,
    state.search,
    params.columns,
    params.status,
    params.actions,
    reload,
  ]);

  const headers = useMemo<UseTableHeader[]>(() => {
    const result: UseTableHeader[] = [
      {
        key: "select",
        text: "Select",
        visible: !state.hidden.includes("select"),
        node: (
          <TableHeaderSelect
            key="select"
            selected={state.selected}
            setSelected={(selecteds) => {
              dispatch({ type: "selects", value: selecteds });
            }}
            rows={rows}
          />
        ),
      },
      ...params.columns.map((column) => ({
        key: column.name,
        text: column.header ?? column.name,
        visible: !state.hidden.includes(column.name),
        node: (
          <TableHeaderSorted
            key={column.name}
            sortStates={state.sorts}
            setSortStates={(value) => {
              dispatch({ type: "sorts", value });
            }}
            column={column}
          />
        ),
      })),
    ];

    if (params.status) {
      result.push({
        key: "status",
        text: "Status",
        visible: !state.hidden.includes("status"),
        node: (
          <TableHeaderSorted
            key="status"
            sortStates={state.sorts}
            setSortStates={(value) => {
              dispatch({ type: "sorts", value });
            }}
            column={{
              name: "status",
              type: "text",
              header: "Status",
            }}
          />
        ),
      });
    }

    if (params.actions) {
      result.push({
        key: "actions",
        text: "Actions",
        visible: !state.hidden.includes("actions"),
        node: <TableHeaderUnsorted key="actions" text="Actions" />,
      });
    }

    return result;
  }, [
    state.hidden,
    state.selected,
    state.sorts,
    rows,
    params.columns,
    params.status,
    params.actions,
  ]);

  return useMemo(
    () => ({
      headers,
      rows,
      pageState: {
        page: state.page,
        perPage: state.perPage,
      },
      pageCount: state.pageCount,
      setPage: (page) => {
        dispatch({ type: "pageState", value: { ...state, page } });
      },
      setPerPage: (perPage) => {
        dispatch({ type: "pageState", value: { ...state, perPage } });
      },
      search: state.search,
      setSearch: (query) => {
        dispatch({ type: "search", value: query });
      },
      hide: (hidden) => {
        dispatch({ type: "hide", value: [...state.hidden, hidden] });
      },
      unhide: (unhidden) => {
        dispatch({
          type: "hide",
          value: state.hidden.filter((h) => h !== unhidden),
        });
      },
      reload,
    }),
    [headers, reload, rows, state]
  );
}
