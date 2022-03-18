<script>
    import Dashboard from './Dashboard.svelte'

    import 'prismjs/components/prism-jsx.min'
</script>

<Dashboard />

<style global lang="less">
    /*! purgecss start ignore */
    @tailwind base;
    @tailwind components;
    /*! purgecss end ignore */
    @tailwind utilities;

    /*! purgecss start ignore */
    @import 'src/less/markdown';
    @import 'src/less/carbon';
    /*! purgecss end ignore */
</style>
