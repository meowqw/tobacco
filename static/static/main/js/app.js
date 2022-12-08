Vue.component('app-products', {
    props: {
        products: [],

    },

    data: function () {
        return {
            order: {}
        }
    },
    methods: {
        countPlus(id, price) {
            this.order[id] = {'total': this.order[id].total+price, 'count': this.order[id].count+1}

            document.getElementById('total').innerHTML = this.order[id].total + ' ₽'
            localStorage.total = this.order[id].total
        },
        countMinus(id, price) {
            if (this.order[id].count > 0) {
                this.order[id] = {'total': this.order[id].total-price, 'count': this.order[id].count-1}
            }
            document.getElementById('total').innerHTML = this.order[id].total + ' ₽'
            localStorage.total = this.order[id].total
        }
    },
    watch: {
        products: function() {
            this.order = this.products[0].order;
        }
    },


    template: `<div class="main-content__body main-body">
    <ul class="list-reset main-body__list accordion" v-for="product in products">
        <li class="main-body__item accordion-item">
            <button class="btn-reset btn--accordion main-body__accordion accordion-header">{{ product.category }}</button>
            <div class="main-body__panel">
                <ul class="list-reset main-body__sublist accordion accordion-child">
                    <li class="main-body__subitem accordion-item">
                        <button class="btn-reset btn--accordion main-body__accordion accordion-header">
                            Список товаров
                            <div class="tooltip">
                                <img loading="lazy" src="/static/main/img/tooltip.svg" class="image" width="20" height="20"
                                    alt="tooltip">
                                <span class="tooltip__text">
                                    <ul class="list-reset tooltip__list">
                                        <li class="tooltip__item">Блок 10 шт.</li>
                                        <li class="tooltip__item">РРЦ 100 ₽/шт.</li>
                                    </ul>
                                </span>
                            </div>
                        </button>
                        <div class="main-body__panel">
                            <ul class="list-reset main-body__sublist" v-for="item in product.content">
                                <li class="main-body__subitem">
                                    <div class="product product--main accordion" id="product-1">
                                        <div class="product__items">
                                            <div class="product__left">
                                                <img src="item.img" alt="product"
                                                    class="image product__img minimized">
                                                <h3 class="product__title">{{ item.name }}</h3>
                                                <div class="product__icon">
                                                    <img loading="lazy" src="/static/main/img/top.svg" class="image" width="23"
                                                        height="27" alt="top">
                                                </div>
                                            </div>
                                            <ul class="list-reset product__right-list">
                                                <li class="product__right-item product__right-item--main ">
                                                    <button class="btn-reset product__presence">{{ item.availability.name }}</button>
                                                    <div class="product__residue">{{ item.rest }}</div>
                                                    <div class="product__calc product-calc">
                                                    
                                                        <button
                                                            class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price)"></button>
                                                        <div class="product-calc__value">
                                                            {{ order[item.id].count }} 
                                                            <span>14 блоков 6 шт</span>
                                                        </div>
                                                        
                                                        <button
                                                            class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price)"></button>
                                                    </div>
                                                    <div class="product__size">{{ item.price }} ₽</div>
                                                    <div class="product__size-all"> {{ order[item.id].total }} ₽</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="product-accordion-content">
                                        <ul class="list-reset product__right-list product__right-list--accordion">
                                            <li class="product__right-item">
                                                <div class="product__presence product__presence--ordering">В наличии
                                                </div>
                                                <div class="product__residue">Много</div>
                                                <div class="product__calc product-calc">
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--minus"></button>
                                                    <div class="product-calc__value">
                                                        146
                                                        <span>14 блоков 6 шт</span>
                                                    </div>
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--plus"></button>
                                                </div>
                                                <div class="product__size">80 ₽</div>
                                                <div class="product__size-all product__size-all--ordering">4 720 ₽</div>
                                            </li>
                                            <li class="product__right-item">
                                                <div class="product__presence product__presence--ordering">В наличии
                                                </div>
                                                <div class="product__residue">Много</div>
                                                <div class="product__calc product-calc">
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--minus"></button>
                                                    <div class="product-calc__value">
                                                        146
                                                        <span>14 блоков 6 шт</span>
                                                    </div>
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--plus"></button>
                                                </div>
                                                <div class="product__size">80 ₽</div>
                                                <div class="product__size-all product__size-all--ordering">4 720 ₽</div>
                                            </li>
                                            <li class="product__right-item">
                                                <div class="product__presence product__presence--ordering">В наличии
                                                </div>
                                                <div class="product__residue">Много</div>
                                                <div class="product__calc product-calc">
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--minus"></button>
                                                    <div class="product-calc__value">
                                                        146
                                                        <span>14 блоков 6 шт</span>
                                                    </div>
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--plus"></button>
                                                </div>
                                                <div class="product__size">80 ₽</div>
                                                <div class="product__size-all product__size-all--ordering">4 720 ₽</div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</div>`

});

new Vue({
    delimiters: ['{*', '*}'],
    el: '#app',
    data: {
        products: [{}],
        total: 0,
        totalOne: 0,
        totalTwo: 0,
        totalThree: 0
    },
    methods: {
        getContent(id) {
            axios
                .get(`/api/v1/productbycat/${id}`)
                .then(response => (this.contentController(response.data.products)));
        },

        contentController(content) {
            var products = [];
            if (content.length > 0) {
                var order = {};
                for (i = 0; i < content.length; i++) {
                    order[content[i].id] = {'total': 0, 'count': 0}
                }

                categoryName = content[0]['category']['name'];
                products.push({ 'category': categoryName, 'content': content, 'order': order, 'total': this.total});
                this.products = products;
            }
        },
        getFilter(availability) {
            console.log(availability);
        }

    },
    mounted() {
        this.total = localStorage.total;
    },
    watch: {
        total(newName) {
            localStorage.total = this.total;
        }
      }
});

