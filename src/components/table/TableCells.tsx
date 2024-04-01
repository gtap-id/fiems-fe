import { ActionIcon, Checkbox, Switch, Table, Tooltip } from "@mantine/core";
import { RecordModel } from "pocketbase";
import { type UseTableAction } from "../../hooks/useTable";
import { pb } from "../../libs/pocketbase";

export function TableSelectCell(props: {
  value: boolean;
  disabled: boolean;
  setValue: (newValue: boolean) => void;
}) {
  return (
    <Table.Td key="select">
      <Checkbox
        size="xs"
        checked={props.value}
        disabled={props.disabled}
        onChange={(e) => props.setValue(e.currentTarget.checked)}
      />
    </Table.Td>
  );
}

export function TableStatusCell(props: {
  value: boolean;
  row: RecordModel;
  reload: () => void;
}) {
  return (
    <Table.Td key="status">
      <Switch
        checked={props.value}
        size="sm"
        styles={{
          track: {
            backgroundColor: props.value
              ? "var(--mantine-color-green-5)"
              : "var(--mantine-color-red-5)",
            border: 0,
          },
          thumb: {
            border: 0,
          },
        }}
        onChange={(e) => {
          pb.collection(props.row.collectionName)
            .update(props.row.id, { status: e.currentTarget.checked })
            .then(props.reload);
        }}
      />
    </Table.Td>
  );
}

export function TableActionsCell<TModel extends RecordModel>(props: {
  actions: UseTableAction<TModel>[];
  row: TModel;
}) {
  return (
    <Table.Td key="actions">
      <ActionIcon.Group>
        {props.actions.map((action) => (
          <Tooltip key={action.name} label={action.name}>
            <ActionIcon
              color={action.color}
              onClick={() => action.onClick(props.row)}
            >
              <action.icon size={16} />
            </ActionIcon>
          </Tooltip>
        ))}
      </ActionIcon.Group>
    </Table.Td>
  );
}
