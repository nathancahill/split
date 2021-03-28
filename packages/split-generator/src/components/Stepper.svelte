<script>
    export let value
    export let min = 2
    export let max = 10
    export let step = 1

    const dec = () => {
        if (value - step >= min) {
            value -= step
        } else {
            value = min
        }
    }

    const inc = () => {
        if (value + step <= max) {
            value += step
        } else {
            value = max
        }
    }

    const handleChange = (ev) => {
        let newValue = parseInt(ev.target.value, 10)

        if (isNaN(newValue)) {
            value = 2
        } else {
            value = Math.max(Math.min(newValue, max), min)
        }
    }
</script>

<div class="bg-white rounded-md -space-x-px flex">
    <span
        class="bg-indigo-50 hover:bg-indigo-100 border-indigo-200 z-10 rounded-tl-md rounded-bl-md relative border p-3 flex cursor-pointer"
        on:click="{dec}"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 12H4"
            />
        </svg>
    </span>

    <input
        type="text"
        class="focus:ring-indigo-500 focus:border-indigo-500 focus:z-20 text-center border-gray-300 w-full px-3"
        value="{value}"
        on:change="{handleChange}"
    />

    <span
        class="bg-indigo-50 hover:bg-indigo-100 border-indigo-200 z-10 rounded-tr-md rounded-br-md relative border p-3 flex cursor-pointer"
        on:click="{inc}"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
        </svg>
    </span>
</div>
