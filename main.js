$(document).ready(function () {
  const $cont = $(".cont");
  const $slider = $(".slider");
  const $nav = $(".nav");
  const winW = $(window).width();
  const animation_speed = 750;
  const distOfLetGo = winW * 0.2;
  let cur_slide = 1;
  let animation = false;
  let auto_scroll_var = true;
  let diff = 0;

  let array_cities = ["Colombo", "Sydney", "Washington", "Rome", "Toronto"];
  let cities_no = array_cities.length;
  let cities_divided = [];

  array_cities.map((city) => {
    let length = city.length;
    let letters = Math.floor(length / 4);
    let exp = new RegExp(".{1," + letters + "}", "g");

    cities_divided.push(city.match(exp));
  });

  let generate_slide = function (city) {
    let fragment_1 = $(document.createDocumentFragment());
    let fragment_2 = $(document.createDocumentFragment());
    const num_slide = array_cities.indexOf(array_cities[city]) + 1;
    const first_letter = cities_divided[city][0].charAt(0);

    const $slide =
      $(`<div data-target="${num_slide}" class="slide slide-${num_slide}">
                              <div class="slide_dark_background slide-${num_slide}_dark_background"></div>
                              <div class="slide_text-wrapper slide-${num_slide}_text-wrapper"></div>
                          </div>`);

    const letter = $(`<div class="slide_letter slide-${num_slide}_letter">
                              ${first_letter}
                          </div>`);

    for (let i = 0, length = cities_divided[city].length; i < length; i++) {
      const text = $(`<div class="slide_text slide_text-${i + 1}">
                                  ${cities_divided[city][i]}
                              </div>`);
      fragment_1.append(text);
    }

    const nav_slide = $(
      `<li data-target="${num_slide}" class="nav_slide nav_slide-${num_slide}"></li>`
    );
    fragment_2.append(nav_slide);
    $nav.append(fragment_2);

    $slide
      .find(`.slide-${num_slide}_text-wrapper`)
      .append(letter)
      .append(fragment_1);
    $slider.append($slide);

    if (array_cities[city].length <= 4) {
      $(".slide-" + num_slide)
        .find(".slide_text")
        .css("font-size", "12vw");
    }
  };

  for (let i = 0, length = cities_no; i < length; i++) {
    generate_slide(i);
  }

  $(".nav_slide-1").addClass("nav-active");

  function nav_bullets(dir) {
    $(".nav_slide-" + cur_slide).removeClass("nav-active");
    $(".nav_slide-" + dir).addClass("nav-active");
  }

  function timeout() {
    animation = false;
  }

  function pagination(direction) {
    animation = true;
    diff = 0;
    $slider.addClass("animation");
    $slider.css({
      transform: "translate3d(-" + (cur_slide - direction) * 100 + "%, 0, 0)",
    });

    $slider.find(".slide_dark_background").css({
      transform: "translate3d(" + (cur_slide - direction) * 50 + "%, 0, 0)",
    });

    $slider.find(".slide_letter").css({
      transform: "translate3d(0, 0, 0)",
    });

    $slider.find(".slide_text").css({
      transform: "translate3d(0, 0, 0)",
    });
  }

  function navigate_right() {
    if (!auto_scroll_var) return;
    if (cur_slide >= cities_no) return;
    pagination(0);
    setTimeout(timeout, animation_speed);
    nav_bullets(cur_slide + 1);
    cur_slide++;
  }

  function navigate_left() {
    if (cur_slide <= 1) return;
    pagination(2);
    setTimeout(timeout, animation_speed);
    nav_bullets(cur_slide - 1);
    cur_slide--;
  }

  function to_default() {
    pagination(1);
    setTimeout(timeout, animation_speed);
  }

  $(document).on("mousedown touchstart", ".slide", function (e) {
    if (animation) return;
    let target = +$(this).attr("data-target");
    let startX = e.pageX || e.originalEvent.touches[0].pageX;
    $slider.removeClass("animation");

    $(document).on("mousemove touchmove", function (e) {
      let x = e.pageX || e.originalEvent.touches[0].pageX;
      diff = startX - x;
      if ((target === 1 && diff < 0) || (target === cities_no && diff > 0))
        return;

      $slider.css({
        transform:
          "translate3d(-" + ((cur_slide - 1) * 100 + diff / 30) + "%, 0, 0)",
      });

      $slider.find(".slide_dark_background").css({
        transform:
          "translate3d(" + ((cur_slide - 1) * 50 + diff / 60) + "%, 0, 0)",
      });

      $slider.find(".slide_letter").css({
        transform: "translate3d(" + diff / 60 + "vw, 0, 0)",
      });

      $slider.find(".slide_text").css({
        transform: "translate3d(" + diff / 15 + "px, 0, 0)",
      });
    });
  });

  $(document).on("mouseup touchend", function (e) {
    $(document).off("mousemove touchmove");

    if (animation) return;

    if (diff >= distOfLetGo) {
      navigate_right();
    } else if (diff <= -distOfLetGo) {
      navigate_left();
    } else {
      to_default();
    }
  });

  $(document).on("click", ".nav_slide:not(.nav-active)", function () {
    let target = +$(this).attr("data-target");
    nav_bullets(target);
    cur_slide = target;
    pagination(1);
  });

  $(document).on("click", ".side-nav", function () {
    let target = $(this).attr("data-target");

    if (target === "right") navigate_right();
    if (target === "left") navigate_left();
  });

  $(document).on("keydown", function (e) {
    if (e.which === 39) navigate_right();
    if (e.which === 37) navigate_left();
  });

  $(document).on("mousewheel DOMMouseScroll", function (e) {
    if (animation) return;
    let delta = e.originalEvent.wheelDelta;

    if (delta > 0 || e.originalEvent.detail < 0) navigate_left();
    if (delta < 0 || e.originalEvent.detail > 0) navigate_right();
  });
});
