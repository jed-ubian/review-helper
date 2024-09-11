<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { items } from '$lib/stores';

	let pairA: string = 'hello';
	let pairB: string = 'world';
	let answer: string = '';
	let importData: string = '';

	const addItem = () => {
		items.update((items) => {
			items.push({
				id: items.length + 1,
				a: pairA,
				b: pairB
			});
			return items;
		});

		pairA = 'hello';
		pairB = 'world';
	};

	const deleteItem = (id: number) => {
		items.update((items) => {
			return items.filter((item: any) => item.id !== id);
		});
	};

	const total = $items.length;
	let cItems = $items;
	let score = 0;
	let started = false;
	let curItem = Math.floor(Math.random() * cItems.length);

	const nextItem = () => {
		if (score === total) {
			alert('Quiz completed');
			restart();
			return;
		}

		cItems = cItems.filter((item: any) => item.id !== cItems[curItem].id);
		curItem = Math.floor(Math.random() * cItems.length);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (answer.toLowerCase() === cItems[curItem].b.toLowerCase()) {
				score++;
			}
			nextItem();
			answer = '';
		}
	};

	const restart = () => {
		score = 0;
		cItems = $items;
		curItem = Math.floor(Math.random() * cItems.length);
		started = false;
	};
</script>

<Tabs.Root value="setup" class="w-full h-[80%]">
	<Tabs.List class="w-full">
		<Tabs.Trigger class="w-full" value="setup">Setup</Tabs.Trigger>
		<Tabs.Trigger class="w-full" value="quiz">Quiz</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="setup" class="h-full">
		<div class="h-full flex flex-col gap-2 justify-center items-center">
			<ScrollArea class="w-[60%] h-[80%] border rounded-sm p-4">
				{#if !$items.length}
					<div class="h-[80%] flex justify-center items-center">
						<p class="text-lg text-gray-500">No items</p>
					</div>
				{:else}
					{#each $items as i}
						<div class="flex justify-between">
							<div class="text-center">{i.a}</div>
							<div class="text-center">{i.b}</div>
							<Button variant="destructive" class="w-16" on:click={() => deleteItem(i.id)}
								>Delete</Button
							>
						</div>
					{/each}
				{/if}
				<div class="h-[80%]"></div>
			</ScrollArea>
			<div class="flex gap-2">
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Insert</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Add Entry</Dialog.Title>
							<Dialog.Description>Add a new entry to the list</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="a" class="text-right">Pair A</Label>
								<Input id="a" bind:value={pairA} class="col-span-3" />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="b" class="text-right">Pair B</Label>
								<Input id="b" bind:value={pairB} class="col-span-3" />
							</div>
						</div>
						<Dialog.Footer>
							<Dialog.Close>
								<Button type="submit" on:click={addItem}>Save</Button>
							</Dialog.Close>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Export</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Export Entries</Dialog.Title>
							<Dialog.Description>Export the list of entries</Dialog.Description>
						</Dialog.Header>
						<Textarea value={JSON.stringify($items, null, 4)} />
						<Dialog.Footer>
							<Dialog.Close>
								<Button
									type="submit"
									on:click={() => {
										navigator.clipboard.writeText(JSON.stringify($items, null, 4));
										toast.success('Copied successfully');
									}}>Copy</Button
								>
							</Dialog.Close>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Import</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Import Entries</Dialog.Title>
							<Dialog.Description>Import the list of entries</Dialog.Description>
						</Dialog.Header>
						<Textarea bind:value={importData} />
						<Dialog.Footer>
							<Dialog.Close>
								<Button
									type="submit"
									on:click={() => {
										try {
											let data = JSON.parse(importData);

											for (let i = 0; i < data.length; i++) {
												console.log(data[i]);
												items.update((items) => {
													items.push({
														id: items.length + 1,
														a: data[i].a,
														b: data[i].b
													});
													return items;
												});
											}

											toast.success('Imported successfully');
										} catch {
											toast.error('Invalid JSON');
										}
									}}>Import</Button
								>
							</Dialog.Close>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</Tabs.Content>
	<Tabs.Content value="quiz"
		><div class="flex flex-col gap-4 items-center h-full">
			<div class="flex flex-col h-full justify-center items-center">
				<h1 class="text-7xl">Score: {score}</h1>
				<h1>Total Items: {total}</h1>
			</div>
			{#if started}
				<div class="h-72 w-[80%] flex flex-col justify-evenly">
					<h1 class="text-4xl">{cItems[curItem].a}</h1>
					<Input bind:value={answer} on:keydown={onKeyDown} class="w-full" />
				</div>
				<div class="flex gap-2">
					<Button class="w-14" on:click={restart}>Restart</Button>
					<Button class="w-14" on:click={nextItem}>Skip</Button>
				</div>
			{:else}
				<Button class="w-14" on:click={() => (started = !started)}>Start</Button>
			{/if}
		</div></Tabs.Content
	>
</Tabs.Root>
