const container = document.querySelector(".container");
const carouselContainer = container.querySelector(".carousel-container")
const carousel = container.querySelector(".carousel");
const cItems = carousel.querySelectorAll(".c-item");

let isMouseDown = false;
let mouseCurreentPos = 0;
let mouseLastPos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createCarousel = () => {
    const carouselProps = onresize();
    const length = cItems.length;
    const degrees = 360 / length;
    const gap = 20;
    const zTravel = distance(carouselProps.w, length, gap);
    const fieldOfView = calculateFov(carouselProps);
    const height = calculateHeight(zTravel)

    container.style.width = zTravel * 2 + gap * length + "px";
    container.style.height = height + "px";

    cItems.forEach((item, i) =>  {
        item.style.setProperty("--rotatey", degreesByItem);
        item.style.setProperty("--translatez", zTravel + "px");
    });
}

//Function to make the animation smoother
const linearInterpolation = (a, n, b) => {
    return n * (a - b) + b;
};

const distanceZ = (widthElement, length, gap) => {
    return widthElement / 2 / Math.tan(Math.PI / length) + gap;
}

/*OK, here we calculate the height using trigonometry and angles.
I'm not really a math guy so I consulted GPT. You could remove the division by 2 since you
multiply by 2 later, but apparently this is the standard practice in perspectivee calc*/
const calculateHeight = (z) => {
    const t = Math.atan((90 * Math.PI) / 180 / 2);
    const height = t * 2 * z;
    return height;
};