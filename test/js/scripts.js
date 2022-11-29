$(window).on('load', function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('body').addClass('ios');
    } else {
        $('body').addClass('web');
    };

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const oid = $('.form-cart').data('offer-id');
    let cid = parseFloat(params.get('cid'));
    cid = (isNaN(cid) || cid === undefined) ? 1 : cid;
    window.updateUniqueSession({
        oid: oid,
        cid: cid
    });
});
$(document).ready(function () {
    // $('.accordion-header').click(function () {
    //     if (!$(this).is('opened')) {
    //         // $('.accordion-header').removeClass('opened');
    //         $(this).addClass('opened');

    //     }
    //     // else if ($(this).is('opened')) {
    //     //     $('.accordion-header').addClass('opened');
    //     // }
    // })
    $('.review_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false
                }
            }

        ]
    });
    $('.burger').click(function () {
        $(this).toggleClass('active');
        $('.mobile_menu').toggleClass('active');
        $('#overlay').toggleClass('active');
    })
    $('.close_mobile').click(function () {
        $('.burger').toggleClass('active');
        $('.mobile_menu').toggleClass('active');
        $('#overlay').toggleClass('active');
    })
    $('#overlay').click(function () {
        $(this).toggleClass('active');
        $('.mobile_menu').toggleClass('active');
        $('.burger').toggleClass('active');
    })
    $(document).on('click', '.minus', function (event) {
        var value = $(this).parent('.calc').find('input').val();
        var new_value = parseInt(value) - 1;
        $(this).parent('.calc').find('input').val(new_value);
        if (new_value < 2) {
            $(this).addClass('disabled');
        }
        $(this).parent('.calc').next('.product-cart__btn').attr('data-count', new_value);
        return false;
    });

    $(document).on('click', '.plus', function (event) {
        var value = $(this).parent('.calc').find('input').val();
        var new_value = parseInt(value) + 1;
        $(this).parent('.calc').find('input').val(new_value);
        if (new_value > 1) {
            $(this).parent('.calc').find('.minus').removeClass('disabled');
        }
        $(this).parent('.calc').next('.product-cart__btn').attr('data-count', new_value);
        return false;
    });

    $('.js-checkout').on('click', function (event) {
        $('.popup-cart').addClass('popup-cart--checkout');
        return false;
    });


    $.fn.selectRange = function (start, end) {
        if (end === undefined) {
            end = start;
        }
        return this.each(function () {
            if ('selectionStart' in this) {
                this.selectionStart = start;
                this.selectionEnd = end;
            } else if (this.setSelectionRange) {
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

    $("input[type='tel']").mask("+52(999) 999 99 99").on('click', function () {
        if ($(this).val() === '+52(___) ___ __ __') {
            $(this).selectRange(4);
        }
    });

    $('.form-cart').each(function () {
        $(this).validate({
            errorElement: 'span',
            errorPlacement: function (error, element) {
                element.parents('.form-col').append(error);
            },

            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form-col').addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form-col').removeClass(errorClass).addClass(validClass);
            },

            rules: {
                name: { required: true },
                phone: { required: true }
            },
            messages: {
                name: { required: "Digite seu nome" },
                phone: { required: "Telefone inválido" }
            },
            submitHandler: async function (form) {
                const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart') || {});
                console.log(shoppingCart)

                const productList = [];

                shoppingCart.map(product => {
                    productList.push({
                        productId: parseInt(product.id),
                        amount: parseInt(product.count)
                    });
                });

                const search = window.location.search;
                const params = new URLSearchParams(search);
                const oid = $('.form-cart').data('offer-id');
                const phone = form.phone.value.replace(' ', '').replace('(', '').replace(')', '');
                const customerName = form.name.value;
                let cid = parseFloat(params.get('cid'));
                cid = (isNaN(cid) || cid === undefined) ? 1 : cid;
                const payload = {
                    cid,
                    oid,
                    phone,
                    customerName,
                    items: productList
                }

                console.log(payload);
                const data = await window.placeOrder(payload);
                console.log(data);
                if (data.code === 'OK') {
                    localStorage.removeItem('shoppingCart');
                    if (window.fbq && window.facebookId) {
                        window.fbq('init', window.facebookId);
                        window.fbq('track', 'PageView');
                        window.fbq('track', 'Lead');
                    }

                    $.fancybox.close();
                    $.fancybox.open({
                        src: '#popup-success',
                        type: 'inline',
                        opts: {
                            touch: false,
                            closeExisting: true,
                            autoFocus: false
                        }
                    });
                    $('#cart').simpleCart();
                }

                if (data.message) {
                    if (data.message.replaceAll('%20', ' ') === 'phone number in black list') {
                        const formField = $('#phone').parent('.form-col');
                        formField.addClass('error');
                        formField.append('<span id="phone-error" class="error" style="display: block">Telefone inválido</span>');
                    }
                }
            }
        });
    });
    $('#cart').simpleCart();
    $('.main_menu li a').click(function () {
        var target = $(this.hash);
        if (target.length) {
            var tt = target.offset().top - $('#header').innerHeight() - 30;
            $('html, body').animate({
                scrollTop: tt
            }, 1500);

            $('body').removeClass('menu-open');
            $('.header-nav').removeClass('active');
            $('.mobile-trigger').removeClass('is-active');
            return false;
        }
    });
});