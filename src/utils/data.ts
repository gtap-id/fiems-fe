import { parse, unparse } from "papaparse";
import { RecordModel } from "pocketbase";
import { UseTableRow } from "../hooks/useTable";
import { pb } from "../libs/pocketbase";

export async function importCSV<TModel extends RecordModel>(
  file: File,
  collectionName: TModel["collectionName"]
) {
  const result = parse<object>(await file.text(), {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length > 0) {
    throw result.errors[0];
  }
  for (const row of result.data) {
    const rowMapped = row as Record<string, unknown>;
    Object.keys(rowMapped).forEach((key) => {
      if (rowMapped[key] === "Active") {
        rowMapped[key] = true;
      } else if (rowMapped[key] === "Inactive") {
        rowMapped[key] = false;
      }
    });

    await pb.collection<TModel>(collectionName).create(rowMapped as TModel);
  }
}

export async function exportCSV<TModel extends RecordModel>(
  rows: UseTableRow<TModel>[],
  fileName: string,
  map: (before: TModel) => object
) {
  const csvContent = unparse(
    rows.map((row) => map(row.data)),
    { header: true,  }
  );

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(
    new Blob([csvContent], { type: "text/csv;charset=utf-8" })
  );
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  link.remove();
}
