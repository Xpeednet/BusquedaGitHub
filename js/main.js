const API = "https://api.github.com/users/";

// Tiempo de espera máximo para cargar datos de favoritos del cache
const requestMaxTime = 3600000

const app = Vue.createApp({
  data() {
    return {
      search: null,
      result: null,
      error: null,
      favorites: new Map()
    };
  },

  computed: {
    isFavorite() {
      return this.favorites.has(this.result.login);
    },

    allFavorites() {
      return Array.from(this.favorites.values());
    }
  },
created()
{
  const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"))
  if (savedFavorites?.length)
  {
    const favorites =  new Map(savedFavorites.map(favorite => [favorite.login, favorite]))
    this.favorites = favorites
  }
},

  methods: {
    async doSearch() {
      this.result = this.error = null
      
      const foundFavorites = this.favorites.get(this.search)

      const shouldRequestAgain = (() => {
        if (!!foundFavorites) {
          const { lastRequestTime } = foundFavorites
          return Date.now() - lastRequestTime > requestMaxTime
          
        }
        return false
      })() //IIFE

      if (!!foundFavorites && !shouldRequestAgain) {
        console.log("Encontrado y se utiliza la version en cache")
        return this.result = foundFavorites
      }

      try {
        console.log("No encontrado o es una version antigua del cache")
        const response = await fetch(API + this.search)
        if (!response.ok) throw new Error("User not found")
        const data = await response.json()
        this.result = data
        this.result.lastRequestTime = Date.now()
        //foundFavorites.lastRequestTime = Date.now()
      } catch(error) {
        this.error = error
      } finally {
        this.search = null
      }
    },

    addFavorite() {
      this.result.lastRequestTime = Date.now()
      this.favorites.set(this.result.login, this.result)
      this.updateStorage()
    },

    removeFavorite() {
      this.favorites.delete(this.result.login)
      this.updateStorage()
    },

    checkFavorite(id) {
      return this.result?.login === id
    },  

    updateStorage() {
      window.localStorage.setItem("favorites", JSON.stringify(this.allFavorites))
    },

    clickFavorite(favorite) {
      this.result = favorite
    }
  }
});