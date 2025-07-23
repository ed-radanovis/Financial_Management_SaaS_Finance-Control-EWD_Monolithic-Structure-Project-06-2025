"use client";

import { useEffect, useState } from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/app/_components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	tableClassName?: string;
}

interface TableMeta {
	isMobilePortrait: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	tableClassName,
}: DataTableProps<TData, TValue>) {
	const [isMounted, setIsMounted] = useState(false);
	const [isMobilePortrait, setIsMobilePortrait] = useState(false);
	const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

	const table = useReactTable<TData>({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			isMobilePortrait,
		} as TableMeta,
	});

	useEffect(() => {
		setIsMounted(true);
		const handleResize = () => {
			const width = window.innerWidth;
			const isPortrait = window.matchMedia("(orientation: portrait)").matches;
			const mobilePortrait = width <= 767 && isPortrait;
			setIsMobilePortrait(mobilePortrait);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, []);

	if (!isMounted) return null;

	if (isMobilePortrait) {
		// Mobile Portrait Layout
		return (
			<div className="mobile-data-list">
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<div
							key={row.id}
							className={`bg-card transition-colors ${
								selectedRowId === row.id
									? "bg-muted/50"
									: "bg-transparent shadow-md shadow-gray-800"
							}`}
							onTouchStart={() => setSelectedRowId(row.id)}
						>
							{row.getVisibleCells().map((cell) => {
								const dataLabel = cell.column.columnDef.header as string;
								if (dataLabel === "Ações") {
									return (
										<div
											key={cell.id}
											className="flex w-full items-center justify-center px-4"
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</div>
									);
								}
								if (dataLabel === "Nome" || dataLabel === "Valor") {
									return (
										<div
											key={cell.id}
											className="flex flex-col items-center px-4 py-0 text-center"
										>
											<span className="font-medium text-muted-foreground">
												{dataLabel}:
											</span>
											<span className="text-base font-semibold">
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</span>
										</div>
									);
								}
								if (dataLabel === "Tipo") {
									const nextHeader = "Categoria";
									const nextCell = row
										.getVisibleCells()
										.find((c) => c.column.columnDef.header === nextHeader);
									const subcatCell = row
										.getVisibleCells()
										.find((c) => c.column.columnDef.header === "Subcategoria");
									return (
										<div key={cell.id} className="flex justify-between px-4 pb-2 pt-2">
											<div className="flex-1 text-center">
												<span className="text- font-medium text-muted-foreground">
													{dataLabel}:
												</span>
												<div>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</div>
											</div>
											{nextCell && (
												<div className="flex-1 text-center">
													<span className="text- font-medium text-muted-foreground">
														{(nextCell.column.columnDef.header as string) + ":"}
													</span>
													<div className="mt-1">
														{flexRender(
															nextCell.column.columnDef.cell,
															nextCell.getContext(),
														)}
													</div>
												</div>
											)}
											{subcatCell && (
												<div className="flex-1 text-center">
													<span className="text- font-medium text-muted-foreground">
														Subcategoria:
													</span>
													<div className="mt-1">
														{flexRender(
															subcatCell.column.columnDef.cell,
															subcatCell.getContext(),
														)}
													</div>
												</div>
											)}
										</div>
									);
								}
								if (dataLabel === "Método de Pagamento") {
									const nextHeader = "Data";
									const nextCell = row
										.getVisibleCells()
										.find((c) => c.column.columnDef.header === nextHeader);
									return (
										<div key={cell.id} className="flex flex-col px-8 py-2">
											<div className="text-center">
												<span className="text- font-medium text-muted-foreground">
													{dataLabel}:
												</span>
												<div>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</div>
											</div>
											{nextCell && (
												<div className="mt-1 text-center">
													<span className="text- font-medium text-muted-foreground">
														{(nextCell.column.columnDef.header as string) + ":"}
													</span>
													<div>
														{flexRender(
															nextCell.column.columnDef.cell,
															nextCell.getContext(),
														)}
													</div>
												</div>
											)}
										</div>
									);
								}
								return null;
							})}
						</div>
					))
				) : (
					<div className="py-6 text-center text-gray-500">No results.</div>
				)}
			</div>
		);
	}

	// Desktop Layout
	return (
		<div className="rounded-md border">
			<Table className={tableClassName}>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="// Nome // Tipo // Categoria // Subcategoria // Método de Pagamento // Data // Valor // Ações px-0.5 py-0.5 text-center text-[9px] sm:text-[10px] md:text-xs xl:text-base [&:nth-child(1)]:w-[20%] [&:nth-child(1)]:min-w-[65px] [&:nth-child(2)]:w-[12%] [&:nth-child(2)]:min-w-[40px] [&:nth-child(3)]:w-[12%] [&:nth-child(3)]:min-w-[40px] [&:nth-child(4)]:w-[12%] [&:nth-child(4)]:min-w-[40px] [&:nth-child(5)]:w-[16%] [&:nth-child(5)]:min-w-[55px] [&:nth-child(6)]:w-[12%] [&:nth-child(6)]:min-w-[40px] [&:nth-child(7)]:w-[10%] [&:nth-child(7)]:min-w-[45px] [&:nth-child(8)]:w-[10%] [&:nth-child(8)]:min-w-[45px]"
								>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className="// Nome pode quebrar // Data pode quebrar overflow-hidden text-ellipsis whitespace-nowrap px-0.5 py-0.5 text-center text-[9px] sm:text-[10px] md:text-xs xl:text-base [&:nth-child(1)]:whitespace-normal [&:nth-child(6)]:whitespace-normal"
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
