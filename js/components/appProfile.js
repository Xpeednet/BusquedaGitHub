app.component('app-profile', {
    props: ['result', 'isFavorite'],
    methods: {
        addFavorite() {
            this.$emit('add-favorite')
        },
        removeFavorite() {
            this.$emit('remove-favorite')
        }
    },
    template:
    /* html */`
    <div class="result">
        <a v-if="isFavorite" href="#" class="result__toggle-favorite" v-on:click.prevent="removeFavorite">Eliminar Favorito 🔻</a>
        <a v-else href="#" class="result__toggle-favorite" v-on:click.prevent="addFavorite">Agregar Favorito ⭐️</a>
        <h2 class="result_name">{{result.name}}</h2>
        <img v-bind:src="result.avatar_url" v-bind:alt="result.name" class="result__avatar">
        <p class="result__bio">{{result.bio}}</p>
        <br>
        <a v-bind:href="result.blog" target="_blank" class="result__blog">{{result.blog}}</a>
    </div>
    `,
})