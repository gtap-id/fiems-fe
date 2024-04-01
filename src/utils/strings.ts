import { pb } from "../libs/pocketbase";

export function transformCamelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export class PocketbaseFilterBuilder {
  private _filters: string[] = [];
  private _groups: string[] = [];

  public addFilter(
    filter: string,
    params?: { [key: string]: unknown }
  ): PocketbaseFilterBuilder {
    this._filters.push(pb.filter(filter, params));

    return this;
  }

  public addGroup(
    group: PocketbaseFilterBuilder,
    params?: { [key: string]: unknown },
    delimeter: string = "&&"
  ): PocketbaseFilterBuilder {
    this._groups.push(`(${group.build(params, delimeter)})`);

    return this;
  }

  public build(
    params?: { [key: string]: unknown },
    delimeter: string = "&&"
  ): string {
    const raw = [...this._filters, ...this._groups].join(delimeter);
    return pb.filter(raw, params);
  }
}
