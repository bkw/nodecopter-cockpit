/*jshint browser:true */
/* requestAnimationFrame polyfill: */
(function (window) {
    'use strict';
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x,
        length,
        currTime,
        timeToCall;

    for (x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[
            vendors[x] + 'RequestAnimationFrame'
        ];
        window.cancelAnimationFrame = window[
            vendors[x] + 'CancelAnimationFrame'
        ] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            currTime = new Date().getTime();
            timeToCall = Math.max(0, 16 - (currTime - lastTime));
            lastTime = currTime + timeToCall;
            return window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}(window));


(function (window, document, undefined) {
    'use strict';

    var headings = ['N', 'E', 'S', 'W'],
        Compass;

    Compass = function (div) {
        var divRect = div.getBoundingClientRect(),
            ctx, x, i, needle;
        div.style.position = 'relative';
        div.style.backgroundImage = '-webkit-radial-gradient(50% 50%, circle cover, rgb(68, 68, 68) 0%, black 100%)';

        this.visibleWidth = divRect.width;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.visibleWidth * 2;
        this.canvas.height = divRect.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.transition = 'all 0.3s ease-out';

        div.style.overflow = 'hidden';

        ctx = this.canvas.getContext('2d');

        x = 0;
        ctx.textAlign = 'center';
        for (i = 0; i < 36 * 2; i += 1.5) {
            ctx.beginPath();
            ctx.moveTo(x, 0);

            if (i % 9 === 0) {
                ctx.fillStyle = 'white';
                ctx.font = 'bold';
                ctx.fillText(headings[i / 9 % 4], x, 24);
                ctx.strokeStyle = 'white';
                ctx.lineTo(x, 10);
                ctx.lineWidth = 2;
            } else if (i % 3 === 0) {
                ctx.fillStyle = '#CCC';
                ctx.font = 'normal';
                ctx.fillText(i % 36, x, 24);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.lineTo(x, 7);
            } else {
                ctx.strokeStyle = 'white';
                ctx.lineTo(x, 5);
                ctx.lineWidth = 0.5;
            }
            ctx.stroke();
            x += this.visibleWidth / 24;
        }
        div.appendChild(this.canvas);

        needle = document.createElement('canvas');
        needle.width = 15;
        needle.height = 15;
        needle.style.top = 0;

        needle.style.left = Math.floor(this.visibleWidth / 2 - needle.width / 2) + 'px';
        needle.style.position = 'absolute';
        ctx = needle.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.ceil(needle.width / 2), needle.height);
        ctx.lineTo(needle.width, 0);
        ctx.lineTo(0, 0);
        ctx.fill();
        div.appendChild(needle);
        this.moveTo(0);
    };

    Compass.prototype.moveTo = function (angle) {
        var offset,
            compass = this;
        while (angle > 180) {
            angle -= 360;
        }
        while (angle < -180) {
            angle += 360;
        }
        offset = - angle * (this.visibleWidth / 360);
        offset -= (this.visibleWidth / 2);
        // '-webkit-transform'
        window.requestAnimationFrame(function () {
            compass.canvas.style.webkitTransform = 'translateX(' + offset + 'px)';
        });
    };
    window.Compass = Compass;

}(window, document, undefined));
