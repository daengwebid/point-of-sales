import Vue from 'vue'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';

Vue.filter('currency', function (money) {
    return accounting.formatMoney(money, "Rp ", 2, ".", ",")
})
Vue.use(VueSweetalert2);

new Vue({
    el: '#dw',
    data: {
        product: {
            id: '',
            price: '',
            name: '',
            photo: ''
        },
        cart: {
            product_id: '',
            qty: 1
        },
        customer: {
            email: ''
        },
        shoppingCart: [],
        submitCart: false,
        formCustomer: false,
        resultStatus: false,
        submitForm: false,
        errorMessage: '',
        message: ''
    },
    watch: {
        'cart.product_id': function() {
            if (this.cart.product_id) {
                this.getProduct()
            }
        },
        'customer.email': function() {
            this.formCustomer = false
            if (this.customer.name != '') {
                this.customer = {
                    name: '',
                    phone: '',
                    address: ''
                }
            }
        }
    },
    mounted() {
        $('#product_id').select2({
            width: '100%'
        }).on('change', () => {
            this.cart.product_id = $('#product_id').val();
        });
        this.getCart()
    },
    methods: {
        getProduct() {
            axios.get(`/api/product/${this.cart.product_id}`)
            .then((response) => {
                this.product = response.data
            })
        },
        addToCart() {
            this.submitCart = true;
            axios.post('/api/cart', this.cart)
            .then((response) => {
                setTimeout(() => {
                    this.shoppingCart = response.data
                    this.cart.product_id = ''
                    this.cart.qty = 1
                    this.product = {
                        id: '',
                        price: '',
                        name: '',
                        photo: ''
                    }
                    $('#product_id').val('')
                    this.submitCart = false
                }, 2000)
            })
            .catch((error) => {

            })
        },
        getCart() {
            axios.get('/api/cart')
            .then((response) => {
                this.shoppingCart = response.data
            })
        },
        removeCart(id) {
            this.$swal({
				title: 'Kamu Yakin?',
				text: 'Kamu Tidak Dapat Mengembalikan Tindakan Ini!',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Iya, Lanjutkan!',
				cancelButtonText: 'Tidak, Batalkan!',
				showCloseButton: true,
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve()
                        }, 2000)
                    })
                },
                allowOutsideClick: () => !this.$swal.isLoading()
			}).then ((result) => {
				if (result.value) {
					axios.delete(`/api/cart/${id}`)
					.then ((response) => {
						this.getCart();
					})
					.catch ((error) => {
						console.log(error);
					})
				}
			})
        },
        searchCustomer() {
            axios.post('/api/customer/search', {
                email: this.customer.email
            })
            .then((response) => {
                if (response.data.status == 'success') {
                    this.customer = response.data.data
                    this.resultStatus = true
                } 
                this.formCustomer = true
            })
            .catch((error) => {

            })
        },
        sendOrder() {
            this.errorMessage = ''
            this.message = ''
            if (this.customer.email != '' && this.customer.name != '' && this.customer.phone != '' && this.customer.address != '') {
                this.$swal({
                    title: 'Kamu Yakin?',
                    text: 'Kamu Tidak Dapat Mengembalikan Tindakan Ini!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Iya, Lanjutkan!',
                    cancelButtonText: 'Tidak, Batalkan!',
                    showCloseButton: true,
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve()
                            }, 2000)
                        })
                    },
                    allowOutsideClick: () => !this.$swal.isLoading()
                }).then ((result) => {
                    if (result.value) {
                        this.submitForm = true
                        axios.post('/checkout', this.customer)
                        .then((response) => {
                            setTimeout(() => {
                                this.getCart();
                                this.message = response.data.message
                                this.customer = {
                                    name: '',
                                    phone: '',
                                    address: ''
                                }
                                this.submitForm = false
                            }, 1000)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                    }
                })
            } else {
                this.errorMessage = 'Masih ada inputan yang kosong!'
            }
        }
    }
})