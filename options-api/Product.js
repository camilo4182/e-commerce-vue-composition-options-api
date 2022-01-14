app.component("product", {
  template: /* vue-html */ `
    <section class="product">
      <div class="product__thumbnails">
        <div
          v-for="(image, index) in product.images"
          :key="image.thumbnail"
          class="thumb"
          :class="{ active: activeImage === index }"
          :style="{ backgroundImage: 'url(' + product.images[index].thumbnail + ')' }"
          @mouseenter="activeImage = index"
        ></div>
      </div>
      <div class="product__image">
        <img :src="product.images[activeImage].image" :alt="product.name" />
      </div>
    </section>
    <section class="description">
      <h4>
        {{ product.name.toUpperCase() }} {{ product.stock === 0 ? ":(" :
        ":)" }}
      </h4>
      <badge :product="product"></badge>
      <p class="description__status" v-if="product.stock === 0">Agotado</p>
      <p class="description__status" v-if="product.stock === 3">
        Quedan pocas unidades
      </p>
      <p class="description__status" v-if="product.stock === 2">
        ¡El producto se está agotando!
      </p>
      <p class="description__status" v-if="product.stock === 1">
        ¡ÚLTIMA UNIDAD!
      </p>
      <p class="description__status" v-if="product.stock > 3">Disponible</p>
      <p class="description__price" :style="{ color: price_color }">
        $ {{ new Intl.NumberFormat("es-CO").format(product.price) }}
      </p>
      <p class="description__content"></p>
      <div class="discount">
        <span>Código de descuento</span>
        <input type="text" placeholder="Ingresa tu código" @keyup.enter="applyDiscount($event)"/>
      </div>
      <button :disabled="product.stock === 0" @click="triggerSendToCart()">Agregar al carrito</button>
    </section>
  `,
  props: ["product"],
  emits: ["sendtocart"],
  data() {
    return {
      activeImage: 0,
      discountCodes: ["C1", "C2", "C3", "C4"],
      // price_color: "rgb(104, 104, 209)"
    }
  },
  methods: {
    applyDiscount(event) {
      const discountCodeIndex = this.discountCodes.indexOf(event.target.value);
      if (discountCodeIndex >= 0) {
        this.product.price -= this.product.price * 0.1;
        this.discountCodes.splice(discountCodeIndex, 1);
      }
      else {
        alert("Invalid discount code.");
      }
    },
    triggerSendToCart() {
      this.$emit("sendtocart", this.product);
    }
  },
  watch: {
    activeImage(currentValue, oldValue) {
      console.log(currentValue, oldValue);
    },
    /*"product.stock"(currentStock) {
      if (currentStock <= 1) {
        this.price_color = "rgb(188 30 67)";
      }
      if (currentStock == 0) {
        this.price_color = "grey";
      }
    } */
  },
  computed: {
    price_color() {
      if (this.product.stock == 1) { // Vue observa toda dependencia reactiva, en este caso this.product es una de ellas por lo que si cambia, la computed se reejecuta
        return "rgb(188 30 67)";
      }
      if (this.product.stock == 0) {
        return "grey";
      }
      else {
        return "rgb(104, 104, 209)";
      }
    }
  }
});