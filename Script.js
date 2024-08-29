const container = document.querySelector(".container");
const carouselContainer = container.querySelector(".carousel-container")
const carousel = container.querySelector(".carousel");
const cItems = carousel.querySelectorAll(".c-item");

let isMouseDown = false;
let mouseCurrentPos = 0;
let mouseLastPos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createCarousel = () => {
    const carouselProps = onResize();
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
};

//Function to make the animation smoother
const linearInterpolation = (a, n, b) => {
    return n * (a - b) + b;
};

const distanceZ = (widthElement, length, gap) => {
    return widthElement / 2 / Math.tan(Math.PI / length) + gap;
};

/*OK, here we calculate the height using trigonometry and angles.
I'm not really a math guy so I consulted GPT. You could remove the division by 2 since you
multiply by 2 later, but apparently this is the standard practice in perspectivee calc*/
const calculateHeight = (z) => {
    const t = Math.atan((90 * Math.PI) / 180 / 2);
    const height = t * 2 * z;
    return height;
};

const calculateFov = (carouselProps) => {
    //Retrieve the perspective value
    const perspective = window
    .getComputedStyle(carouselContainer)
    .perspective.split("px")[0];

    //Calculating the diagonal lenght of the carousel
    const length = 
    Math.sqrt(carouselProps.w * carouselProps.w)+
    Math.sqrt(carouselProps.h * carouselProps.h);

    const fov = 2 * Math.atan(length/ (2 * perspective)) * (180 / Math.PI);
    return fov;
};

//Obtains position in X axis and analizes if it should rotate left or right
const getPosX = (x) => {
    mouseCurrentPos = x

    moveTo = mouseCurrentPos < mouseLastPos ? moveTo -2 : moveTo +2;

    mouseLastPos = mouseCurrentPos;
};

const update = () => {
    lastMoveTo = linearInterpolation(moveTo, lastMoveTo, 0.05);
    carousel.style.setProperty("--rotatey", lastMoveTo, + "deg");

    requestAnimationFrame(update);//Syncs the browser's refresh rate with update 
};

//Allows other parts of the code to dynamically adjust the carousel's size and layout
const onResize = () => {
    const boundingCarousel = carouselContainer.getBoundingClientRect()//Returns a DOMRect object with sizing (w, h, top, right...);

    const carouselProps = {
        w: boundingCarousel.width,
        h: boundingCarousel.height,
    };

    return carouselProps
};

const initEvents = () => {

    //First the mouse events

    carousel.addEventListener("mouseDown", () => {
        isMouseDown = true;
        carousel.style.cursor = "grabbing";
    });

    carousel.addEventListener("mouseUp", () => {
        isMouseDown = false;
        carousel.style.cursor = "grab";
    });

    container.addEventListener("mouseLeave", () => isMouseDown = false);

    carousel.addEventListener("mouseMove", (e) => isMouseDown && getPosX(e.clientX));

    //Now the touchscreen events

    carousel.addEventListener("touchStart", () => {
        isMouseDown = true;
        carousel.style.cursor = "grabbing"
    });

    carousel.addEventListener("touchEnd", () => {
        isMouseDown = false;
        carousel.style.cursor = "grab";
    });

    carousel.addEventListener("touchMove", (e) => isMouseDown && getPosX(e.touches[0].clientX)); //Updated based on swipe movement

    window.addEventListener("resize", createCarousel);

    update();

    createCarousel();
}

initEvents()