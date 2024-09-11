<script>
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { inject } from '@vercel/analytics';

	inject();
</script>

<Toaster />

<div class="w-full h-screen">
	<slot />
</div>
