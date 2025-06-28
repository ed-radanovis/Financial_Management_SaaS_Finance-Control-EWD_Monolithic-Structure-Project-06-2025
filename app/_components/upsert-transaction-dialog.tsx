import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./money-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	TRANSACTION_CATEGORY_OPTIONS,
	TRANSACTION_PAYMENT_METHOD_OPTIONS,
	TRANSACTION_TYPE_OPTIONS,
	TRANSACTION_SUBCATEGORY_MAP,
	TRANSACTION_SUBCATEGORY_LABELS,
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-picker";
import { z } from "zod";
import {
	TransactionType,
	TransactionCategory,
	TransactionPaymentMethod,
	TransactionSubcategory,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertTransaction } from "../_actions/upsert-transaction";
import { useEffect, useState, useCallback, useMemo } from "react";

interface UpsertTransactionDialogProps {
	isOpen: boolean;
	defaultValues?: FormSchema;
	transactionId?: string;
	setIsOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
	name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
	amount: z.number({ required_error: "O valor é obrigatório." }).positive({
		message: "O valor deve ser positivo",
	}),
	type: z.nativeEnum(TransactionType, {
		required_error: "O tipo é obrigatório",
	}),
	category: z.nativeEnum(TransactionCategory, {
		required_error: "A categoria é obrigatória",
	}),
	paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
		required_error: "O método de pagamento é obrigatório",
	}),
	date: z.date({ required_error: "A data é obrigatória" }),
	subcategory: z.nativeEnum(TransactionSubcategory, {
		required_error: "A subcategoria é obrigatória",
	}),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertTransactionDialog = ({
	isOpen,
	defaultValues,
	transactionId,
	setIsOpen,
}: UpsertTransactionDialogProps) => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues ?? {
			amount: undefined,
			category: undefined,
			date: new Date(),
			name: "",
			paymentMethod: undefined,
			type: undefined,
		},
	});

	const [selectedCategory, setSelectedCategory] = useState<
		TransactionCategory | undefined
	>(defaultValues?.category);
	const [filteredSubcategories, setFilteredSubcategories] = useState<
		{ value: TransactionSubcategory; label: string }[]
	>([]);

	const subcategoryMap = useMemo(() => TRANSACTION_SUBCATEGORY_MAP, []);

	const handleCategoryChange = useCallback(
		(value: string) => {
			const category = value as TransactionCategory;
			setSelectedCategory(category);
			form.setValue("category", category);
			const subs = subcategoryMap[category] || [];
			setFilteredSubcategories(
				subs.map((sub) => ({
					value: sub,
					label: TRANSACTION_SUBCATEGORY_LABELS[sub],
				})),
			);
		},
		[form, subcategoryMap],
	);

	const handleSubcategoryChange = (value: string) => {
		form.setValue("subcategory", value as TransactionSubcategory);
	};

	const onSubmit = async (data: FormSchema) => {
		try {
			await upsertTransaction({ ...data, id: transactionId });
			setIsOpen(false);
			form.reset();
			setSelectedCategory(undefined);
			setFilteredSubcategories([]);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (defaultValues) {
			form.reset({
				...defaultValues,

				subcategory: defaultValues.category
					? (subcategoryMap[defaultValues.category][0] as TransactionSubcategory)
					: undefined,
			});
			if (defaultValues.category) {
				handleCategoryChange(defaultValues.category);
			}
		}
	}, [defaultValues, handleCategoryChange, form, subcategoryMap]);

	const isUpdate = Boolean(transactionId);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open) {
					form.reset();
					setSelectedCategory(undefined);
					setFilteredSubcategories([]);
				}
			}}
		>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent className="w-[95vw]">
				<DialogHeader>
					<DialogTitle>{isUpdate ? "Atualizar" : "Criar"} transação</DialogTitle>
					<DialogDescription>Insira as informações abaixo</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 md:space-y-5"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Digite o nome ..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<MoneyInput
											placeholder="Digite o valor da transação ..."
											onValueChange={({ floatValue }) => field.onChange(floatValue || 0)}
											onBlur={field.onBlur}
											disabled={field.disabled}
											value={field.value || 0}
											className={!field.value ? "text-muted-foreground" : ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder="Selecione o tipo de transação ..."
													className={!field.value ? "text-muted-foreground" : ""}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TRANSACTION_TYPE_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex space-x-2">
							<FormField
								control={form.control}
								name="category"
								render={({}) => (
									<FormItem className="flex-1">
										<FormLabel>Categoria</FormLabel>
										<Select onValueChange={handleCategoryChange} value={selectedCategory}>
											<FormControl>
												<SelectTrigger>
													<SelectValue
														placeholder="Selecione a categoria..."
														className={!selectedCategory ? "text-muted-foreground" : ""}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{TRANSACTION_CATEGORY_OPTIONS.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{selectedCategory && (
								<FormField
									control={form.control}
									name="subcategory"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Subcategoria</FormLabel>
											<Select onValueChange={handleSubcategoryChange} value={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder="Selecione a subcategoria..."
															className={!field.value ? "text-muted-foreground" : ""}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{filteredSubcategories.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
						<FormField
							control={form.control}
							name="paymentMethod"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Método de pagamento</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder="Selecione o método de pagamento ..."
													className={!field.value ? "text-muted-foreground" : ""}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data</FormLabel>
									<DatePicker value={field.value} onChange={field.onChange} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="gap-3">
							<DialogClose asChild>
								<Button
									type="button"
									className="custom-active-transition transform bg-muted transition-colors duration-300 ease-in-out hover:bg-danger hover:text-white/80 active:scale-95"
								>
									Cancelar
								</Button>
							</DialogClose>
							<Button
								type="submit"
								className="custom-active-transition transform bg-muted transition-colors duration-300 ease-in-out hover:bg-primary hover:text-white/80 active:scale-95"
							>
								{isUpdate ? "Atualizar" : "Adicionar"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default UpsertTransactionDialog;
