const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const dims = canvas.width
const span = document.getElementById('result')
const stop = document.getElementById('stop')

ctx.arc(dims, dims, dims, 0, Math.PI * 2);
ctx.fillStyle = "#EEEEEE";
ctx.fill();

var calculating = true
var attemps = 0

const data = localStorage.getItem('data')
var points = data ? JSON.parse(data) : {
    in: 0,
    out: 0
}

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var inCircle = []
function generateLimits() {
    for (let x = 0; x <= dims; x++) {
        for (let y = 0; y <= dims; y++) {
            var pixel = ctx.getImageData(x, y, 1, 1).data
            inCircle.push([x, y])
            inCircle[x][y] = pixel[3] >= 255 / 2
        }
    }
    generatePoint()
}

function generatePoint() {
    var x = randomNum(0, dims)
    var y = randomNum(0, dims)
    if(inCircle[x][y]) {
        points.in++
        ctx.fillStyle = '#E50003'
    } else {
        points.out++
        ctx.fillStyle = '#0075CE'
    }
    if(calculating) {
        try {
            generatePoint()
        } catch {
            ctx.fillRect(x, y, 1, 1)
            var pi = points.in / (points.in + points.out) * 4
            span.innerHTML = `
                <var>n</var> = <var>${Math.round((points.in + points.out) / 1e6)}</var>×<var>10<sup>6</sup></var>,
                <var>π</var> ≈ <var>${parseFloat(pi.toFixed(8))}</var>`
            requestAnimationFrame(generatePoint)
        }
    }
}

function saveData() {
    localStorage.setItem('data', JSON.stringify(points))
}

generateLimits()

stop.addEventListener('click', () => {
    calculating = !calculating
    stop.innerText = calculating ? 'stop' : 'start'
    if(calculating) return generatePoint()
})

window.addEventListener("beforeunload", () => {
    saveData()
}, false)