/*jshint browser:true */
/*global NodecopterStream:true,
         Compass:true,
         Gauge:true,
         ArtificialHorizon:true,
         requestAnimationFrame:true
*/
(function (window, document) {
    'use strict';
    var NC = function NodecopterCockpit(
        dronestreamDiv, compassDiv, horizonCanvas, gaugeId
    ) {
        var qs           = document.querySelector.bind(document),
            copterStream = new NodecopterStream(qs(dronestreamDiv)),
            compass      = new Compass(qs(compassDiv)),
            horizon      = new ArtificialHorizon(qs(horizonCanvas)),
            gauge        = new Gauge({
                renderTo    : gaugeId,
                width       : 120,
                height      : 120,
                glow        : true,
                units       : '%',
                title       : 'Battery',
                minValue    : 0,
                maxValue    : 100,
                majorTicks  : [ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                minorTicks  : 2,
                strokeTicks : false,
                highlights  : [
                    { from : 0,   to : 5, color : 'rgba(255, 0, 225, .25)' },
                    { from : 5,   to : 20, color : 'rgba(255, 0, 0, .15)' },
                    { from : 20, to : 50, color : 'rgba(255, 255, 0, .15)' },
                    { from : 50, to : 100, color : 'rgba(0, 255,  255, .25)' },
                ],
                colors      : {
                    plate : '#222',
                    majorTicks : '#f5f5f5',
                    minorTicks : '#ddd',
                    title      : '#fff',
                    units      : '#ccc',
                    numbers    : '#eee',
                    needle     : {
                        start : 'rgba(240, 128, 128, 1)',
                        end : 'rgba(255, 160, 122, .9)'
                    }
                }
            }),
            lastMessage = null,

            navdataSocket = new WebSocket(
                'ws://' +
                window.document.location.hostname + ':' +
                window.document.location.port + '/navdata'
            ),

            translation = document.querySelector('.translation'),

            navDataRenderer = function () {
                if (!lastMessage) {
                    return;
                }
                var data = JSON.parse(lastMessage);

                horizon.setValues({
                    roll : data.demo.rotation.roll * Math.PI / 180,
                    pitch : data.demo.rotation.pitch * Math.PI / 180,
                    altitude : data.demo.altitudeMeters,
                    speed : data.demo.velocity.z // no idea...
                });
                horizon.draw();
                gauge.setValue(data.demo.batteryPercentage);
                gauge.draw();
                compass.moveTo(data.demo.rotation.clockwise);
            };

        navdataSocket.onmessage = function (msg) {
            lastMessage = msg.data;
            requestAnimationFrame(navDataRenderer);
        };
    };
    window.NodecopterCockpit = NC;
}(window, document));
