import { Table, TableHeader, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableRow } from "../ui/table"
import { type ColumnDef } from "@tanstack/react-table"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  tableData: TData[]
}

export function DataTable() {

}
