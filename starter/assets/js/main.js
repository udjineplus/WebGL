'use strict'

var bootstrap = (function(){
    var canvas, gl;

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
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    function render() {
        requestAnimationFrame(render);
        drawScene();
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
        render();
    }
    return bootstrap;
})();






