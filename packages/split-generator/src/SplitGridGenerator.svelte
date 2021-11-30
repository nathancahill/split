<script>
    import { afterUpdate } from 'svelte'
    import { replace, location, querystring } from 'svelte-spa-router'

    import qs from 'qs'
    import Prism from 'svelte-prismjs'
    import Split from 'split-grid'
    import Toggle from './components/Toggle.svelte'
    import Stepper from './components/Stepper.svelte'
    import Copy from './icons/Copy.svelte'
    import Copied from './icons/Copied.svelte'

    let split = null
    let mode = 'vanilla'

    // Split.js options
    const defaultRows = 1
    const defaultColumns = 2
    const defaultMinSize = 0
    const defaultMaxSize = 100000
    const defaultSnapOffset = 30
    const defaultDragInterval = 1

    let parsedQuery = qs.parse($querystring)

    let rows = parsedQuery.rows ? parseInt(parsedQuery.rows, 10) : defaultRows
    let columns = parsedQuery.columns
        ? parseInt(parsedQuery.columns, 10)
        : defaultColumns
    let minSize = parsedQuery.minSize
        ? parseInt(parsedQuery.minSize, 10)
        : defaultMinSize
    let maxSize = parsedQuery.maxSize
        ? parseInt(parsedQuery.maxSize, 10)
        : defaultMaxSize
    let snapOffset = parsedQuery.snapOffset
        ? parseInt(parsedQuery.snapOffset, 10)
        : defaultSnapOffset
    let dragInterval = parsedQuery.dragInterval
        ? parseInt(parsedQuery.dragInterval, 10)
        : defaultDragInterval

    $: changedParameters = {
        ...(rows !== defaultRows && { rows }),
        ...(columns !== defaultColumns && { columns }),
        ...(minSize !== defaultMinSize && { minSize }),
        ...(maxSize !== defaultMaxSize && { maxSize }),
        ...(snapOffset !== defaultSnapOffset && { snapOffset }),
        ...(dragInterval !== defaultDragInterval && { dragInterval }),
    }

    $: query = qs.stringify(changedParameters)
    $: {
        if ($location === '/split-grid' && query !== $querystring) {
            if (query) {
                replace(`/split-grid?${query}`)
            } else {
                replace('/split-grid')
            }
        }
    }

    $: hasCodeChanges =
        minSize !== defaultMinSize ||
        maxSize !== defaultMaxSize ||
        snapOffset !== defaultSnapOffset ||
        dragInterval !== defaultDragInterval

    $: rowObjs =
        rows === 1
            ? []
            : [...new Array(rows + rows - 1)].map((n, i) => {
                  if (i % 2) {
                      return {
                          type: 'row',
                          class: `gutter-row gutter-row-${i}`,
                          size: '10px',
                          track: i,
                          style: `grid-row: ${i + 1};`,
                      }
                  } else {
                      return {
                          type: 'row',
                          size: '1fr',
                      }
                  }
              })

    $: colObjs =
        columns === 1
            ? []
            : [...new Array(columns + columns - 1)].map((n, i) => {
                  if (i % 2) {
                      return {
                          type: 'column',
                          class: `gutter-col gutter-col-${i}`,
                          size: '10px',
                          track: i,
                          style: `grid-column: ${i + 1};`,
                      }
                  } else {
                      return {
                          type: 'column',
                          size: '1fr',
                      }
                  }
              })

    $: allObjs = [...colObjs, ...rowObjs]

    $: gridTemplateRows = rowObjs.map(r => r.size).join(' ')
    $: gridTemplateCols = colObjs.map(r => r.size).join(' ')

    $: javascript = `
import Split from 'split-grid'

Split({${
        hasCodeChanges
            ? `\n${[
                  minSize !== defaultMinSize ? `    minSize: ${minSize},` : '',
                  maxSize !== defaultMaxSize ? `    maxSize: ${maxSize},` : '',
                  snapOffset !== defaultSnapOffset
                      ? `    snapOffset: ${snapOffset},`
                      : '',
                  dragInterval !== defaultDragInterval
                      ? `    dragInterval: ${dragInterval},`
                      : '',
              ]
                  .filter(n => n !== '')
                  .join('\n')}`
            : ''
    }${
        columns === 1
            ? ''
            : `
    columnGutters: [${colObjs
        .filter(col => col.track !== undefined)
        .map(col => {
            return `{
        track: ${col.track},
        element: document.querySelector('.gutter-col-${col.track}'),
    }`
        })
        .join(', ')}],`
    }${
        rows === 1
            ? ''
            : `
    rowGutters: [${rowObjs
        .filter(row => row.track !== undefined)
        .map(row => {
            return `{
        track: ${row.track},
        element: document.querySelector('.gutter-row-${row.track}'),
    }`
        })
        .join(', ')}]`
    }
})
`.trim()

    $: react = `
import Split from 'react-split-grid'

<Split${
        hasCodeChanges
            ? `
${[
    minSize !== defaultMinSize ? `    minSize={${minSize}}` : '',
    maxSize !== defaultMaxSize ? `    maxSize={${maxSize}}` : '',
    snapOffset !== defaultSnapOffset ? `    snapOffset={${snapOffset}}` : '',
    dragInterval !== defaultDragInterval
        ? `    dragInterval={${dragInterval}}`
        : '',
]
    .filter(n => n !== '')
    .join('\n')}`
            : ''
    }
    render={({
        getGridProps,
        getGutterProps,
    }) => (
        <div className="grid" {...getGridProps()}>
${allObjs
    .map(
        pane =>
            `            <div${pane.class ? ` className="${pane.class}"` : ''}${
                pane.track !== undefined
                    ? ` {...getGutterProps('${pane.type}', ${pane.track})}`
                    : ''
            } />`,
    )
    .join('\n')}
        </div>
    )}
/>
`.trim()

    $: html = `
<div class="grid">
${allObjs
    .map(pane => `    <div${pane.class ? ` class="${pane.class}"` : ''}></div>`)
    .join('\n')}
</div>`.trim()

    $: css = `
.grid {
    display: grid;${
        rows === 1
            ? ''
            : `
    grid-template-rows: ${gridTemplateRows};`
    }${
        columns === 1
            ? ''
            : `
    grid-template-columns: ${gridTemplateCols};`
    }
}
${
    columns === 1
        ? ''
        : `
.gutter-col {
    grid-row: 1/-1;
    cursor: col-resize;
}
${colObjs
    .filter(col => col.track !== undefined)
    .map(
        col => `
.gutter-col-${col.track} {
    grid-column: ${col.track};
}`,
    )
    .join('\n')}
`
}${
        rows === 1
            ? ''
            : `
.gutter-row {
    grid-column: 1/-1;
    cursor: row-resize;
}
${rowObjs
    .filter(row => row.track !== undefined)
    .map(
        row => `
.gutter-row-${row.track} {
    grid-row: ${row.track};
}`,
    )
    .join('\n')}
`
    }`.trim()

    let jsCopied = false
    let htmlCopied = false
    let cssCopied = false

    const copyJS = () => {
        navigator.clipboard
            .writeText(mode === 'vanilla' ? javascript : react)
            .then(() => {
                jsCopied = true

                setTimeout(() => {
                    jsCopied = false
                }, 1000)
            })
    }
    const copyHTML = () => {
        navigator.clipboard.writeText(html).then(() => {
            htmlCopied = true

            setTimeout(() => {
                htmlCopied = false
            }, 1000)
        })
    }
    const copyCSS = () => {
        navigator.clipboard.writeText(css).then(() => {
            cssCopied = true

            setTimeout(() => {
                cssCopied = false
            }, 1000)
        })
    }

    const recreateSplit = () => {
        if (split) {
            split.destroy()
        }

        return Split({
            minSize,
            maxSize,
            snapOffset,
            dragInterval,
            columnGutters: colObjs
                .filter(col => col.track !== undefined)
                .map(col => ({
                    track: col.track,
                    element: document.querySelector(`.gutter-col-${col.track}`),
                })),
            rowGutters: rowObjs
                .filter(row => row.track !== undefined)
                .map(row => ({
                    track: row.track,
                    element: document.querySelector(`.gutter-row-${row.track}`),
                })),
        })
    }

    afterUpdate(() => {
        split = recreateSplit()
    })
</script>

<style global>
    .gutter-col,
    .gutter-row {
        background-color: rgb(229, 231, 235);
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .gutter-col {
        grid-row: 1/-1;
        cursor: col-resize;
        background-image: url(/vertical.png);
    }

    .gutter-row {
        grid-column: 1/-1;
        cursor: row-resize;
        background-image: url(/horizontal.png);
    }
</style>

<svelte:head>
    <title>Split.js - Split-Grid</title>
</svelte:head>

<!-- Main 3 column grid -->
<div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
    <!-- Left column -->
    <div class="grid grid-cols-1 gap-4 lg:col-span-2">
        <section aria-labelledby="section-1-title">
            <h2 class="sr-only" id="section-1-title">
                Split.js
            </h2>
            <div class="rounded-lg bg-white overflow-hidden shadow p-4">
                <div
                    class="border-4 border-dashed border-gray-200 rounded-lg h-64"
                >
                    <div
                        class="h-full grid"
                        style="grid-template-rows: {gridTemplateRows}; grid-template-columns: {gridTemplateCols}"
                    >
                        {#each allObjs as pane}
                        <div class="{pane.class}" style="{pane.style}"></div>
                        {/each}
                    </div>
                </div>
            </div>
        </section>
        <section aria-labelledby="section-2-title">
            <h2 class="sr-only" id="section-1-title">
                Generated Code
            </h2>
            <div
                class="rounded-lg bg-white overflow-hidden shadow p-4 markdown"
            >
                <div class="w-1/3 mb-4">
                    <Toggle
                        sm
                        name="mode"
                        bind:value="{mode}"
                        options="{[{ title: 'JavaScript', value: 'vanilla' }, { title: 'React', value: 'react' }]}"
                    />
                </div>
                <div class="relative markdown group">
                    <button
                        type="button"
                        class="absolute opacity-0 group-hover:opacity-100 top-1.5 right-1.5 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click="{copyJS}"
                    >
                        {#if jsCopied}
                        <Copied /> Copied {:else} <Copy /> Copy {/if}
                    </button>
                    {#if mode === 'vanilla'}
                    <Prism language="javascript">{javascript}</Prism>
                    {:else if mode === 'react'}
                    <Prism language="jsx">{react}</Prism>
                    {/if}
                </div>

                {#if mode === 'vanilla'}
                <h3 class="text-lg font-medium mb-2 mt-4">HTML</h3>
                <div class="relative markdown group">
                    <button
                        type="button"
                        class="absolute opacity-0 group-hover:opacity-100 top-1.5 right-1.5 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click="{copyHTML}"
                    >
                        {#if htmlCopied}
                        <Copied /> Copied {:else} <Copy /> Copy {/if}
                    </button>
                    <Prism language="html">{html}</Prism>
                </div>
                {/if}

                <h3 class="text-lg font-medium mb-2 mt-4">CSS</h3>
                <div class="relative markdown group">
                    <button
                        type="button"
                        class="absolute opacity-0 group-hover:opacity-100 top-1.5 right-1.5 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click="{copyCSS}"
                    >
                        {#if cssCopied}
                        <Copied /> Copied {:else} <Copy /> Copy {/if}
                    </button>
                    <Prism language="css">{css}</Prism>
                </div>
            </div>
        </section>
    </div>

    <!-- Right column -->
    <div class="grid grid-cols-1 gap-4">
        <section aria-labelledby="section-2-title">
            <h2 class="sr-only" id="section-2-title">
                Options
            </h2>
            <div class="rounded-lg bg-white overflow-hidden shadow">
                <div class="p-6 space-y-4">
                    <div>
                        <label
                            for="company_website"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Rows
                        </label>
                        <Stepper
                            bind:value="{rows}"
                            default="{defaultRows}"
                            min="{1}"
                        />
                    </div>

                    <div>
                        <label
                            for="company_website"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Columns
                        </label>
                        <Stepper
                            bind:value="{columns}"
                            default="{defaultColumns}"
                            min="{1}"
                        />
                    </div>

                    <div>
                        <label
                            for="company_website"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Minimum Size
                        </label>
                        <Stepper
                            bind:value="{minSize}"
                            default="{defaultMinSize}"
                            step="{50}"
                            min="{0}"
                            max="{300}"
                        />
                    </div>

                    <div>
                        <label
                            for="company_website"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Maximum Size
                        </label>
                        <Stepper
                            bind:value="{maxSize}"
                            default="{defaultMaxSize}"
                            step="{50}"
                            min="{0}"
                            max="{1000}"
                        />
                    </div>

                    <div>
                        <label
                            for="company_website"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Snap Offset
                        </label>
                        <Stepper
                            bind:value="{snapOffset}"
                            default="{defaultSnapOffset}"
                            min="{0}"
                            max="{100}"
                            step="{10}"
                        />
                    </div>

                    <div>
                        <label
                            for="company_website"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Drag Interval
                        </label>
                        <Stepper
                            bind:value="{dragInterval}"
                            default="{defaultDragInterval}"
                            min="{1}"
                            max="{20}"
                            step="{1}"
                        />
                    </div>
                </div>
            </div>
            <a
                href="https://github.com/nathancahill/split/tree/master/packages/split-grid"
                class="flex w-full mt-4 items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-t-md border-indigo-200 text-indigo-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:z-10"
            >
                <svg
                    role="img"
                    viewBox="0 0 26 24"
                    xmlns="http://www.w3.org/2000/svg"
                    class="-ml-1 mr-3 h-5 w-5 fill-current stroke-current"
                >
                    <path
                        style="transform: translateX(1px);"
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    />
                </svg>
                View Docs on GitHub
            </a>
            <a
                href="https://github.com/sponsors/nathancahill"
                class="flex w-full -mt-1 items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-b-md border-indigo-200 text-indigo-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:z-10"
            >
                <svg
                    role="img"
                    viewBox="0 0 26 24"
                    xmlns="http://www.w3.org/2000/svg"
                    class="-ml-1 mr-3 h-5 w-5 fill-current stroke-current"
                    color="#EA4AAA"
                >
                    <path
                        style="transform: translateX(1px);"
                        d="M17.625 1.499c-2.32 0-4.354 1.203-5.625 3.03-1.271-1.827-3.305-3.03-5.625-3.03C3.129 1.499 0 4.253 0 8.249c0 4.275 3.068 7.847 5.828 10.227a33.14 33.14 0 0 0 5.616 3.876l.028.017.008.003-.001.003c.163.085.342.126.521.125.179.001.358-.041.521-.125l-.001-.003.008-.003.028-.017a33.14 33.14 0 0 0 5.616-3.876C20.932 16.096 24 12.524 24 8.249c0-3.996-3.129-6.75-6.375-6.75zm-.919 15.275a30.766 30.766 0 0 1-4.703 3.316l-.004-.002-.004.002a30.955 30.955 0 0 1-4.703-3.316c-2.677-2.307-5.047-5.298-5.047-8.523 0-2.754 2.121-4.5 4.125-4.5 2.06 0 3.914 1.479 4.544 3.684.143.495.596.797 1.086.796.49.001.943-.302 1.085-.796.63-2.205 2.484-3.684 4.544-3.684 2.004 0 4.125 1.746 4.125 4.5 0 3.225-2.37 6.216-5.048 8.523z"
                    />
                </svg>
                Sponsor on GitHub
            </a>
        </section>
    </div>
</div>
