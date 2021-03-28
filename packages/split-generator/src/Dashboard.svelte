<script>
    import Router, { link, location } from 'svelte-spa-router'

    import SplitGenerator from './SplitGenerator.svelte'
    import SplitGridGenerator from './SplitGridGenerator.svelte'
    import Logo from './components/Logo.svelte'

    let pages = [
        { title: 'Split.js', url: '/' },
        { title: 'Split-Grid', url: '/split-grid' },
    ]

    let routes = {
        '/': SplitGenerator,
        '/split-grid': SplitGridGenerator,
    }
</script>

<div class="min-h-screen bg-gray-100">
    <header class="pb-24 bg-indigo-600">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div class="py-5 flex items-center justify-between">
                <!-- Logo -->
                <div class="static">
                    <span class="sr-only">Split.js</span>
                    <Logo />
                </div>

                <!-- Right section on desktop -->
                <div class="ml-4 flex lg:items-center lg:pr-0.5 space-x-4">
                    <a
                        href="https://github.com/nathancahill/split"
                        class="flex-shrink-0 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <span class="sr-only">GitHub</span>
                        <svg
                            role="img"
                            viewBox="0 0 26 24"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 fill-current stroke-current"
                        >
                            <path
                                style="transform: translateX(1px);"
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            />
                        </svg>
                    </a>
                    <a
                        href="https://github.com/sponsors/nathancahill"
                        class="flex-shrink-0 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <span class="sr-only">GitHub Sponsors</span>
                        <svg
                            role="img"
                            viewBox="0 0 26 24"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 fill-current stroke-current"
                        >
                            <path
                                style="transform: translateX(1px);"
                                d="M17.625 1.499c-2.32 0-4.354 1.203-5.625 3.03-1.271-1.827-3.305-3.03-5.625-3.03C3.129 1.499 0 4.253 0 8.249c0 4.275 3.068 7.847 5.828 10.227a33.14 33.14 0 0 0 5.616 3.876l.028.017.008.003-.001.003c.163.085.342.126.521.125.179.001.358-.041.521-.125l-.001-.003.008-.003.028-.017a33.14 33.14 0 0 0 5.616-3.876C20.932 16.096 24 12.524 24 8.249c0-3.996-3.129-6.75-6.375-6.75zm-.919 15.275a30.766 30.766 0 0 1-4.703 3.316l-.004-.002-.004.002a30.955 30.955 0 0 1-4.703-3.316c-2.677-2.307-5.047-5.298-5.047-8.523 0-2.754 2.121-4.5 4.125-4.5 2.06 0 3.914 1.479 4.544 3.684.143.495.596.797 1.086.796.49.001.943-.302 1.085-.796.63-2.205 2.484-3.684 4.544-3.684 2.004 0 4.125 1.746 4.125 4.5 0 3.225-2.37 6.216-5.048 8.523z"
                            />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="border-t border-white border-opacity-20 py-5">
                <div class="grid grid-cols-3 gap-8 items-center">
                    <div class="col-span-2">
                        <nav class="flex space-x-4">
                            {#each pages as page}
                            <a
                                use:link="{page.url}"
                                class="cursor-pointer text-sm font-medium rounded-md bg-white px-3 py-2 hover:bg-opacity-10"
                                class:text-white="{page.url === $location}"
                                class:text-indigo-100="{page.url !== $location}"
                                class:bg-opacity-0="{page.url !== $location}"
                                class:bg-opacity-10="{page.url === $location}"
                                aria-current="page"
                            >
                                {page.title}
                            </a>
                            {/each}
                        </nav>
                    </div>
                    <div>
                        <div class="max-w-md w-full mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <main class="-mt-24 pb-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <Router {routes} />
        </div>
    </main>
    <footer>
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div
                class="border-t border-gray-200 py-8 text-sm text-gray-500 text-center sm:text-left"
            >
                <span class="block sm:inline"
                    >&copy; {(new Date()).getFullYear()}
                    <a href="https://nathancahill.com/">Nathan Cahill</a></span
                >
            </div>
        </div>
    </footer>
</div>
