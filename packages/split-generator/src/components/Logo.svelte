<script>
    import { onMount } from 'svelte'
    import Split from 'split.js'

    import LogoSvg from './LogoSvg.svelte'

    onMount(() => {
        let s = Split(['#part-1', '#part-2'], {
            gutterSize: 5,
            minSize: 55.5,
            snapOffset: 0,
            gutterStyle: (dimension, gutterSize) => ({
                backgroundColor: 'rgb(224, 231, 255)',
                [dimension]: `${gutterSize}px`,
            }),
        })
    })
</script>

<div class="flex" style="height: 60px; width: 177px;">
    <div id="part-1" class="h-full relative overflow-hidden">
        <div class="overflow-hidden h-full" style="width: 86px;">
            <LogoSvg
                class="fill-current stroke-current text-indigo-100 h-full"
            />
        </div>
    </div>
    <div id="part-2" class="h-full relative overflow-hidden">
        <div
            class="overflow-hidden h-full absolute right-0"
            style="width: 87.5px;"
        >
            <LogoSvg
                class="fill-current stroke-current text-indigo-100 h-full absolute right-0"
            />
        </div>
    </div>
</div>
