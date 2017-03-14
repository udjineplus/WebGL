'use strict'

var bootstrap = (function(){
    var canvas, gl;
    var vertices;
    var n;

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


    function initVertexBuffers(gl) {
        vertices = new Float32Array(
          [0.0, 0.5, -0.5, -0.5, 0.5, -0.5]
        );
        var n = 3;
        return n;
    }

    function drawScene() {
        gl.clearColor(0.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, n);
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

        /**/
        n = initVertexBuffers(gl);
        if(n < 0) {
            console.error('n < 0');
            return;
        }
        var vertexBuffer = gl.createBuffer();
        if(!vertexBuffer) {
            console.error('vertexBuffer')
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
        if(a_Position < 0) {
            console.error('Failed to get location of a_Position');
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        /**/
        render();
    }
    return bootstrap;
})();






