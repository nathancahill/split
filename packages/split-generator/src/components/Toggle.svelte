<script>
    export let name
    export let value
    export let options
    export let sm = false

    const handleChange = newValue => {
        value = newValue
    }
</script>
<div class="bg-white rounded-md -space-x-px flex">
    {#each options as option, i}
    <label
        class="relative border flex cursor-pointer w-full"
        class:p-3="{!sm}"
        class:py-2="{sm}"
        class:px-3="{sm}"
        class:rounded-tl-md="{i === 0}"
        class:rounded-bl-md="{i === 0}"
        class:rounded-tr-md="{i === options.length - 1}"
        class:rounded-br-md="{i === options.length - 1}"
        class:bg-indigo-50="{value === option.value}"
        class:border-indigo-200="{value === option.value}"
        class:z-10="{value === option.value}"
        class:border-gray-200="{value !== option.value}"
    >
        <input
            type="radio"
            name="{name}"
            value="{option.value}"
            class="h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500"
            aria-labelledby="{name}-{i}-label"
            aria-describedby="{name}-{i}-description"
            checked="{value === option.value}"
            on:change="{handleChange(option.value)}"
        />
        <div class="ml-3 flex flex-col">
            <span
                id="{name}-{i}-label"
                class="block text-sm font-medium"
                class:text-indigo-900="{value === option.value}"
                class:text-gray-900="{value !== option.value}"
            >
                {option.title}
            </span>
        </div>
    </label>
    {/each}
</div>
