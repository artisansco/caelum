<script lang="ts">
import { Toaster } from "svelte-sonner";
import "../app.css";
</script>

<Toaster richColors closeButton position="top-right" />
<slot />
