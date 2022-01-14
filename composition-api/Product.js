app.component("product", {
  template: /* vue-html */`
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
  setup(props, context) { // setup(props, { attrs, slots, emit }) destructuracion del context
    
    /**
     * --------------------------------- PRODUCT STATE ---------------------------------
     */
    const productState = reactive({
      activeImage: 0,

      // CAMBIAR COLOR DEL PRECIO - Watch (Descomentar si se usa el Watch)
      //price_color: "rgb(104 104 209)"

      /**
       * CAMBIAR COLOR DEL PRECIO
       * Type: Computed
       * Segunda manera de hacerlo: dentro de un State (esta vez con operador tenario anidado)
       */
      price_color: computed(() => props.product.stock <= 1 ? (props.product.stock == 1 ? "rgb(188 30 67)" : "grey") : "rgb(104, 104, 209)")
    });

    /**
     * CAMBIAR COLOR DEL PRECIO
     * Type: Computed
     * Primera manera de hacerlo: fuera de un State como variable independiente
     */
    /*const price_color = computed(() => {
      if (product.stock == 1) { // Vue observa toda dependencia reactiva, en este caso this.product es una de ellas por lo que si cambia, la computed se reejecuta
        return "rgb(188 30 67)";
      }
      if (product.stock == 0) {
        return "grey";
      }
      else {
        return "rgb(104, 104, 209)";
      }
    }) */

    /**
     * CAMBIAR COLOR DEL PRECIO
     * Type: Watch
     */
    /*watch(() => product.stock, (currentStock) => {
      if (currentStock == 1) {
        productState.price_color = "rgb(188 30 67)";
      }
      if (currentStock == 0) {
        productState.price_color = "grey";
      }
    }) */

    /**
     * IMPRIMIR EL ÍNDICE DEL THUMBNAIL SELECCIONADO
     * Type: Watch
     */
    watch(() => productState.activeImage, (currValue, oldValue) => {
      console.log(currValue, oldValue);
    });

    /**
     * Aplica un descuento de 10% al precio del producto
     * @param {*} event 
     */
    function applyDiscount(event) {
      const discountCodeIndex = discountCodes.indexOf(event.target.value);
      if (discountCodeIndex >= 0) {
        product.price -= product.price * 0.1;
        discountCodes.splice(discountCodeIndex, 1);
      }
      else {
        alert("Invalid discount code.");
      }
    }

    /**
     * --------------------------------- TRIGGER TO SEND PRODUCT TO THE CART ---------------------------------
     */
    function triggerSendToCart() {
      context.emit("sendtocart", product);
    }

    /**
     * --------------------------------- DISCOUNT CODE STATE ---------------------------------
     */
    const discountCodesState = reactive({
      discountCodes: ["C1", "C2", "C3", "C4"]
    });

    /**
     * *******DESTRUCTURING*******
     */
    const { product } = props;
    const { discountCodes } = discountCodesState;

    return { // Aquí se ponen las variables y funciones para retornar al tamplate
      ...toRefs(productState),
      ...toRefs(discountCodesState),
      applyDiscount,
      triggerSendToCart
    }
  }
});