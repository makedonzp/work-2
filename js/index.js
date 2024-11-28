document.addEventListener("DOMContentLoaded", () => {
  const sliderContainer = document.querySelector(".slider__container");
  const dotsContainer = document.querySelector(".slider__dots");
  const prevButton = document.querySelector(".slider__button--prev");
  const nextButton = document.querySelector(".slider__button--next");
  const slider = document.querySelector(".slider__unlim");

  if (
    !sliderContainer ||
    !dotsContainer ||
    !prevButton ||
    !nextButton ||
    !slider
  ) {
    console.error("One or more required elements are missing.");
    return;
  }

  const slidesData = [
    {
      image:
        "https://masterpiecer-images.s3.yandex.net/04549fbc9b8711ee991ffeda328ae3aa:upscaled",
      title: "Работа с сервисом приносит радость",
      description:
        "Работа с сервисом приносит радость, потому что высочайший <br/> профессионализм, удобство, оперативность, и просто <br/> приятные люди!",
      author: "Александра Селезнева",
      profession: "фотограф",
    },
    {
      image:
        "https://avatars.mds.yandex.net/get-shedevrum/11917197/img_049920ab01b911efb0e51a4e153a185f/orig",
      title: "Отличный сервис",
      description: "Всегда готовы помочь и решить любую проблему!",
      author: "Иван Петров",
      profession: "дизайнер",
    },
    {
      image:
        "https://masterpiecer-images.s3.yandex.net/c41062c483e811eeb9892ab2a9c6ab46:upscaled",
      title: "Высокий уровень сервиса",
      description: "Всегда на связи и готовы помочь!",
      author: "Мария Иванова",
      profession: "маркетолог",
    },
    {
      image:
        "https://avatars.mds.yandex.net/get-shedevrum/11477113/ede1c182bb9311ee9e89fea2cb3b090c/orig",
      title: "Отличный опыт работы",
      description: "Всегда готовы помочь и решить любую проблему!",
      author: "Дмитрий Сидоров",
      profession: "программист",
    },
  ];

  let currentIndex = 0;
  let isMoving = false;
  let autoScrollTimeout;
  let userInteractionTimeout;

  function createSlidesAndDots() {
    slidesData.forEach((slide, index) => {
      // Create slide element
      const slideElement = document.createElement("div");
      slideElement.classList.add("slider__slide");
      slideElement.innerHTML = `
        <div class="slider__round_icon" style="background-image: url(${slide.image});"></div>
        <p class="slider__text">${slide.description}</p>
        <div class="slider__author">
          <p class="slider__author_name">${slide.author}</p>
          <p class="slider__author_profession">${slide.profession}</p>
        </div>
      `;
      sliderContainer.appendChild(slideElement);

      // Create dot element
      const dotElement = document.createElement("button");
      dotElement.classList.add("slider__dot");
      dotElement.setAttribute("aria-label", `Slide ${index + 1}`);
      dotElement.addEventListener("click", () => moveToSlide(index));
      dotsContainer.appendChild(dotElement);
    });

    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll(".slider__dot");
    dots.forEach((dot) => dot.classList.remove("slider__dot--active"));
    dots[currentIndex].classList.add("slider__dot--active");
  }

  function moveToNextSlide() {
    if (isMoving) return;
    isMoving = true;

    const firstSlide = sliderContainer.firstElementChild;
    sliderContainer.style.transition = "transform 0.8s ease";
    sliderContainer.style.transform = "translateX(-100%)";

    sliderContainer.addEventListener(
      "transitionend",
      function () {
        sliderContainer.style.transition = "none";
        sliderContainer.appendChild(firstSlide);
        sliderContainer.style.transform = "translateX(0)";
        isMoving = false;
      },
      { once: true }
    );

    currentIndex = (currentIndex + 1) % slidesData.length;
    updateDots();
  }

  function moveToPrevSlide() {
    if (isMoving) return;
    isMoving = true;

    const lastSlide = sliderContainer.lastElementChild;
    sliderContainer.style.transition = "none";
    sliderContainer.prepend(lastSlide);
    sliderContainer.style.transform = "translateX(-100%)";

    setTimeout(() => {
      sliderContainer.style.transition = "transform 0.8s ease";
      sliderContainer.style.transform = "translateX(0)";
    }, 0);

    sliderContainer.addEventListener(
      "transitionend",
      function () {
        isMoving = false;
      },
      { once: true }
    );

    currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
    updateDots();
  }

  function moveToSlide(index) {
    if (isMoving || index === currentIndex) return;
    isMoving = true;

    const direction = index > currentIndex ? 1 : -1;
    const slidesToMove = Math.abs(index - currentIndex);
    for (let i = 0; i < slidesToMove; i++) {
      if (direction === 1) {
        sliderContainer.appendChild(sliderContainer.firstElementChild);
      } else {
        sliderContainer.prepend(sliderContainer.lastElementChild);
      }
    }

    sliderContainer.style.transition = "none";
    sliderContainer.style.transform = `translateX(${-100 * direction}%)`;

    setTimeout(() => {
      sliderContainer.style.transition = "transform 0.8s ease";
      sliderContainer.style.transform = "translateX(0)";
    }, 0);

    sliderContainer.addEventListener(
      "transitionend",
      function () {
        isMoving = false;
      },
      { once: true }
    );

    currentIndex = index;
    updateDots();
  }

  function startAutoScroll() {
    autoScrollTimeout = setInterval(moveToNextSlide, 5000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollTimeout);
  }

  function resetAutoScroll() {
    stopAutoScroll();
    clearTimeout(userInteractionTimeout);
    userInteractionTimeout = setTimeout(startAutoScroll, 3000);
  }

  function handleUserInteraction() {
    stopAutoScroll();
    resetAutoScroll();
  }

  createSlidesAndDots();
  startAutoScroll();

  nextButton.addEventListener("click", () => {
    moveToNextSlide();
    handleUserInteraction();
  });

  prevButton.addEventListener("click", () => {
    moveToPrevSlide();
    handleUserInteraction();
  });

  slider.addEventListener("mouseenter", stopAutoScroll);
  slider.addEventListener("mouseleave", resetAutoScroll);
});
