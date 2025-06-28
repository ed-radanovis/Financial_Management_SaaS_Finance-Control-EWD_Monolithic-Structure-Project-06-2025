"use client";

import React from "react";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import {
	TRANSACTION_CATEGORY_LABELS,
	TRANSACTION_PAYMENT_METHOD_LABELS,
	TRANSACTION_SUBCATEGORY_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transaction-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";

interface TableMeta {
	isMobilePortrait: boolean;
}

export const transactionColumns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "name",
		header: "Nome",
		cell: ({ row: { original: transaction } }) => (
			<span
				className="text-[15px] font-semibold sm:text-[10px] md:text-xs md:font-semibold xl:text-base"
				data-label="Nome"
			>
				{transaction.name}
			</span>
		),
	},
	{
		accessorKey: "type",
		header: "Tipo",
		cell: ({ row: { original: transaction } }) => (
			<div className="mt-1" data-label="Tipo">
				<TransactionTypeBadge transaction={transaction} />
			</div>
		),
	},
	{
		accessorKey: "category",
		header: "Categoria",
		cell: ({ row: { original: transaction } }) => (
			<div className="flex flex-col space-y-1" data-label="Categoria">
				<span
					className="text-[15px] font-semibold sm:text-[10px] md:text-sm md:font-light xl:text-base"
					data-label="Categoria"
				>
					{TRANSACTION_CATEGORY_LABELS[transaction.category]}
				</span>
				{transaction.subcategory && (
					<span
						className="text-[12px] font-light text-muted-foreground sm:text-[9px] md:text-xs md:font-light xl:text-sm"
						data-label="Subcategoria"
					>
						{TRANSACTION_SUBCATEGORY_LABELS[transaction.subcategory]}
					</span>
				)}
			</div>
		),
	},
	{
		accessorKey: "paymentMethod",
		header: "Método de Pagamento",
		cell: ({ row: { original: transaction } }) => (
			<span
				className="text-[15px] font-semibold sm:text-[10px] md:text-xs md:font-light xl:text-base"
				data-label="Método de Pagamento"
			>
				{TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
			</span>
		),
	},
	{
		accessorKey: "date",
		header: "Data",
		cell: ({ row: { original: transaction } }) => (
			<span
				className="text-[15px] font-semibold sm:text-[10px] md:text-xs md:font-light xl:text-base"
				data-label="Data"
			>
				{new Date(transaction.date).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "long",
					year: "numeric",
				})}
			</span>
		),
	},
	{
		accessorKey: "amount",
		header: "Valor",
		cell: ({ row: { original: transaction } }) => (
			<span
				className="text-[15px] font-bold sm:text-[10px] md:text-xs md:font-semibold xl:text-base"
				data-label="Valor"
			>
				{new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(Number(transaction.amount))}
			</span>
		),
	},
	{
		accessorKey: "actions",
		header: "Ações",
		cell: ({ row, table }) => {
			const isMobilePortrait =
				(table.options.meta as TableMeta)?.isMobilePortrait || false;
			return (
				<div
					className={
						isMobilePortrait
							? "flex items-center justify-center gap-32"
							: "flex items-center justify-center gap-0 sm:gap-0.5 md:gap-1 xl:gap-4"
					}
					data-label="Ações"
				>
					<EditTransactionButton
						transaction={row.original}
						isMobilePortrait={isMobilePortrait}
					/>
					<DeleteTransactionButton
						transactionId={row.original.id}
						isMobilePortrait={isMobilePortrait}
					/>
				</div>
			);
		},
	},
];
