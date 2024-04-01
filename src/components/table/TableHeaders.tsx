import { ActionIcon, Checkbox, Group, Table } from "@mantine/core";
import {
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import { RecordModel } from "pocketbase";
import {
  type SortState,
  type UseTableColumn,
  type UseTableRow,
} from "../../hooks/useTable";
import { transformCamelToTitle } from "../../utils/strings";

export function TableHeaderSorted<TModel extends RecordModel>(
  props: Readonly<{
    sortStates: SortState[];
    setSortStates: (sortStates: SortState[]) => void;
    column: UseTableColumn<TModel>;
  }>
) {
  const sort = props.sortStates.find((s) => s.name === props.column.name);
  const sortIndex = sort ? props.sortStates.indexOf(sort) : -1;

  return (
    <Table.Th key={props.column.name}>
      <Group gap="0" wrap="nowrap">
        {props.column.header ?? transformCamelToTitle(props.column.name)}
        <ActionIcon
          variant="transparent"
          c={
            props.sortStates.find((s) => s.name === props.column.name)
              ? "brand.3"
              : "inherit"
          }
          onClick={(e) => {
            e.preventDefault();
            if (sortIndex === -1) {
              props.setSortStates([
                ...props.sortStates,
                { name: props.column.name, direction: "asc" },
              ]);
            } else if (sortIndex !== -1 && sort?.direction === "asc") {
              props.setSortStates([
                ...props.sortStates.slice(0, sortIndex),
                { name: props.column.name, direction: "desc" },
                ...props.sortStates.slice(sortIndex + 1),
              ]);
            } else {
              props.setSortStates(
                props.sortStates.filter((s) => s.name !== props.column.name)
              );
            }
          }}
        >
          {sort?.direction === "asc" || !sort ? (
            <IconSortAscendingLetters size={16} />
          ) : (
            <IconSortDescendingLetters size={16} />
          )}
        </ActionIcon>
      </Group>
    </Table.Th>
  );
}

export function TableHeaderUnsorted(props: Readonly<{ text: string }>) {
  return (
    <Table.Th key={props.text}>
      <Group gap="0" wrap="nowrap">
        {props.text}
      </Group>
    </Table.Th>
  );
}

export function TableHeaderSelect<TModel extends RecordModel>(
  props: Readonly<{
    selected: string[];
    setSelected: (selecteds: string[]) => void;
    rows: UseTableRow<TModel>[];
  }>
) {
  return (
    <Table.Th key="select">
      <Checkbox
        size="xs"
        checked={
          props.selected.length === props.rows.length && props.rows.length > 0
        }
        indeterminate={
          props.selected.length > 0 && props.selected.length < props.rows.length
        }
        onChange={() => {
          props.setSelected(props.rows.map((row) => row.data.id));
        }}
      />
    </Table.Th>
  );
}
