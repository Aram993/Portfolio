import Swiper from "swiper";
import { Pagination, A11y, Navigation } from "swiper/modules";

document.addEventListener("DOMContentLoaded", ()=> {
    //Menu
    const menuButton = document.querySelector(".js-menu-toggle");
    
    menuButton.onclick = function () {
        if (menuButton.classList.contains("menu__toggle--active")) {
            menuButton.classList.remove("menu__toggle--active");
            menuButton.setAttribute("aria-expanded", false);
        } else {
            menuButton.classList.add("menu__toggle--active");
            menuButton.setAttribute("aria-expanded", true);
        }
    }

    //Video
    const videoBtn = document.querySelector(".js-video");
    const videoContainer = videoBtn.parentElement;
    const videoIframe = document.querySelector("iframe");

    videoBtn.addEventListener("click", ()=> {
        videoContainer.classList.add("is-active");
        videoIframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo"}), "*"); 
    })

});

// Testimonials

const swiper = new Swiper(".js-testimonials-slider", {
    modules: [Pagination, A11y],
    loop: true,
    speed: 600,
    autoHeight: true,
    spaceBetween: 20,
    slidesPerView: 1,
    a11y: true,
    pagination: {
        el: ".testimonials-slider__pagination",
        bulletElement: "button",
        bulletClass: "testimonials-slider__pagination-bullet",
        bulletActiveClass: "testimonials-slider__pagination-bullet--active",
        clickable: true
    },

    breakpoints: {
        769: {
            slidesPerView: "auto",
            centeredSlides: true,
            spaceBetween: 0,
            slideToClickedSlide: true,

        }
    }
});