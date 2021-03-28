<style global lang="less">
    /*! purgecss start ignore */
    @tailwind base;
    @tailwind components;
    /*! purgecss end ignore */
    @tailwind utilities;

    /*! purgecss start ignore */
    @import 'src/less/markdown';
    /*! purgecss end ignore */
</style>

<script>
    import Dashboard from './Dashboard.svelte'

    import 'prismjs/components/prism-jsx.min'
</script>

<Dashboard />
