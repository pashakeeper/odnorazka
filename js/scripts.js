$(document).ready(function () {
    $('.accordion-header').click(function () {
        if (!$(this).is('opened')) {
            $('.accordion-header').removeClass('opened');
            $(this).addClass('opened');

        }
        else if ($(this).is('opened')) {
            $('.accordion-header').removeClass('opened');
        }
    })
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
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    });
});