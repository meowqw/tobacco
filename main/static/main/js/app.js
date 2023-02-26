
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
        countPlus(id, price, availability, carton_count) {
            // + count product

            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            this.order[id][availability] = { 'total': this.order[id][availability].total + price, 'count': this.order[id][availability].count + 1 }

            // total in head
            document.getElementById('total').innerHTML = (current + price) + ' ₽'
            document.getElementById(`total_${availability}`).innerHTML = (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) + price) + ' ₽'


            this.order[id][availability]['carton'] = this.order[id][availability]['count'] / carton_count | 0
            this.order[id][availability]['remainder'] = this.order[id][availability]['count'] - (this.order[id][availability]['carton'] * carton_count)

            localStorage.setItem("order", JSON.stringify(this.order))


        },

        countMinus(id, price, availability, carton_count) {
            // - count product
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            if (this.order[id][availability].count > 0) {
                this.order[id][availability] = { 'total': this.order[id][availability].total - price, 'count': this.order[id][availability].count - 1 }

                document.getElementById('total').innerHTML = (current - price) + ' ₽'
                document.getElementById(`total_${availability}`).innerHTML = (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) - price) + ' ₽'

                this.order[id][availability]['carton'] = this.order[id][availability]['count'] / carton_count | 0
                this.order[id][availability]['remainder'] = this.order[id][availability]['count'] - (this.order[id][availability]['carton'] * carton_count)

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
                document.getElementById('categoryProduct_' + id).classList.add('ui-accordion-header-active')
                document.getElementById('catTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-s')
                el.style.display = ""
            } else {
                el.style.display = "none"
                document.getElementById('categoryProduct_' + id).classList.remove('ui-accordion-header-active')
                document.getElementById('catTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-e')
            }

            this.rerenderProducts();
        },
        displayProducts(id) {

            var el = document.getElementById(id + "_products")
            if (el.style.display == "none") {
                document.getElementById('subcategoryProduct_' + id).classList.add('ui-accordion-header-active')
                document.getElementById('subCatTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-s')
                el.style.display = ""
            } else {
                document.getElementById('subCatTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-e')
                el.style.display = "none"
                document.getElementById('subcategoryProduct_' + id).classList.remove('ui-accordion-header-active')
            }
        },
        displayCalc(id, availability) {
            if (availability == "stock") {
                var add = document.getElementById('add_stock_' + id)
                var calc = document.getElementById('calc_stock_' + id)
            } else if (availability == "way") {
                var add = document.getElementById('add_way_' + id)
                var calc = document.getElementById('calc_way_' + id)
            } else if (availability == "remote") {
                var add = document.getElementById('add_remote_' + id)
                var calc = document.getElementById('calc_remote_' + id)
            }

            add.style.display = "none"
            calc.style.display = ""
        },

        inputCount(id, price, availability, carton_count) {
            // control count, price and total by input
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            input = document.getElementById(`input_${availability}_${id}`)

            this.order[id][availability] = { 'total': Number(input.value) * price, 'count': Number(input.value) }

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

            this.order[id][availability]['carton'] = this.order[id][availability]['count'] / carton_count | 0
            this.order[id][availability]['remainder'] = this.order[id][availability]['count'] - (this.order[id][availability]['carton'] * carton_count)

            localStorage.setItem("order", JSON.stringify(this.order))

        },
        displayAvailabilityList(id, availability) {
            availability_arr = [availability.way, availability.stock, availability.remote]

            availabilityZero = 0
            for (var i in availability_arr) {
                if (availability_arr[i] == 0) {
                    availabilityZero++;
                }
            }
            console.log(availabilityZero);
            if (availabilityZero != 2) {
                availabilityList = document.getElementById('availabilityList_' + id)
                if (availabilityList.style.display == 'none') {
                    availabilityList.style.display = ''

                    document.getElementById('availabilityListBtn_' + id).classList.add('product__presence--active')

                } else {
                    availabilityList.style.display = 'none'
                    document.getElementById('availabilityListBtn_' + id).classList.remove('product__presence--active')

                }
            }


        },
        // удалить стрелки у товаров которые етсь только в одном наличии 
        rerenderProducts: function () {
            for (var i in this.products) {
                product = this.products[i];
                for (var j in product.content) {
                    lists = product.content[j]
                    for (list in lists) {
                        item = lists[list];
                        availabilitys = [item.availability.way, item.availability.remote, item.availability.stock]
                        max = Math.max(...availabilitys);
                        let result = availabilitys.reduce(function (sum, elem) {
                            return sum + elem;
                        }, 0);
                        if (max == result) {
                            btn = document.getElementById(`availabilityListBtn_${item.id}`)
                            btn.classList.add("product__presence--not-arrow")
                        }
                    }
                }
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
    <ul class="list-reset main-body__list accordion" style="margin-top: 15px;" v-for="product in products">
        
        <li :class="'main-body__item accordion-item--'+product.color">
            <button class="btn-reset btn--accordion main-body__accordion accordion-header" :id="'categoryProduct_'+product.category" @click="displayProductList(product.category)">
            <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e" :id="'catTriagle_'+product.category"></span>
            {{ product.category }}</button>
            <div class="main-body__panel" :id="product.category" style="display:none">
                <ul class="list-reset main-body__sublist accordion accordion-child" v-for="(content, list) in product.content" style="margin-top: 10px;">
                    <li class="main-body__subitem accordion-item">
                        <button class="btn-reset btn--accordion main-body__accordion accordion-header" @click="displayProducts(list)" :name="'subcategoryProduct_'+product.category" :id="'subcategoryProduct_'+list">
                        <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e" :id="'subCatTriagle_'+list"></span>
                            {{list.split(';')[0]}}
                            

                            <div class="tooltip" v-if="list.split(';')[1] != 'null' && list.split(';')[2] != 'null'">
                                <img loading="lazy" src="/static/main/img/tooltip.svg" class="image" width="20" height="20"
                                    alt="tooltip">
                                <span class="tooltip__text">
                                    <ul class="list-reset tooltip__list">
                                        <li class="tooltip__item">Блок {{list.split(';')[2]}} шт.</li>
                                        <li class="tooltip__item">РРЦ {{list.split(';')[1]}} ₽/шт.</li>
                                    </ul>
                                </span>
                            </div>
                        </button>
                        <div class="main-body__panel" :id="list + '_products'" :name="product.category" style="display:none">
                            <ul class="list-reset main-body__sublist" v-for="item in content" style="margin-top:10px;">
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
                                                    <button :id="'availabilityListBtn_'+item.id" class="btn-reset product__presence" @click="displayAvailabilityList(item.id, item.availability)">В наличии</button>
                                                    <div class="product__residue">{{ item.availability.stock }}</div>

                                                    <button @click="displayCalc(item.id, 'stock')" :id="'add_stock_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                    <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                        Добавить
                                                    </button>

                                                    <div class="product__calc product-calc" :id="'calc_stock_'+item.id" style="display:none">
                                                    
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'stock', list.split(';')[2])"></button>

                                                    <div class="product-calc__value">
                                                        <input type="number" v-on:input="inputCount(item.id, item.price, 'stock', list.split(';')[2])" :id="'input_stock_'+item.id" v-model="order[item.id]['stock'].count" class="input input--calc">
                                                      
                                                        <span v-if="list.split(';')[1] != 'null' && list.split(';')[2] != 'null'">{{ order[item.id]['stock'].carton }} блоков <br> {{order[item.id]['stock'].count - (list.split(';')[2] * order[item.id]['stock'].carton)}} шт</span>
                                                    </div>
                                                    
                                                    <button
                                                        class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'stock', list.split(';')[2])"></button>
                                                    </div>
                                                    <div class="product__size">{{ item.price }} ₽</div>
                                                    <div class="product__size-all" style="color:gray;" v-if="order[item.id]['stock'].total == 0"> {{ order[item.id]['stock'].total }} ₽</div>
                                                    <div class="product__size-all" v-else > {{ order[item.id]['stock'].total }} ₽</div>


                                                </li>
                                            </ul>

                                            <ul class="list-reset product__right-list way" v-else-if="item.availability.way != 0 && item.availability.stock == 0">
                                                <li class="product__right-item" v-if="item.availability.way != none && item.availability.way != 0">
                                                <button :id="'availabilityListBtn_'+item.id" class="btn-reset product__presence product__presence--blue" @click="displayAvailabilityList(item.id, item.availability)">В пути</button>
                                                <div class="product__residue">{{ item.availability.way }}</div>
                                                <button @click="displayCalc(item.id, 'way')" :id="'add_way_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                    Добавить
                                                </button>

                                                <div class="product__calc product-calc" :id="'calc_way_'+item.id" style="display:none">
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'way')"></button>
                                                <div class="product-calc__value">
                                                    <input type="number" v-on:input="inputCount(item.id, item.price, 'way', list.split(';')[2])" :id="'input_way_'+item.id" v-model="order[item.id]['way'].count" class="input input--calc">
                                                    <span v-if="list.split(';')[1] != 'null' && list.split(';')[2] != 'null'">{{ order[item.id]['way'].carton }} блоков <br> {{order[item.id]['way'].count - (list.split(';')[2] * order[item.id]['way'].carton)}} шт</span>
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'way', list.split(';')[2])"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>
                                                <div class="product__size-all" style="color:gray;" v-if="order[item.id]['way'].total == 0"> {{ order[item.id]['way'].total }} ₽</div>
                                                <div class="product__size-all" v-else > {{ order[item.id]['way'].total }} ₽</div>
                                                </li>

                                            </ul>

                                            <ul v-else-if="item.availability.remote != 0 && item.availability.stock == 0" class="list-reset product__right-list remote">
                                                <li class="product__right-item" v-if="item.availability.remote != none && item.availability.remote != 0">
                                                <button :id="'availabilityListBtn_'+item.id" class="btn-reset product__presence product__presence--orange" @click="displayAvailabilityList(item.id, item.availability)">Удаленный склад</button>
                                                <div class="product__residue">{{ item.availability.remote }}</div>
                                                <button @click="displayCalc(item.id, 'remote')" :id="'add_remote_'+item.id" class="btn-reset btn btn--product product__btn" style="display:">
                                                <img loading="lazy" src="/static/main/img/path.svg" class="image" width="22" height="22" alt="path">
                                                    Добавить
                                                </button>

                                                <div class="product__calc product-calc" :id="'calc_remote_'+item.id" style="display:none">
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--minus" @click="countMinus(item.id, item.price, 'remote')"></button>
                                                <div class="product-calc__value">
                                                    <input type="number" v-on:input="inputCount(item.id, item.price, 'remote', list.split(';')[2])" :id="'input_remote_'+item.id" v-model="order[item.id]['remote'].count" class="input input--calc">
                                                    <span v-if="list.split(';')[1] != 'null' && list.split(';')[2] != 'null'">{{ order[item.id]['remote'].carton }} блоков <br> {{order[item.id]['remote'].count - (list.split(';')[2] * order[item.id]['remote'].carton)}} шт</span>
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'remote', list.split(';')[2])"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>

                                                <div class="product__size-all" style="color:gray;" v-if="order[item.id]['remote'].total == 0"> {{ order[item.id]['remote'].total }} ₽</div>
                                                <div class="product__size-all" v-else > {{ order[item.id]['remote'].total }} ₽</div>
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
                                                    <input type="number" v-on:input="inputCount(item.id, item.price, 'way', list.split(';')[2])" :id="'input_way_'+item.id" v-model="order[item.id]['way'].count" class="input input--calc">
                                                    <span v-if="list.split(';')[1] != 'null' && list.split(';')[2] != 'null'">{{ order[item.id]['way'].carton }} блоков <br> {{order[item.id]['way'].count - (list.split(';')[2] * order[item.id]['way'].carton)}} шт</span>
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'way', list.split(';')[2])"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>

                                                <div class="product__size-all" style="color:gray;" v-if="order[item.id]['way'].total == 0"> {{ order[item.id]['way'].total }} ₽</div>
                                                <div class="product__size-all" v-else > {{ order[item.id]['way'].total }} ₽</div>
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
                                                    <input type="number" v-on:input="inputCount(item.id, item.price, 'remote', list.split(';')[2])" :id="'input_remote_'+item.id" v-model="order[item.id]['remote'].count" class="input input--calc">
                                                    <span v-if="list.split(';')[1] != 'null' && list.split(';')[2] != 'null'">{{ order[item.id]['remote'].carton }} блоков <br> {{order[item.id]['remote'].count - (list.split(';')[2] * order[item.id]['remote'].carton)}} шт</span>
                                                </div>
                                                
                                                <button
                                                    class="btn-reset product-calc__btn product-calc__btn--plus" @click="countPlus(item.id, item.price, 'remote', list.split(';')[2])"></button>
                                                </div>
                                                <div class="product__size">{{ item.price }} ₽</div>

                                                <div class="product__size-all" style="color:gray;" v-if="order[item.id]['remote'].total == 0"> {{ order[item.id]['remote'].total }} ₽</div>
                                                <div class="product__size-all" v-else > {{ order[item.id]['remote'].total }} ₽</div>
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

        weight: [],

        // totals 
        total: 0,
        totalOne: 0,
        totalTwo: 0,
        totalThree: 0,

        availability: [],

        // current order list
        currentOrderId: '',
        status: [],

        paymentStatus: [],
        address: [],

        noneProduct: [],

        content: 'banners',

        order: null,
        orderTotal: null,
    },
    methods: {

        // get product list by category
        getContent(id) {
            // GET REQUEST to /api/v1/productbycat/{id}

            axios
                .get(`/api/v1/productbycat/${id}?availability=${this.availability.join(',')}&weight=${this.weight.join(',')}&status=${this.status.join(',')}`)
                .then(response => (this.contentController(response.data.products)));
        },
        redirectMenu(id) {
            console.log(id)
            localStorage.setItem('redirectItem', id);
            location.href = '/main/'
        },

        getOrder: async function () {
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value

            const response = await fetch(`/basket`, {
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFTOKEN": token,
                },
                // body: JSON.stringify({'is_executor': type}),
                method: "GET",
            });

            return response.json();
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
            // замена основной области на каталог, если она не такова
            this.changeContentOnCatalog()


            var products = this.products;
            if (content.length > 0) {
                var order = {};

                var list = {}
                for (i = 0; i < content.length; i++) {
                    order[content[i].id] = { 'stock': { 'total': 0, 'count': 0, 'carton': 0 }, 'way': { 'total': 0, 'count': 0, 'carton': 0 }, 'remote': { 'total': 0, 'count': 0, 'carton': 0 } }

                    productList = `${content[i]['list']['name']};${content[i]['list']['rrc']};${content[i]['list']['carton']}`
                    if (productList in list) {
                        list[productList].push(content[i])
                    } else {
                        list[productList] = [content[i]]
                    }
                }

                categoryName = content[0]['category']['name'];
                console.log(content[0]['category'])
                categoryId = content[0]['category']['id'];


                console.log(list)

                if (this.openedCategory.includes(categoryId) == false) {
                    var color = document.getElementById('categoryBtn_' + categoryId).getAttribute('color')
                    products.push({ 'category': categoryName, 'content': list, 'order': order, 'total': this.total, 'color': color });
                    this.products = products;

                    // check category is opened
                    this.openedCategory.push(categoryId);
                    var color = document.getElementById('categoryBtn_' + categoryId).getAttribute('color')
                    document.getElementById('categoryBtn_' + categoryId).className = `btn-reset sidebar__btn sidebar__btn--sub sidebar__btn--active sidebar__btn--active-${color}`

                    document.getElementById('catalogCategory_' + categoryId).className = `btn-reset menu__link menu__link--active menu__link--active-${color}`


                    var id = document.getElementById('catalogCategory_' + categoryId).getAttribute('category')


                    el = document.getElementById('sidebar_' + id)



                    if (!el.classList.contains('activate')) {
                        // el.style.display = ''
                        el.classList.add('activate')
                        el.style.height = 'auto';
                        let height = el.clientHeight + "px";
                        el.style.height = '0px';

                        setTimeout(function () {
                            el.style.height = height;
                        }, 0);

                        document.getElementById('categoryTab_' + id).classList.add('ui-accordion-header-active')
                        document.getElementById('categoryTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-s')
                    }
                } else {

                    var id = document.getElementById('catalogCategory_' + categoryId).getAttribute('category')
                    el = document.getElementById('sidebar_' + id)

                    var activeCount = 0
                    for (var i in el.getElementsByTagName('button')) {
                        var nameClass = el.getElementsByTagName('button')[i].className
                        if (nameClass !== undefined) {
                            if (nameClass.includes('active')) {
                                activeCount++;
                            }
                        }

                    }
                    console.log(activeCount)

                    // del element from board
                    for (var i = 0; i < this.products.length; i++) {
                        if (this.products[i].category == categoryName) {
                            this.products.splice(i, 1)
                            const index = this.openedCategory.indexOf(categoryId);
                            this.openedCategory.splice(index, 1)
                            console.log(categoryName)
                            document.getElementById('categoryBtn_' + categoryId).className = "btn-reset sidebar__btn sidebar__btn--sub"
                            document.getElementById('catalogCategory_' + categoryId).className = "btn-reset menu__link"


                        }
                    }

                    if (activeCount < 2) {
                        document.getElementById('categoryTab_' + id).classList.remove('ui-accordion-header-active')
                        document.getElementById('categoryTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-e')
                        el.style.height = '0px';

                        el.addEventListener('transitionend', function () {
                            el.classList.remove('activate');
                        }, {
                            once: true
                        });
                    }
                }
                localStorage.products = this.products
            }
            
        },

        // request on create order (Intermediate) and redirect to basket
        createOrder: async function (event) {
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            total = Number(document.getElementById(`total`).innerHTML.replace(' ₽', ''))

            if (total > 0) {
                order = {}
                for (var key in JSON.parse(localStorage.order)) {
                    if (JSON.parse(localStorage.order)[key].count != 0) {
                        order[key] = JSON.parse(localStorage.order)[key]
                    }
                }
                // POST REQUEST to /api/v1/order/
                const response = await fetch("/api/v1/order/", {
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFTOKEN": token,
                    },
                    method: "POST",
                    body: JSON.stringify({ 'order': JSON.stringify(order), 'status': true, 'total': localStorage.total }),
                });

                // this.order = { 'order': order, 'status': true, 'total': localStorage.total }

                order = await this.getOrder();
                this.order = order.order;
                this.orderTotal = order.total;

                console.log(order)
                this.content = 'basket';
                document.getElementById("basketScreen").style.display = "";
                document.getElementById("mainScreen").style.display = "none";
                document.getElementById("headerRight").style.display = "none";
            }
        },
        editHead: function (availability, price, action) {
            var total = document.getElementById('total_basket')
            currentTotal = Number(total.innerHTML.replace(' ₽', '').replace('Всего: ', ''))

            totalAvailability = document.getElementById(`total_${availability}_basket`)
            currentTotalAvailability = Number(totalAvailability.innerHTML.replace(' ₽', ''))

            switch (action) {
                case 'minus':
                    this.orderTotal['total'] = currentTotal - price
                    this.orderTotal[availability] = currentTotalAvailability - price
                    // total.innerHTML = 'Всего: ' + (currentTotal - price) + ' ₽'
                    // totalAvailability.innerHTML = () + ' ₽'
                    

                    break;
                case 'plus':
                    // this.orderTotal['total'] += price
                    // this.orderTotal[availability] += price
                    this.orderTotal['total'] = currentTotal + price
                    this.orderTotal[availability] = currentTotalAvailability + price

                    

                    break;
                case 'del':
                    // total.innerHTML = 'Всего: ' + (currentTotal - price) + ' ₽'
                    // totalAvailability.innerHTML = (currentTotalAvailability - price) + ' ₽'
                    this.orderTotal['total'] = currentTotal - price
                    this.orderTotal[availability] = currentTotalAvailability - price
                    break;
            }

        },

        // - quantity of goods on BASKET PAGE (changing variables on the page by id)
        // needs optimization !!
        minusCount: function (id, availability, price, category, carton_count) {

            count = document.getElementById(`count_${id}_${availability}`)
            count.value = Number(count.value) - 1

            // total = document.getElementById(`total_${id}_${availability}`)
            // total.innerHTML = (Number(total.innerHTML.replace(' ₽', '')) - price) + ' ₽'

            // categoryTotal = document.getElementById(`${category}`)
            // curentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            // categoryTotal.innerHTML = "Итого: " + (curentCategoryTotal - price) + " ₽"

            this.editHead(availability, price, 'minus')

            carton = document.getElementById(`carton_${id}_${availability}`)
            // carton.innerHTML = Number(count.value) / carton_count | 0

            carton_num = Number(count.value) / carton_count | 0

            remainder = document.getElementById(`remainder_${id}_${availability}`)
            // remainder.innerHTML = Number(count.value) - (carton_num * carton_count)

            remainder_num = Number(Number(count.value) - (carton_num * carton_count))

            // all data item
            // total.setAttribute('value', `${id}_${availability}_${Number(total.innerHTML.replace(' ₽', ''))}_${Number(count.value)}_${category}_${Number(carton_num)}_${Number(remainder_num)}`)

            // пересчет в каталоге
            for (var i in this.products) {
                Orders = this.products[i].order
                Orders[id][availability]['count'] -= 1
                Orders[id][availability]['total'] -= price 
            }

            // новый кальк
            for (var i in this.order[category].items) {
                if (this.order[category].items[i].item.id == id) {
                    this.order[category].items[i]['availability'][availability].total -= price
                    this.order[category].items[i]['availability'][availability].count -= 1
                    this.order[category].items[i]['availability'][availability].carton = Number(count.value) / carton_count | 0
                    this.order[category].items[i]['availability'][availability].remainder = Number(Number(count.value) - (carton_num * carton_count))
                }
            }

            this.order[category].total -= price 
            
            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
          
            document.getElementById('total').innerHTML = (current - price) + ' ₽'
            document.getElementById(`total_${availability}`).innerHTML = (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) - price) + ' ₽'


        },
        // + quantity of goods on BASKET PAGE (changing variables on the page by id)
        // needs optimization !!
        plusCount: function (id, availability, price, category, carton_count) {

            // console.log(id, availability, price, category)
            count = document.getElementById(`count_${id}_${availability}`)
            count.value = Number(count.value) + 1

            // total = document.getElementById(`total_${id}_${availability}`)
            // total.innerHTML = (Number(total.innerHTML.replace(' ₽', '')) + price) + ' ₽'

            // categoryTotal = document.getElementById(`${category}`)
            // console.log(categoryTotal)
            // curentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            // categoryTotal.innerHTML = "Итого: " + (curentCategoryTotal + price) + " ₽"

            this.editHead(availability, price, 'plus')

            carton = document.getElementById(`carton_${id}_${availability}`)
            // carton.innerHTML = Number(count.value) / carton_count | 0

            carton_num = Number(count.value) / carton_count | 0

            remainder = document.getElementById(`remainder_${id}_${availability}`)
            // remainder.innerHTML = Number(count.value) - (carton_num * carton_count)

            remainder_num = Number(Number(count.value) - (carton_num * carton_count))

            // total.setAttribute('value', `${id}_${availability}_${Number(total.innerHTML.replace(' ₽', ''))}_${Number(count.value)}_${category}_${Number(carton_num)}_${Number(remainder_num)}`)

            // пересчет в каталоге
            for (var i in this.products) {
                Orders = this.products[i].order
                if (id in Orders) {
                    Orders[id][availability]['count'] += 1
                    Orders[id][availability]['total'] += price 
                }
            }

            // новый кальк
            for (var i in this.order[category].items) {
                if (this.order[category].items[i].item.id == id) {
                    this.order[category].items[i]['availability'][availability].total += price
                    this.order[category].items[i]['availability'][availability].count += 1
                    this.order[category].items[i]['availability'][availability].carton = Number(count.value) / carton_count | 0
                    this.order[category].items[i]['availability'][availability].remainder = Number(Number(count.value) - (carton_num * carton_count))


                }
            }

            this.order[category].total += price 

            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))

            // total in head
            document.getElementById('total').innerHTML = (current + price) + ' ₽'
            document.getElementById(`total_${availability}`).innerHTML = (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) + price) + ' ₽'

        },

        inputCalc: function (id, availability, price, category, carton_count) {
            count = document.getElementById(`count_${id}_${availability}`)
            // count.value = Number(count.value)
            // console.log(count.value)

            total = document.getElementById(`total_${id}_${availability}`)
            // total.innerHTML = (price * count.value) + ' ₽'
            console.log(category)
            // categoryTotal = document.getElementById(`${category}`)
            // console.log(categoryTotal)
            // curentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            // categoryTotal.innerHTML = "Итого: " + (price * count.value) + " ₽"

            

            // total.setAttribute('value', `${id}_${availability}_${Number(total.innerHTML.replace(' ₽', ''))}_${Number(count.value)}_${category}_${Number(count.value) / carton_count | 0}`)
            // this.editHead(availability, price, 'plus')
            

            // document.getElementById(`total_basket`).innerHTML = "Всего: " + total + " ₽"
            // document.getElementById(`total_stock_basket`).innerHTML = total_stock + " ₽"
            // document.getElementById(`total_way_basket`).innerHTML = total_way + " ₽"
            // document.getElementById(`total_remote_basket`).innerHTML = total_remote + " ₽"

            categoryTotal = document.getElementById(`${category}`)
            // categoryTotal.innerHTML = "Итого: " + (category_total) + " ₽"

            carton = document.getElementById(`carton_${id}_${availability}`)
            // carton.innerHTML = Number(count.value) / carton_count | 0

            carton_num = Number(count.value) / carton_count | 0

            remainder = document.getElementById(`remainder_${id}_${availability}`)
            // remainder.innerHTML = Number(count.value) - (carton_num * carton_count)

            remainder_num = Number(Number(count.value) - (carton_num * carton_count))

            // total.setAttribute('value', `${id}_${availability}_${Number(total.innerHTML.replace(' ₽', ''))}_${Number(count.value)}_${category}_${Number(carton_num)}_${Number(remainder_num)}`)
            
            for (var i in this.products) {
                Orders = this.products[i].order
                if (id in Orders) {
                    Orders[id][availability]['count'] = Number(count.value)
                    Orders[id][availability]['total'] = Number(count.value) * price
                }
            }
            console.log(1)
            // новый кальк
            category_total = 0
            for (var i in this.order[category].items) {
                if (this.order[category].items[i].item.id == id) {
                    console.log(this.order[category].items[i])
                    console.log(availability)
                    this.order[category].items[i]['availability'][availability].total = Number(count.value) * price
                    this.order[category].items[i]['availability'][availability].count = Number(count.value)
                    this.order[category].items[i]['availability'][availability].carton = Number(count.value) / carton_count | 0
                    this.order[category].items[i]['availability'][availability].remainder = Number(Number(count.value) - (carton_num * carton_count))


                }
                
            }

            category_total = 0
            for (var i in this.order[category].items) {
                if ('stock' in this.order[category].items[i]['availability']) {
                    category_total += this.order[category].items[i]['availability']['stock'].total
                }

                if ('way' in this.order[category].items[i]['availability']) {
                    category_total += this.order[category].items[i]['availability']['way'].total
                }
                if ('remote' in this.order[category].items[i]['availability']) {
                    category_total += this.order[category].items[i]['availability']['remote'].total
                }
            }

            console.log(2)
            this.order[category].total = category_total
            total = 0
            total_remote = 0
            total_stock = 0
            total_way = 0
            for (var i in this.order) {
                total += this.order[i].total

                for (var j in this.order[i].items) {
                    availability_list = this.order[i].items[j]['availability']
                    console.log(availability_list)
                    if ('stock' in availability_list) {
                        total_stock += availability_list['stock'].total
                    }

                    if ('way' in availability_list) {
                        total_way += availability_list['way'].total
                    }

                    if ('remote' in availability_list) {
                        total_remote += availability_list['remote'].total
                    }
                }
            }

            // this.order[category].total = total
            console.log(3)
            this.orderTotal['total'] = total
            this.orderTotal['stock'] = total_stock
            this.orderTotal['way'] = total_way
            this.orderTotal['remote'] = total_remote


            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))

            // total in head
            document.getElementById('total').innerHTML = (total) + ' ₽'
            document.getElementById(`total_${availability}`).innerHTML = (this.orderTotal[availability]) + ' ₽'

        },

        // del product item on BASKET PAGE
        del: function (id, availability, price, category) {

            currentTotalItem = Number(document.getElementById(`total_${id}_${availability}`).innerHTML.replace(' ₽', ''))

            item = document.getElementById(`item_${id}_${availability}`)
            // item.remove();

            categoryTotal = document.getElementById(`${category}`)
            currentCategoryTotal = Number(categoryTotal.innerHTML.replace(' ₽', '').replace('Итого: ', ''))
            // categoryTotal.innerHTML = "Итого: " + (currentCategoryTotal - currentTotalItem) + " ₽"

            // console.log(id, availability, price)

            this.editHead(availability, currentTotalItem, 'del')


            itemCollect = document.getElementById(`item_${id}`).getElementsByTagName('li')
            console.log(itemCollect);
            if (itemCollect.length == 0) {
                itemCollect = document.getElementById(`item_${id}`).remove();
            }

            for (var i in this.products) {
                Orders = this.products[i].order
                Orders[id][availability]['count'] = 0
                Orders[id][availability]['total'] = 0
            }

            this.order[category].total = currentCategoryTotal - currentTotalItem


            // новый кальк
            for (var i in this.order[category].items) {
                if (this.order[category].items[i].item.id == id) {
                    this.order[category].items[i]['availability'][availability].total = 0
                    this.order[category].items[i]['availability'][availability].count = 0
                }
            }

            current = Number(document.getElementById('total').innerHTML.replace(' ₽', ''))
            // total in head
            document.getElementById('total').innerHTML = (current - currentTotalItem) + ' ₽'
            document.getElementById(`total_${availability}`).innerHTML = (Number(document.getElementById(`total_${availability}`).innerHTML.replace(' ₽', '')) - currentTotalItem) + ' ₽'

            
        },

        // save the current state of the order and redirect to the payment page
        busketNext: async function (event) {

            var orderId = await this.getOrderId();

            allItemValues = document.getElementsByClassName("product__size-all product__size-all--ordering")
            order = {}
            var allTotal = document.getElementById('total_basket')
            currentAllTotal = Number(allTotal.innerHTML.replace(' ₽', '').replace('Всего: ', ''))
            for (var i = 0; i < allItemValues.length; i++) {
                values = allItemValues[i].getAttribute("value").split("_")
                id = values[0]
                var availability = values[1]
                total = values[2]
                count = values[3]
                carton = values[5]
                remainder = values[6]
                if (id in order) {
                    order[id][availability] = { 'total': Number(total), 'count': Number(count), 'carton': Number(carton), 'remainder': Number(remainder)}
                } else {
                    order[id] = {}
                    order[id][availability] = { 'total': Number(total), 'count': Number(count), 'carton': Number(carton), 'remainder': Number(remainder)}
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
                body: JSON.stringify({ 'order': JSON.stringify(order), 'status': true, 'total': currentAllTotal }),
            });


            location.href = '/payment'
        },

        // clear busket (delete all products)
        busketClear: async function () {
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
                body: JSON.stringify({ 'order': JSON.stringify({}), 'status': false, 'total': 0 }),
            });


            document.getElementById(`total_basket`).innerHTML = "Всего: " + 0 + " ₽"
            document.getElementById(`total_stock_basket`).innerHTML = 0 + " ₽"
            document.getElementById(`total_way_basket`).innerHTML = 0 + " ₽"
            document.getElementById(`total_remote_basket`).innerHTML = 0 + " ₽"

            location.reload();

        },

        // request to create USER ORDER 
        sendOrder: async function () {
            var form = document.getElementById('form');
            var params = new FormData(form);
            token = document.getElementsByName('csrfmiddlewaretoken')[0].value
            const response = await fetch("/payment/", {
                headers: {
                    "X-CSRFTOKEN": token,
                },
                method: "POST",
                body: params,
            });
        },
        filterAccount: function () {
            // payment status
            var payment_status = document.getElementsByClassName('select-selected')[1].innerHTML.trim();
            console.log(payment_status);
            // address 
            var address = document.getElementsByClassName('select-selected')[0].innerHTML.trim();
            console.log(address);

            // date

            const items = document.getElementsByClassName('item')
            for (item in items) {
                if (items[item].className != undefined) {

                    if (['Оплата', 'Все'].includes(payment_status) && ['Адрес', 'Все'].includes(address)) {
                        items[item].style.display = ''
                    } else if (['Оплата', 'Все'].includes(payment_status) == false && ['Адрес', 'Все'].includes(address) == false) {
                        if (items[item].className.includes(address) && items[item].className.includes(payment_status)) {
                            items[item].style.display = ''
                        } else {
                            items[item].style.display = 'none'
                        }
                    } else if (['Оплата', 'Все'].includes(payment_status) == false && ['Адрес', 'Все'].includes(address)) {
                        if (items[item].className.includes(payment_status)) {
                            items[item].style.display = ''
                        } else {
                            items[item].style.display = 'none'
                        }
                    } else if (['Оплата', 'Все'].includes(payment_status) && ['Адрес', 'Все'].includes(address) == false) {
                        if (items[item].className.includes(address)) {
                            items[item].style.display = ''
                        } else {
                            items[item].style.display = 'none'
                        }
                    }
                }
            }
        },
        displayCategory: function (id) {
            el = document.getElementById('sidebar_' + id)
            if (!el.classList.contains('activate')) {
                // el.style.display = ''
                el.classList.add('activate')
                el.style.height = 'auto';
                let height = el.clientHeight + "px";
                el.style.height = '0px';

                setTimeout(function () {
                    el.style.height = height;
                }, 0);

                document.getElementById('categoryTab_' + id).classList.add('ui-accordion-header-active')
                document.getElementById('categoryTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-s')
            } else {
                document.getElementById('categoryTab_' + id).classList.remove('ui-accordion-header-active')
                document.getElementById('categoryTriagle_' + id).setAttribute('class', 'ui-accordion-header-icon ui-icon ui-icon-triangle-1-e')
                el.style.height = '0px';

                el.addEventListener('transitionend', function () {
                    el.classList.remove('activate');
                }, {
                    once: true
                });


            }
        },

        getContentFilter(id) {
            // GET REQUEST to /api/v1/productbycat/{id}/

            axios
                .get(`/api/v1/productbycat/${id}?availability=${this.availability.join(',')}&weight=${this.weight.join(',')}&status=${this.status.join(',')}`)
                .then(response => (this.contentController(response.data.products)));
        },

        newFilter: function () {
            availability = this.availability.join(',')
            weight = this.weight.join(',')
            status = this.status.join(',')

            categoryID = this.openedCategory
            console.log(categoryID)
            this.products = [];
            this.openedCategory = [];
            for (var i in categoryID) {
                document.getElementById('categoryBtn_' + categoryID[i]).className = "btn-reset sidebar__btn sidebar__btn--sub"
                document.getElementById('catalogCategory_' + categoryID[i]).className = "btn-reset menu__link"
                this.getContentFilter(categoryID[i], availability, weight, status)
            }
        },

        newFilterAvailability: function (availability) {

            if (!this.availability.includes(availability)) {
                this.availability.push(availability)
            } else {
                console.log(availability)
                this.availability = this.availability.filter(function (f) { return f !== availability });
            }

            // console.log(this.filter);
            this.newFilter()
        },

        newFilterStatus: function () {
            // console.log(this.availability, this.status)
            this.newFilter()
        },

        newFilterWeight: function (weight) {
            // console.log(this.availability, this.status)
            if (!this.weight.includes(weight)) {
                this.weight.push(weight)
            } else {
                this.weight = this.weight.filter(function (f) { return f !== weight });
            }

            this.newFilter();
        },

        newAccountFilter: function () {
            orders = document.getElementsByName('order_item')

            for (var i in orders) {
                {
                    if (orders[i].tagName == 'TR') {
                        payment = orders[i].getAttribute('payment')
                        address = orders[i].getAttribute('address')

                        if (this.address.length > 0 && this.paymentStatus.length == 0) {
                            if (this.address.includes(address)) {
                                orders[i].style.display = ''
                            } else {
                                orders[i].style.display = 'none'
                            }
                        } else if (this.address.length == 0 && this.paymentStatus.length > 0) {

                            if (this.paymentStatus.includes(payment)) {
                                orders[i].style.display = ''
                            } else {
                                orders[i].style.display = 'none'
                            }
                            //
                        } else if (this.address.length > 0 && this.paymentStatus.length > 0) {

                            if (this.paymentStatus.includes(payment) && this.address.includes(address)) {
                                orders[i].style.display = ''
                            } else {
                                orders[i].style.display = 'none'
                            }

                        } else {
                            orders[i].style.display = ''
                        }


                    }
                    // console.log(orders[i])
                }
            }
        },

        newFilterPaymentStatus: function (status) {
            if (!this.paymentStatus.includes(status)) {
                this.paymentStatus.push(status)
            } else {
                this.paymentStatus = this.paymentStatus.filter(function (f) { return f !== status });
            }

            this.newAccountFilter();

        },

        newFilterAddress: function (address) {
            if (!this.address.includes(address)) {
                this.address.push(address)
            } else {
                this.address = this.address.filter(function (f) { return f !== address });
            }

            this.newAccountFilter();

        },

        redirect: function () {

            console.log(1)
            if (location.pathname != '/main/') {
                location.href = '/main/'

            }
            console.log(location.pathname);
        },

        // смена основной область с банер на каталог
        changeContent: function() {
            if (location.pathname == '/') {
                if (this.content == 'catalog') {
                    document.getElementById('catalogContent').style.display = 'none';
                    document.getElementById('bannersContent').style.display = '';
                    this.content = 'banners';

                    localStorage.content = this.content;
                } else if (this.content == 'banners') {
                    document.getElementById('catalogContent').style.display = '';
                    document.getElementById('bannersContent').style.display = 'none';
                    this.content = 'catalog';

                    localStorage.content = this.content;
                } else if (this.content == 'basket') {
                    document.getElementById('mainScreen').style.display = '';
                    document.getElementById('basketScreen').style.display = 'none';
                    document.getElementById("headerRight").style.display = "";

                    this.content = 'catalog';
                }
            } else {
                location.href = '/';
            }
        },
        // смена рабочей области на каталог
        changeContentOnCatalog: function() {
            if (location.pathname == '/') {
                if (this.content == 'banners') {
                    document.getElementById('catalogContent').style.display = '';
                    document.getElementById('bannersContent').style.display = 'none';
                    this.content = 'catalog';

                    localStorage.content = this.content;
                } else if (this.content == 'basket') {
                    document.getElementById('mainScreen').style.display = '';
                    document.getElementById('basketScreen').style.display = 'none';
                    document.getElementById("headerRight").style.display = "";

                    this.content = 'catalog';
                }
            } else {
                location.href = '/';
            }
        },
        changeContentFromStorage: function() {
            if (this.content == 'banners') {
                document.getElementById('catalogContent').style.display = 'none';
                document.getElementById('bannersContent').style.display = '';
                this.content = 'banners';
            } else {
                document.getElementById('catalogContent').style.display = '';
                document.getElementById('bannersContent').style.display = 'none';
                this.content = 'catalog';
            }
        },

        getClassColor: function(cat) {
            if (cat == 'Аксессуары для кальяна') {
                color = 'green';
            } else if (cat == 'Кальяны') {
                color = 'orange';
            } else if (cat == 'Лимонады') {
                color = 'yellow';
            } else if (cat == 'Мерч') {
                color = 'light-pink';
            } else if (cat == 'Табак для кальяна') {
                color = 'blue';
            } else if (cat == 'Уголь') {
                color = 'purple';
            } else if (cat == 'Pod-системы') {
                color = 'red';
            } else if (cat == 'Жидкости') {
                color = 'pink';
            }

            return 'ordering__item ordering-item ordering-item--' + color;
        },


    },
    mounted() {
        if (location.pathname == '/') {
            if (localStorage.content != undefined) {
                this.content = localStorage.content

                this.changeContentFromStorage();
                
            }
        }
    },
    watch: {
        total(newName) {
            // localStorage.total = this.total;
        }
    }
});