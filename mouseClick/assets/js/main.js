'use strict'

var bootstrap = (function(){
    var canvas, gl;
    var a_Position;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function compileShader(shaderSource, shaderType) {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        return shader;
    }

    function getShader(id) {
        var shaderScript = document.getElementById(id);
        var shaderSource = "";
        var textLine = shaderScript.firstChild;
        while(textLine) {
            if (textLine.nodeType == 3) {
                shaderSource += textLine.textContent;
            }
            textLine = textLine.nextSibling;
        }
        var shader;
        if(shaderScript.type == "x-shader/x-fragment") {
            shader = compileShader(shaderSource, gl.FRAGMENT_SHADER);
        } else if(shaderScript.type == "x-shader/x-vertex") {
            shader = compileShader(shaderSource, gl.VERTEX_SHADER);
        } else {
            return null;
        }
        return shader;
    }

    function drawScene() {
        gl.clearColor(0.0, 1.0, 1.0, 1.0);
         gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for(var i = 0; i < len; i+=2) {
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }

    }

    function render() {
        requestAnimationFrame(render);
        drawScene();
    }

    var g_points = [];
    function clickHandler(event, gl, canvas, a_Position) {
        var x = event.clientX;
        var y = event.clientY;
        var rect = event.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        g_points.push(x);
        g_points.push(y);
    }

    function bootstrap() {
        canvas = document.getElementById("holder");
        gl = canvas.getContext("experimental-webgl");
        resize();
        window.addEventListener("resize", resize);
        var fragmentShader = getShader("shader-fs");
        var vertexShader = getShader("shader-vs");
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
        if(a_Position < 0) {
            console.error('Failed to get location of a_Position');
        }
        gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0);

        canvas.onmousedown = function(event) {
            clickHandler(event, gl, canvas, a_Position);
        };

        render();
    }
    return bootstrap;
})();






