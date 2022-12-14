
// Display product list on catalog page
Vue.component('app-products', {
    props: {
        products: [],

    },

    data: function () {
        return {
            order: {},
        }
    },
    methods: {
        countPlus(id, price) {
            // + count product
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            this.order[id] = { 'total': this.order[id].total + price, 'count': this.order[id].count + 1 }

            document.getElementById('total').innerHTML =  (current + price) + ' ₽'
            
            localStorage.total = localStorage.total + this.order[id].total
            localStorage.setItem("order", JSON.stringify(this.order))
            console.log(this.order)
        },
        countMinus(id, price) {
            // - count product
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            if (this.order[id].count > 0) {
                this.order[id] = { 'total': this.order[id].total - price, 'count': this.order[id].count - 1}

                document.getElementById('total').innerHTML =  (current - price) + ' ₽'
                localStorage.total = localStorage.total - this.order[id].total
                localStorage.setItem("order", JSON.stringify(this.order))
            } else {
                var calc = document.getElementById('calc_'+id)
                var add = document.getElementById('add_'+id)
                calc.style.display = "none"
                add.style.display = ""
            }
            
        },
        displayProductList(id) {
            var el = document.getElementById(id)
            if (el.style.display == "none") {
                el.style.display = "block"
            } else {
                el.style.display = "none"
            }
        },
        displayProducts(id) {
            console.log('123')
            var el = document.getElementById(id + "_products")
            if (el.style.display == "none") {
                el.style.display = "block"
            } else {
                el.style.display = "none"
            }
        },
        displayCalc(id) {
            var add = document.getElementById('add_'+id)
            var calc = document.getElementById('calc_'+id)
            add.style.display = "none"
            calc.style.display = ""
            

        }
    },
 

    watch: {
        products: function () {
            order = {}
            for (var id in this.products) {
                for (var i = 0; i < Object.keys(this.products[id].order).length; i++) {
                    // this.order[]
                    // if (Object.keys(this.products[id].order)[i] in this.order != true) {
                        order[Object.keys(this.products[id].order)[i]] = this.products[id].order[Object.keys(this.products[id].order)[i]]
                    // }
                    
                } 
                
            }
            for (var i = 0; i < Object.keys(this.order).length; i++) {
                order[Object.keys(this.order)[i]] = this.order[Object.keys(this.order)[i]]
            }
            this.order = order

            // this.order = this.products[0].order
            // + get current order from base app
            // console.log(this.products)
            // for (var i = 0; i < this.products.length; i++) {
            //     
            // }
            // console.log(this.order)
        }
    },


    template: `
    <div class="main-content__body main-body">
    <ul class="list-reset main-body__list accordion" style="margin-top: 20px;" v-for="product in products">
        <li class="main-body__item accordion-item">
            <button class="btn-reset btn--accordion main-body__accordion accordion-header" @click="displayProductList(product.category)">{{ product.category }}</button>
            <div class="main-body__panel" >
            
                <ul class="list-reset main-body__sublist accordion accordion-child" >
                    <li class="main-body__subitem accordion-item" :id="product.category"   style="display:none">
                        <button class="btn-reset btn--accordion main-body__accordion accordion-header" @click="displayProducts(product.category)">
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
                        <div class="main-body__panel" :id="product.category + '_products'" style="display:block">
                            <ul class="list-reset main-body__sublist" v-for="item in product.content" style="margin-top:10px;">
                                <li class="main-body__subitem" >
                                    <div class="product product--main accordion" id="product-1">
                                        <div class="product__items">
                                            <div class="product__left">
                                            
                                                <img v-bind:src="item.img" alt="product"
                                                    class="image product__img minimized">
                                                <h3 class="product__title">{{ item.name }}</h3>
                                                <div class="product__icon" v-if="item.product_status.name=='top'">
                                                    
                                                    <img loading="lazy" src="/static/main/img/top.svg" class="image" width="23"
                                                        height="27" alt="top">
                                                </div>
                                                <div class="product__icon" v-else-if="item.product_status.name=='new'">
                                                    
                                                    <img loading="lazy" src="/static/main/img/new.svg" class="image" width="23"
                                                        height="27" alt="new">
                                                </div>
                                                <div class="product__icon" v-else-if="item.product_status.name=='sale'">
                                                    
                                                    <img loading="lazy" src="/static/main/img/sale.svg" class="image" width="23"
                                                        height="27" alt="sale">
                                                </div>
                                            </div>
                                            <ul class="list-reset product__right-list">
                                                <li class="product__right-item product__right-item--main ">
                                                    <button class="btn-reset product__presence">{{ item.availability.name }}</button>
                                                    <div class="product__residue">{{ item.rest }}</div>

                                                    <button @click="displayCalc(item.id)" :id="'add_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                    <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                        Добавить
                                                    </button>

                                                    <div class="product__calc product-calc" :id="'calc_'+item.id" style="display:none">
                                                    
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
</div>
`

});

new Vue({
    delimiters: ['{*', '*}'],
    el: '#app',
    data: {
        products: [],
        openedCategory: [],

        // totals 
        total: 0,
        totalOne: 0,
        totalTwo: 0,
        totalThree: 0,

        availability: 'Все',
        weight: 'Вес',

        // current order list
        currentOrderId: '',
        status: []
    },
    methods: {
        
        // get product list by category
        getContent(id) {
            // redirect to main page if current url is not main
            if (location.href.split('/')[location.href.split('/').length - 2] != 'main') {
                location.href = '/main/';
            }

            // GET REQUEST to /api/v1/productbycat/{id}
            axios
                .get(`/api/v1/productbycat/${id}`)
                .then(response => (this.contentController(response.data.products)));
        },

        // get order id by user id (user id from backend)
        getOrderId() {
            // GET REQUEST to /api/v1/order/
            req = axios.get(`/api/v1/order/`)
            resData = req.then((response) => response.data.orders[0].id);
            return resData;
                
        },

        // adding products to the list for later display in app-products
        contentController(content) {
            var products = this.products;
            if (content.length > 0) {
                var order = {};
                for (i = 0; i < content.length; i++) {
                    order[content[i].id] = { 'total': 0, 'count': 0 }
                }

                categoryName = content[0]['category']['name'];
                if (this.openedCategory.includes(categoryName) == false) {
                    products.push({ 'category': categoryName, 'content': content, 'order': order, 'total': this.total });
                    this.products = products;

                    // check category is opened
                    this.openedCategory.push(categoryName);
                }
                
                

                
            }
        },
        // now working
        filterAvailability(id) {
            console.log(id)
            console.log(this.availability);
        },
        
        // request on create order (Intermediate) and redirect to basket
        createOrder: async function (event) {
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            total = Number(document.getElementById(`total`).innerHTML.replace(' ₽', ''))

            if (total > 0) {
                order = {}
                for (var key in JSON.parse(localStorage.order)){
                    if (JSON.parse(localStorage.order)[key].count != 0) {
                        order[key] = JSON.parse(localStorage.order)[key]
                    }
                  }
                // POST REQUEST to /api/v1/order/
                const response =  await fetch("/api/v1/order/", {
                    headers: {
                    "Content-type": "application/json",
                    "X-CSRFTOKEN": token,
                    },
                    method: "POST",
                    body: JSON.stringify({'order': JSON.stringify(order), 'status': true, 'total': localStorage.total}),
                });

                location.href = '/basket'
            }
        },
        // - quantity of goods on BASKET PAGE (changing variables on the page by id)
        // needs optimization !!
        minusCount: function (id, price, catId){
            currentCount = Number(document.getElementById(`count_${id}`).innerHTML)
            console.log(currentCount)
            document.getElementById(`count_${id}`).innerHTML = currentCount - 1
            document.getElementById(`count_${id}`).setAttribute('value', currentCount - 1)

            currentPrice = Number(document.getElementById(`total_${id}`).innerHTML.replace(' ₽', ''))
            document.getElementById(`total_${id}`).innerHTML = (currentPrice - price) + ' ₽'
            document.getElementById(`total_${id}`).setAttribute('value', currentPrice - price)

            currentCatTotal = Number(document.getElementById(`catTotal_${catId}`).innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            document.getElementById(`catTotal_${catId}`).innerHTML = "Итого: " + (currentCatTotal - price) + " ₽"

            total = Number(document.getElementById(`total`).innerHTML.replace(' ₽', '').replace('Всего: ', ''))
            document.getElementById(`total`).innerHTML = "Всего: " + (total - price) + " ₽"

        },
        // + quantity of goods on BASKET PAGE (changing variables on the page by id)
        // needs optimization !!
        plusCount: function (id, price, catId){
            currentCount = Number(document.getElementById(`count_${id}`).innerHTML)
            console.log(currentCount)
            document.getElementById(`count_${id}`).innerHTML = currentCount + 1
            document.getElementById(`count_${id}`).setAttribute('value', currentCount + 1)

            currentPrice = Number(document.getElementById(`total_${id}`).innerHTML.replace(' ₽', ''))
            document.getElementById(`total_${id}`).innerHTML = (currentPrice + price) + ' ₽'
            document.getElementById(`total_${id}`).setAttribute('value', currentPrice + price)

            currentCatTotal = Number(document.getElementById(`catTotal_${catId}`).innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            document.getElementById(`catTotal_${catId}`).innerHTML = "Итого: " + (currentCatTotal + price) + " ₽"

            total = Number(document.getElementById(`total`).innerHTML.replace(' ₽', '').replace('Всего: ', ''))
            document.getElementById(`total`).innerHTML = "Всего: " + (total + price) + " ₽"
            
        },

        // del product item on BASKET PAGE
        delItem: function(id, catId) {
            
            current = Number(document.getElementById(`total_${id}`).innerHTML.replace(' ₽', ''))

            document.getElementById(`item_${id}`).remove()

            currentCatTotal = Number(document.getElementById(`catTotal_${catId}`).innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            document.getElementById(`catTotal_${catId}`).innerHTML = "Итого: " + (currentCatTotal - current) + " ₽"

            total = Number(document.getElementById(`total`).innerHTML.replace(' ₽', '').replace('Всего: ', ''))
            document.getElementById(`total`).innerHTML = "Всего: " + (total - current) + " ₽"
        },

        // save the current state of the order and redirect to the payment page
        busketNext: async function(event) {
            
            var orderId = await this.getOrderId();
            console.log(orderId)

            allItemCount = document.getElementsByClassName("product-calc__value")
            allItemPrice = document.getElementsByClassName("product__size-all product__size-all--ordering")
            allTotal = document.getElementById("total").getAttribute('value')
            order = {}

            for (var i = 0; i < allItemCount.length; i++) {
                var total = allItemPrice[i].getAttribute('value')
                var count = allItemCount[i].getAttribute('value')
                var item_id = allItemCount[i].getAttribute('id').replace('count_', '')
                order[item_id] = {'total': Number(total), 'count': Number(count)}
            }
            console.log(order)
            console.log(allTotal)
           
            // PUT REQUEST to /api/v1/order/{id}
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            const response = await fetch(`/api/v1/order/${orderId}/`, {
                headers: {
                  "Content-type": "application/json",
                  "X-CSRFTOKEN": token,
                },
                method: "PUT",
                body: JSON.stringify({'order': JSON.stringify(order), 'status': true, 'total': allTotal}),
              });
            

            location.href = '/payment'
        },

        // clear busket (delete all products)
        busketClear: async function() {
            var orderId = await this.getOrderId();
            allCategory = document.getElementsByClassName("ordering__item ordering-item")
            for (var i = 0; i < allCategory.length; i++) {
                allCategory[i].remove()
            }

            // PUT REQUEST to /api/v1/order/{id}
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            const response = await fetch(`/api/v1/order/${orderId}/`, {
                headers: {
                  "Content-type": "application/json",
                  "X-CSRFTOKEN": token,
                },
                method: "PUT",
                body: JSON.stringify({'order': JSON.stringify({}), 'status': false, 'total': 0}),
              });


            document.getElementById(`total`).innerHTML = "Всего: " + 0 + " ₽"
        },

        // request to create USER ORDER 
        sendOrder: async function(){
            var form = document.getElementById('form');
            var params = new FormData(form); 
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            const response =  await fetch("/payment/", {
                headers: {
                "X-CSRFTOKEN": token,
                },
                method: "POST",
                body: params,
            });
        }

    },
    mounted() {
        // this.total = localStorage.total;
        localStorage.order = {}
    },
    watch: {
        total(newName) {
            // localStorage.total = this.total;
        }
    }
});



