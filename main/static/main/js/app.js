
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
        countPlus(id, price, availability) {
            // + count product

            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            this.order[id][availability] = { 'total': this.order[id][availability].total + price, 'count': this.order[id][availability].count + 1}

            // total in head
            document.getElementById('total').innerHTML =  (current + price) + ' ₽'
            document.getElementById(`total_${availability}`).innerHTML =  (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) + price) + ' ₽'
            
            // localStorage.total = localStorage.total + this.order[id].total
            localStorage.setItem("order", JSON.stringify(this.order))
            console.log(this.order)
            
        },
        countMinus(id, price, availability) {
            // - count product
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            if (this.order[id][availability].count > 0) {
                this.order[id][availability] = { 'total': this.order[id][availability].total - price, 'count': this.order[id][availability].count - 1}

                document.getElementById('total').innerHTML =  (current - price) + ' ₽'
                document.getElementById(`total_${availability}`).innerHTML =  (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) - price) + ' ₽'
                
                // localStorage.total = localStorage.total - this.order[id].total
                localStorage.setItem("order", JSON.stringify(this.order))
            } else {
                var calc = document.getElementById(`calc_${availability}_${id}`)
                var add = document.getElementById(`add_${availability}_${id}`)
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
        displayCalc(id, availability) {
            if (availability == "stock") {
                var add = document.getElementById('add_stock_'+id)
                var calc = document.getElementById('calc_stock_'+id)
            } else if (availability == "way") {
                var add = document.getElementById('add_way_'+id)
                var calc = document.getElementById('calc_way_'+id)
            } else if (availability == "remote") {
                var add = document.getElementById('add_remote_'+id)
                var calc = document.getElementById('calc_remote_'+id)
            }

            add.style.display = "none"
            calc.style.display = ""
        },

        inputCount(id, price, availability) {
            // control count, price and total by input
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            input = document.getElementById(`input_${availability}_${id}`)
            
            this.order[id][availability] = { 'total': Number(input.value)*price, 'count': Number(input.value)}

            // totals in head 
            var total = 0
            var total_way = 0
            var total_stock = 0
            var total_remote = 0
            for (var i in this.order) {
                total_way += this.order[i]['way'].total
                total_stock += this.order[i]['stock'].total
                total_remote += this.order[i]['remote'].total
                total += this.order[i]['remote'].total + this.order[i]['way'].total + this.order[i]['stock'].total
            }

            document.getElementById(`total_way`).innerHTML = (total_way) + ' ₽'
            document.getElementById(`total_stock`).innerHTML = (total_stock) + ' ₽'
            document.getElementById(`total_remote`).innerHTML = (total_remote) + ' ₽'
            document.getElementById('total').innerHTML = (total) + ' ₽'
            
        },
        displayAvailabilityList(id) {
            availabilityList = document.getElementById('availabilityList_'+id)
            if (availabilityList.style.display == 'none') {
                availabilityList.style.display = ''
            } else {
                availabilityList.style.display = 'none'
            }
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
        }
    },


    template: `
    <div class="main-content__body main-body">
    <div id="result"></div>
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
                                    <div class="product product--main accordion" style="display:" :id="'product_'+item.id">
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

                                            <ul class="list-reset product__right-list stock" v-if="item.availability.stock != 0">
                                                <li class="product__right-item product__right-item--main ">
                                                    <button class="btn-reset product__presence" @click="displayAvailabilityList(item.id)">В наличии</button>
                                                    <div class="product__residue">{{ item.availability.stock }}</div>

                                                    <button @click="displayCalc(item.id, 'stock')" :id="'add_stock_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                    <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                        Добавить
                                                    </button>

                                                    <div class="product__calc product-calc" :id="'calc_stock_'+item.id" style="display:none">
                                                    
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'stock')"></button>
                                                    <div class="product-calc__value">
                                                        <input type="number" @keyup.enter="inputCount(item.id, item.price, 'stock')" :id="'input_stock_'+item.id" v-model="order[item.id]['stock'].count" class="input input--calc">
                                                        
                                                    </div>
                                                    
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'stock')"></button>
                                                    </div>
                                                    <div class="product__size">{{ item.price }} ₽</div>
                                                    <div class="product__size-all"> {{ order[item.id]['stock'].total }} ₽</div>
                                                </li>
                                            </ul>

                                            <ul class="list-reset product__right-list way" v-else-if="item.availability.way != 0 && item.availability.stock == 0">
                                                <li class="product__right-item" v-if="item.availability.way != none && item.availability.way != 0">
                                                <button class="btn-reset product__presence product__presence--blue" @click="displayAvailabilityList(item.id)">В пути</button>
                                                <div class="product__residue">{{ item.availability.way }}</div>
                                                <button @click="displayCalc(item.id, 'way')" :id="'add_way_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                    Добавить
                                                </button>

                                                <div class="product__calc product-calc" :id="'calc_way_'+item.id" style="display:none">
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'way')"></button>
                                                <div class="product-calc__value">
                                                    <input type="number" @keyup.enter="inputCount(item.id, item.price, 'way')" :id="'input_way_'+item.id" v-model="order[item.id]['way'].count" class="input input--calc">
                                                    
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'way')"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>
                                                <div class="product__size-all"> {{ order[item.id]['way'].total }} ₽</div>
                                                </li>

                                            </ul>

                                            <ul v-else-if="item.availability.remote != 0 && item.availability.stock == 0" class="list-reset product__right-list remote">
                                                <li class="product__right-item" v-if="item.availability.remote != none && item.availability.remote != 0">
                                                <button class="btn-reset product__presence product__presence--orange" @click="displayAvailabilityList(item.id)">Удаленный склад</button>
                                                <div class="product__residue">{{ item.availability.remote }}</div>
                                                <button @click="displayCalc(item.id, 'remote')" :id="'add_remote_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                    Добавить
                                                </button>

                                                <div class="product__calc product-calc" :id="'calc_remote_'+item.id" style="display:none">
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'remote')"></button>
                                                <div class="product-calc__value">
                                                    <input type="number" @keyup.enter="inputCount(item.id, item.price, 'remote')" :id="'input_remote_'+item.id" v-model="order[item.id]['remote'].count" class="input input--calc">
                                                    
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'remote')"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>
                                                <div class="product__size-all"> {{ order[item.id]['remote'].total }} ₽</div>
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="product-accordion-content product-accordion-content--open" :id="'availabilityList_'+item.id" style="display:none">
                                        <ul class="list-reset product__right-list product__right-list--accordion">
                                            <li class="product__right-item way" v-if="item.availability.way != none && item.availability.way != 0 && item.availability.stock != 0">
                                                <div class="product__presence product__presence--blue">В пути
                                                </div>
                                                <div class="product__residue">{{ item.availability.way }}</div>
                                                <button @click="displayCalc(item.id, 'way')" :id="'add_way_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                    Добавить
                                                </button>

                                                <div class="product__calc product-calc" :id="'calc_way_'+item.id" style="display:none">
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'way')"></button>
                                                <div class="product-calc__value">
                                                    <input type="number" @keyup.enter="inputCount(item.id, item.price, 'way')" :id="'input_way_'+item.id" v-model="order[item.id]['way'].count" class="input input--calc">
                                                    
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'way')"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>
                                                <div class="product__size-all"> {{ order[item.id]['way'].total }} ₽</div>
                                            </li>
                                            <li class="product__right-item remote" v-if="(item.availability.remote != none && item.availability.remote != 0) && (item.availability.stock != 0 || item.availability.way != 0)">
                                                <div class="product__presence product__presence--orange">Удаленный склад
                                                </div>
                                                <div class="product__residue">{{ item.availability.remote }}</div>
                                                <button @click="displayCalc(item.id, 'remote')" :id="'add_remote_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                    Добавить
                                                </button>

                                                <div class="product__calc product-calc" :id="'calc_remote_'+item.id" style="display:none">
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'remote')"></button>
                                                <div class="product-calc__value">
                                                    <input type="number" @keyup.enter="inputCount(item.id, item.price, 'remote')" :id="'input_remote_'+item.id" v-model="order[item.id]['remote'].count" class="input input--calc">
                                                    
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'remote')"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>
                                                <div class="product__size-all"> {{ order[item.id]['remote'].total }} ₽</div>
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

        availability: 'Наличие',
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
                    order[content[i].id] = { 'stock': {'total': 0, 'count': 0}, 'way': {'total': 0, 'count': 0}, 'remote': {'total': 0, 'count': 0}}
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
        editHead : function(availability, price, action) {
            var total = document.getElementById('total')
            currentTotal = Number(total.innerHTML.replace(' ₽', '').replace('Всего: ', ''))
            
            totalAvailability = document.getElementById(`total_${availability}`)
            currentTotalAvailability = Number(totalAvailability.innerHTML.replace(' ₽', ''))

            switch (action) {
                case 'minus':
                    total.innerHTML = 'Всего: ' + (currentTotal - price) + ' ₽'
                    totalAvailability.innerHTML = (currentTotalAvailability - price) + ' ₽'
                    break;
                case 'plus':
                    total.innerHTML = 'Всего: ' + (currentTotal + price) + ' ₽'
                    totalAvailability.innerHTML  = (currentTotalAvailability + price) + ' ₽'
                    break;
                case 'del':
                    total.innerHTML = 'Всего: ' + (currentTotal - price) + ' ₽'
                    totalAvailability.innerHTML  = (currentTotalAvailability - price) + ' ₽'
                    break;
            }
                
        },

        // - quantity of goods on BASKET PAGE (changing variables on the page by id)
        // needs optimization !!
        minusCount: function (id, availability, price, category){

            count = document.getElementById(`count_${id}_${availability}`)
            count.innerHTML = Number(count.innerHTML) - 1

            total = document.getElementById(`total_${id}_${availability}`)
            total.innerHTML = (Number(total.innerHTML.replace(' ₽', '')) - price) + ' ₽'

            categoryTotal = document.getElementById(`${category}`)
            curentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            categoryTotal.innerHTML = "Итого: " + (curentCategoryTotal - price) + " ₽"

            this.editHead(availability, price, 'minus')

            // all data item
            total.setAttribute('value', `${id}_${availability}_${Number(total.innerHTML.replace(' ₽', ''))}_${Number(count.innerHTML)}`)


        },
        // + quantity of goods on BASKET PAGE (changing variables on the page by id)
        // needs optimization !!
        plusCount: function (id, availability, price, category){

            console.log(id, availability, price)
            count = document.getElementById(`count_${id}_${availability}`)
            count.innerHTML = Number(count.innerHTML) + 1

            total = document.getElementById(`total_${id}_${availability}`)
            total.innerHTML = (Number(total.innerHTML.replace(' ₽', '')) + price) + ' ₽'
            
            categoryTotal = document.getElementById(`${category}`)
            console.log(categoryTotal)
            curentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            categoryTotal.innerHTML = "Итого: " + (curentCategoryTotal + price) + " ₽"

            this.editHead(availability, price, 'plus')

            total.setAttribute('value', `${id}_${availability}_${Number(total.innerHTML.replace(' ₽', ''))}_${Number(count.innerHTML)}`)
        },

        // del product item on BASKET PAGE
        del: function(id, availability, price, category) {
            
            currentTotalItem = Number(document.getElementById(`total_${id}_${availability}`).innerHTML.replace(' ₽', ''))

            item = document.getElementById(`item_${id}_${availability}`)
            item.remove();

            categoryTotal = document.getElementById(`${category}`)
            currentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            categoryTotal.innerHTML = "Итого: " + (currentCategoryTotal - currentTotalItem) + " ₽"

            console.log(id, availability, price)

            this.editHead(availability, currentTotalItem, 'del')


        },

        // save the current state of the order and redirect to the payment page
        busketNext: async function(event) {
            
            var orderId = await this.getOrderId();

            allItemValues = document.getElementsByClassName("product__size-all product__size-all--ordering")
            order = {}
            var allTotal = document.getElementById('total')
            currentAllTotal = Number(allTotal.innerHTML.replace(' ₽', '').replace('Всего: ', ''))
            for (var i = 0; i < allItemValues.length; i++) {
                values = allItemValues[i].getAttribute("value").split("_")
                id = values[0]
                var availability = values[1]
                total = values[2]
                count = values[3]
                if (id in order) {
                    order[id][availability] = {'total': Number(total), 'count': Number(count)}
                } else {
                    order[id] = {}
                    order[id][availability] = {'total': Number(total), 'count': Number(count)}
                }
                
            }

            // console.log(order)
           
            // // PUT REQUEST to /api/v1/order/{id}
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            const response = await fetch(`/api/v1/order/${orderId}/`, {
                headers: {
                  "Content-type": "application/json",
                  "X-CSRFTOKEN": token,
                },
                method: "PUT",
                body: JSON.stringify({'order': JSON.stringify(order), 'status': true, 'total': currentAllTotal}),
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
        },

        // catalog filter product status
        filterByProductStatus: function() {
            var filter_availability = document.getElementsByClassName('select-selected')[0].innerHTML
            
            if (filter_availability.includes('В наличии') == true) {
                var availability_filter = 'stock'
            } else if (filter_availability.includes('Удаленный склад') == true) {
                var availability_filter = 'remote'
            } else if (filter_availability.includes('пути') == true) {
                var availability_filter = 'way'
            }
                   
            console.log(availability_filter);

            for (var i in this.products) {
                for (content in this.products[i].content) {
                    var status = this.products[i].content[content].product_status.name;
                    var availability = this.products[i].content[content].availability[availability_filter];
                    
                    if (this.status.length != 0) {
                        if (this.status.includes(status)) {
                            document.getElementById(`product_${this.products[i].content[content].id}`).style.display = '';
                            document.getElementById(`availabilityList_${this.products[i].content[content].id}`).style.display = 'none';

                        } else {
                            document.getElementById(`product_${this.products[i].content[content].id}`).style.display = 'none';
                            document.getElementById(`availabilityList_${this.products[i].content[content].id}`).style.display = 'none';
                        } 
                    } else {
                        if (availability != undefined) {
                            if (availability > 0) {
                                document.getElementById(`product_${this.products[i].content[content].id}`).style.display = '';
                                document.getElementById(`availabilityList_${this.products[i].content[content].id}`).style.display = 'none';
                            } else {
                                document.getElementById(`product_${this.products[i].content[content].id}`).style.display = 'none';
                                document.getElementById(`availabilityList_${this.products[i].content[content].id}`).style.display = 'none';
                            }
                        } else {
                            document.getElementById(`product_${this.products[i].content[content].id}`).style.display = '';
                            document.getElementById(`availabilityList_${this.products[i].content[content].id}`).style.display = 'none';
                        }
                    }
                    
                }
            }
            
        
        }
            // console.log(this.products);
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



