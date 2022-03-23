<script lang="ts">
import BaseComponent from '#/FrontendCore/Component/BaseComponent.vue';
import { Component, Route } from '#/FrontendCore/Vue/Annotations';


@Route('/', 'index')
@Component()
export default class IndexPage
    extends BaseComponent
{

    public async mounted ()
    {
        this.$router.push({
            name: 'stakepools_list'
        });
    }

}
</script>
