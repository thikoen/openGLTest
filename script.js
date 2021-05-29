

//Globale Variablen -------------------------------------------------------

//HSRM Bild
var image;
var imageGL = new Image();

//Open GL Kontext
var canvas;
var gl;
var program;
var model;
var view; 
var projection;
var requestAnimFrame;
var normalMat;
var rotateOn = false;

//Teapot
var teapotNormalData = [];
var teapotVertexData = [];
var teapotIndexData = [];
var teapotVertexIndexBuffer;
var cartoonOn = false;

//Texturing
var image;
var bufTex;
var texcoordPosition;
var textureBool = true;
var texture;

var texVertices = new Float32Array(
            [
                0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0,
                0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0,
                0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0,
                0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0,
                0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0,
                0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0,
            ]);

//Slider
var threshold1;
var threshold2;
var shininessValue;
var ambientIntensityValue;

var lastCalledTime;
var fps;

// Flag, das angibt, ob eine Beleuchtungsrechnung durchgefÃ¼hrt wird (true)
// oder ob einfach die Ã¼bergebenen Eckpunktfarben Ã¼bernommen werden (false)
var lighting = true;
// Anzahl der Eckpunkte der zu zeichenden Objekte 
var numVertices  = 0;
// Array, in dem die Koordinaten der Eckpunkte der zu zeichnenden Objekte eingetragen werden
var vertices = [];
// Array, in dem die Farben der Eckpunkte der zu zeichnenden Objekte eingetragen werden
var vertices = [];
// Array, in dem die Eckpunktkoordinaten der zu zeichnenden Objekte eingetragen werden
var pointsArray = [];
// Array, in dem die Normale je Eckpunkt der zu zeichnenden Objekte eingetragen werden
var normalsArray = [];
// Array, in dem die Farbwerte je Eckpunkt der zu zeichnenden Objekte eingetragen werden
var colorsArray = [];

// Variablen fÃ¼r die Drehung des 1. WÃ¼rfels
var axis = 0;
var BACKUP_AXIS = axis;
var theta =[0, 0, 0];

// Variablen fÃ¼r die Drehung des 2. WÃ¼rfels
var axis2 = 0;
var BACKUP_AXIS2 = axis;
var theta2 =[0, 0, 0];
var theta3 =[0, 0, 0];

var axis3 = 0;
var theta3 =[0, 0, 0];


// Variablen, um die Anzahl der Frames pro Sekunde zu ermitteln
var then = Date.now() / 1000;
var counter = 0;
var frameChange = 20;

var nBuffer;
var vBuffer;
var nBuffer;

//Variablen für Translation
var rotZ = 0.0;


function setTex(){

	bufTex = gl.createBuffer();
   	texcoordPosition = gl.getAttribLocation(program, "vTexCoord");

   	let newImage = new Image();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufTex);
    gl.vertexAttribPointer(texcoordPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordPosition);
    gl.bufferData(gl.ARRAY_BUFFER,texVertices,gl.STATIC_DRAW);

}

function quad(a, b, c, d) {

     // zunÃ¤chst wird die Normale des Vierecks berechnet. t1 ist der Vektor von Eckpunkt a zu Eckpunkt b
     // t2 ist der Vektor von Eckpunkt von Eckpunkt a zu Eckpunkt c. Die Normale ist dann das 
     // Kreuzprodukt von t1 und t2
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal = vec3(normal);
    
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
    
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
    
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
     
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
	   colorsArray.push(colors[a]);
     
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
	   colorsArray.push(colors[a]);
     
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
	
     // durch die beiden Dreiecke wurden 6 Eckpunkte in die Array eingetragen
     numVertices += 6;    
}

function triangle(a, b, c){

	var t1 = subtract(vertices[b], vertices[a]);
	var t2 = subtract(vertices[c], vertices[a]);
	var normal = cross(t1, t2);
	normal = vec3(normal);

	pointsArray.push(vertices[a]);
	normalsArray.push(normal);
	colorsArray.push(colors[a]);

	pointsArray.push(vertices[b]);
	normalsArray.push(normal);
	colorsArray.push(colors[b]);

	pointsArray.push(vertices[c]);
	normalsArray.push(normal);
	colorsArray.push(colors[c]);

	numVertices += 3;
}

function drawCube()
{

    // zunÃ¤chst werden die Koordinaten der 8 Eckpunkte des WÃ¼rfels definiert
    vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
        vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
        vec4( 0.5,  0.5,  0.5, 1.0 ),  // 2 
        vec4( 0.5, -0.5,  0.5, 1.0 ),  // 3
        vec4( -0.5, -0.5, -0.5, 1.0 ), // 4
        vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
        vec4( 0.5,  0.5, -0.5, 1.0 ),  // 6
        vec4( 0.5, -0.5, -0.5, 1.0 )   // 7
    ];

    // hier werden verschiedene Farben definiert (je eine pro Eckpunkt)
    colors = [
        vec4(1.0, 0.0, 0.0, 1.0), 
	      vec4(1.0, 0, 0.0, 1.0),
        vec4(1.0, 0, 0, 1.0),
        vec4(0, 0, 0, 1.0),
	      vec4(.0, 0.0, 0, 1.0),
	      vec4(1, 0.0, 0, 1.0),
        vec4(0, 0.0, 0.0, 1.0),
	      vec4(1.0, 1.0, 0.0, 1.0)
    ];

    // und hier werden die Daten der 6 Seiten des WÃ¼rfels in die globalen Arrays eingetragen
    // jede WÃ¼rfelseite erhÃ¤lt eine andere Farbe
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    
    
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var cPosition = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);
    
}

function drawPyramide(){ 

    vertices = [
        vec4(0.0, 4.0, 0.0, 1.0), // 0
        vec4(-2.0, 0.0, -1.0, 1.0), // 1
        vec4(-2.0, 0.0, 1.0, 1.0), // 3
        vec4(2.0, 0.0, 1.0, 1.0), // 4
        vec4(2.0, 0.0, -1.0, 1.0), // 2
        
    ];

   colors = [
        vec4(1.0, 0.0, 0.0, 1.0), 
	      vec4(1.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 1.0, 1.0),
	      vec4(0.0, 0.0, 1.0, 1.0),
    ];

    // und hier werden die Daten der Seiten der Pyramide in die globalen Arrays eingetragen
    // jede seite erhÃ¤lt eine andere Farbe
    quad( 0, 1, 2, 3);
    triangle( 4, 1, 0);
    triangle( 4, 2, 1);
    triangle( 4, 3, 2);
    triangle( 4, 0, 3);
    
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var cPosition = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);   
}

 function drawTeapot() {
         
        var teapotVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotNormalData), gl.STATIC_DRAW);
        teapotVertexNormalBuffer.itemSize = 3;
        teapotVertexNormalBuffer.numItems = teapotNormalData.length / 3;

        var teapotVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotVertexData), gl.STATIC_DRAW);
        teapotVertexPositionBuffer.itemSize = 3;
        teapotVertexPositionBuffer.numItems = teapotVertexData.length / 3;

        teapotVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotIndexData), gl.STATIC_DRAW);
        teapotVertexIndexBuffer.itemSize = 1;
        teapotVertexIndexBuffer.numItems = teapotIndexData.length; 
                
        gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));
        gl.enableVertexAttribArray(gl.getAttribLocation(program, "vNormal"));
    
    
        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vNormal"), teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
        
        gl.disableVertexAttribArray(gl.getAttribLocation(program, "vColor"));
        gl.disableVertexAttribArray(gl.getAttribLocation(program, "vTexCoord"));

        gl.uniform1i(gl.getUniformLocation(program, "cartoonOn"), cartoonOn);
        
     }

function setCamera()
{
  
    // es wird ermittelt, welches Element aus der Kameraauswahlliste aktiv ist
    var camIndex = document.getElementById("Cameralist").selectedIndex;

    // Punkt, an dem die Kamera steht  
	  var eye;
    // Punkt, auf den die Kamera schaut
    var vrp;
    // Vektor, der nach oben zeigt  
    var upv;
	
    if (camIndex == 0){
        // hier wird die erste Kameraposition definiert
		    eye = vec3(12.0,12.0,4.0);
     		vrp = vec3(0.0,0.0,0.0);
     		upv = vec3(0.0,1.0,0.0);
	  };

	if(camIndex == 1){
		//Kamera "x-Achse"
		//10 in x Richtung
		eye = vec3(10.0,0,0);
     	vrp = vec3(-10,0.0,0.0);
     	upv = vec3(0.0,1.0,0.0);

	}

	if(camIndex == 2){
		//Kamera "y-Achse"
		//10 in y Richtung
		eye = vec3(0,10,0);
     	vrp = vec3(0,-10,0.0);
     	upv = vec3(1,0,0);

	}

	if(camIndex == 3){
		//Kamera "z-Achse"
		//10 in z Richtung
		eye = vec3(0,0,10);
     	vrp = vec3(0,0.0,-10);
     	upv = vec3(0,1,0);

	}

	if(camIndex == 4){
		//Kamera "Pyramidenspitze"
		eye = vec3(12.0,12.0,4.0);
     	vrp = vec3(0.0,4,0.0);
     	upv = vec3(0.0,1.0,0.0);

	}

    view = lookAt(eye, vrp, upv);  
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "viewMatrix"), false, flatten(view) );
    projection = perspective(60.0, 1.0, 0.01, 100.0);
    // die errechnete Viewmatrix wird an die Shader Ã¼bergeben
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));
}

function calculateLights( materialDiffuse, materialAmbient , materialSpecular )
{

    // zunÃ¤chst werden die Lichtquellen spezifiziert (bei uns gibt es eine Punktlichtquelle)
    
    // die Position der Lichtquelle (in Weltkoordinaten)
    var lightPosition = vec4(7.0, 7.0, 0.0, 1.0 );
    
    // die Farbe der Lichtquelle im diffusen Licht
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

    //Ambient
    var lightAmbient = vec4(ambientIntensityValue/100, ambientIntensityValue/100, ambientIntensityValue/100, 1.0);

    //Specular
    var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    // dann wird schon ein Teil der Beleuchtungsrechnung ausgefÃ¼hrt - das kÃ¶nnte man auch im Shader machen
    // aber dort wÃ¼rde diese Rechnung fÃ¼r jeden Eckpunkt (unnÃ¶tigerweise) wiederholt werden. Hier rechnen wir
    // das Produkt aus lightDiffuse und materialDiffuse einmal aus und Ã¼bergeben das Resultat. Zur Multiplikation
    // der beiden Vektoren nutzen wir die Funktion mult aus einem externen Javascript (MV.js)
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var specularProduct = mult(lightSpecular, materialSpecular);
        
    // die Werte fÃ¼r die Beleuchtungsrechnung werden an die Shader Ã¼bergeben
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
       
}

function displayScene(){

    setCamera();
    
    // Erster Würfel -------------------------
    numVertices = 0;
	  pointsArray.length=0;
	  colorsArray.length=0;
	  normalsArray.length=0;
    
    drawCube();
    
    var lighting = false; // Beleuchtungsrechnung wird durchgefÃ¼hrt
    
    // die Information Ã¼ber die Beleuchtungsrechnung wird an die Shader weitergegeben
    gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);
    
    if (lighting) {
	      var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
        //calculateLights( materialDiffuse );
         
    } else {};
   
   // Initialisierung mit der Einheitsmatrix 
	model = mat4();    
	//Ganz am Ende Translation durchführen
   // Das Objekt wird am Ende noch um die x-Achse rotiert 
   model = mult(model, rotate(theta[0], [1, 0, 0] ));
    
   // Zuvor wird das Objekt um die y-Achse rotiert
   model = mult(model, rotate(theta[1], [0, 1, 0] ));
    
   // Als erstes wird das Objekt um die z-Achse rotiert 
   model = mult(model, rotate(theta[2], [0, 0, 1] ));
   model = mult(model,translate(5,0,1));
   model = mult(model, rotate(theta2[2], [0, 0, 1] ));

   // die Model-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	 gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelMatrix"), false, flatten(model) );
    
   // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
   normalMat = mat4();
   normalMat = mult( view, model );
   normalMat = inverse( normalMat );
   normalMat = transpose( normalMat );
    
   gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );


   // Zweiter Würfel -------------------------   

	numVertices = 0;
	pointsArray.length=0;
	colorsArray.length=0;
	normalsArray.length=0;

	setTex();

	gl.uniform1i(gl.getUniformLocation(program, "textureBool"), textureBool);
    
    drawCube();
    
    var lighting = true;

    gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);
    
    
    if (lighting) {
	      var materialDiffuse = vec4(0,1, 0, 1);
	      var materialAmbient = vec4(0, 0.1, 0, 1);
          var materialSpecular = vec4(1, 1, 1, 1);
    
        // die Beleuchtung wird durchgefÃ¼hrt und das Ergebnis an den Shader Ã¼bergeben
        calculateLights( materialDiffuse,materialAmbient,materialSpecular );
    } else {};
   
    // Initialisierung mit der Einheitsmatrix 
	model = mat4();    
	 //Ganz am Ende Translation durchführen
	 
   // Das Objekt wird am Ende noch um die x-Achse rotiert 
   model = mult(model, rotate(theta[0], [1, 0, 0] ));
    
   // Zuvor wird das Objekt um die y-Achse rotiert
   model = mult(model, rotate(theta[1], [0, 1, 0] ));
    
   // Als erstes wird das Objekt um die z-Achse rotiert 
   model = mult(model, rotate(theta[2], [0, 0, 1] ));
   model = mult(model,translate(5,0,-3));
   model = mult(model, rotate(theta3[0], [1, 0, 0] ));

   //Skalieren auf doppelte Groesse
   model = mult(model, scalem(2,2,2));
   
   // die Model-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	 gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelMatrix"), false, flatten(model) );
    
   // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
   normalMat = mat4();
   normalMat = mult( view, model );
   normalMat = inverse( normalMat );
   normalMat = transpose( normalMat );
    
   // die Normal-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

	gl.uniform1i(gl.getUniformLocation(program, "textureBool"), false);


   	// Erste Pyramide -------------------------

    numVertices = 0;
	pointsArray.length=0;
	colorsArray.length=0;
	normalsArray.length=0;
    
    // jetzt werden die Arrays mit der entsprechenden Zeichenfunktion mit Daten gefÃ¼llt
    drawPyramide()
    
    // es wird festgelegt, ob eine Beleuchtungsrechnung fÃ¼r das Objekt durchgefÃ¼hrt wird oder nicht
    var lighting = true; // Beleuchtungsrechnung wird durchgefÃ¼hrt
    
    // die Information Ã¼ber die Beleuchtungsrechnung wird an die Shader weitergegeben
    gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);
    
    if (lighting) {
     
        var materialDiffuse = vec4(1, 1, 0, 1);
        var materialAmbient = vec4(0.2, 0.2, 0, 1);
        var materialSpecular = vec4(1, 1, 1, 1);
    
        // die Beleuchtung wird durchgefÃ¼hrt und das Ergebnis an den Shader Ã¼bergeben
        calculateLights( materialDiffuse,materialAmbient,materialSpecular );
         
    } else {};

   model = mat4();    

    // Das Objekt wird am Ende noch um die x-Achse rotiert 
    model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
    // Zuvor wird das Objekt um die y-Achse rotiert
    model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
    // Als erstes wird das Objekt um die z-Achse rotiert 
    model = mult(model, rotate(theta[2], [0, 0, 1] ));
	
   // die Model-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	 gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelMatrix"), false, flatten(model) );
    
   // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
   normalMat = mat4();
   normalMat = mult( view, model );
   normalMat = inverse( normalMat );
   normalMat = transpose( normalMat );
    
   // die Normal-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	 gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );

   // schlieÃŸlich wird alles gezeichnet. Dabei wird der Vertex-Shader numVertices mal aufgerufen
   // und dabei die jeweiligen attribute - Variablen fÃ¼r jeden einzelnen Vertex gesetzt
   // auÃŸerdem wird OpenGL mitgeteilt, dass immer drei Vertices zu einem Dreieck im Rasterisierungsschritt
   // zusammengesetzt werden sollen
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );


   // Zweite Pyramide -------------------------

    numVertices = 0;
	pointsArray.length=0;
	colorsArray.length=0;
	normalsArray.length=0;
    
    
    // jetzt werden die Arrays mit der entsprechenden Zeichenfunktion mit Daten gefÃ¼llt
    drawPyramide()
    
    // es wird festgelegt, ob eine Beleuchtungsrechnung fÃ¼r das Objekt durchgefÃ¼hrt wird oder nicht
    var lighting = true; // Beleuchtungsrechnung wird durchgefÃ¼hrt
    
    // die Information Ã¼ber die Beleuchtungsrechnung wird an die Shader weitergegeben
    gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);
    
    if (lighting) {
        var materialDiffuse = vec4(1, 0, 0, 1);
        var materialAmbient = vec4(0.1, 0, 0, 1);
        var materialSpecular = vec4(1, 1, 1, 1)
        calculateLights( materialDiffuse,materialAmbient,materialSpecular );
         
    } else {};

   model = mat4();    


   // Das Objekt wird am Ende noch um die x-Achse rotiert 
    model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
    // Zuvor wird das Objekt um die y-Achse rotiert
    model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
    // Als erstes wird das Objekt um die z-Achse rotiert 
    model = mult(model, rotate(theta[2], [0, 0, 1] ));

    model = mult(model,translate(0,8,0));

 	model = mult(model, rotate(180, [1, 0, 0] ));

	
   // die Model-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	 gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelMatrix"), false, flatten(model) );
    
   // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
   normalMat = mat4();
   normalMat = mult( view, model );
   normalMat = inverse( normalMat );
   normalMat = transpose( normalMat );
    
   // die Normal-Matrix ist fertig berechnet und wird an die Shader Ã¼bergeben 
 	 gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );

   // schlieÃŸlich wird alles gezeichnet. Dabei wird der Vertex-Shader numVertices mal aufgerufen
   // und dabei die jeweiligen attribute - Variablen fÃ¼r jeden einzelnen Vertex gesetzt
   // auÃŸerdem wird OpenGL mitgeteilt, dass immer drei Vertices zu einem Dreieck im Rasterisierungsschritt
   // zusammengesetzt werden sollen
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );



   // Dritte Pyramide -------------------------

    numVertices = 0;
	pointsArray.length=0;
	colorsArray.length=0;
	normalsArray.length=0;
    
    
    // jetzt werden die Arrays mit der entsprechenden Zeichenfunktion mit Daten gefÃ¼llt
    drawPyramide()
    
    // es wird festgelegt, ob eine Beleuchtungsrechnung fÃ¼r das Objekt durchgefÃ¼hrt wird oder nicht
    var lighting = true; // Beleuchtungsrechnung wird durchgefÃ¼hrt
    
    // die Information Ã¼ber die Beleuchtungsrechnung wird an die Shader weitergegeben
    gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);
    
    if (lighting) {
        var materialDiffuse = vec4(0, 0, 1, 1);
        var materialAmbient = vec4(0, 0, 0.1, 1);
        var materialSpecular = vec4(1, 1, 1, 1);
        calculateLights( materialDiffuse,materialAmbient,materialSpecular );
         
    } else {};

   model = mat4();    

    // Das Objekt wird am Ende noch um die x-Achse rotiert 
    model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
    // Zuvor wird das Objekt um die y-Achse rotiert
    model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
    // Als erstes wird das Objekt um die z-Achse rotiert 
    model = mult(model, rotate(theta[2], [0, 0, 1] ));


    model = mult(model, translate(0, 6.78, 0.7));

   //Skalieren auf doppelte Groesse
   model = mult(model, scalem(0.4,0.4,0.4));

   model = mult(model, rotate(104, [1, 0, 0] ));


   gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelMatrix"), false, flatten(model) );
   normalMat = mat4();
   normalMat = mult( view, model );
   normalMat = inverse( normalMat );
   normalMat = transpose( normalMat );
    
   gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
   


   // Teapot --------------------------

    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    drawTeapot();

    var lighting = true; // Beleuchtungsrechnung wird durchgeführt

    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);
    gl.uniform1i(gl.getUniformLocation(program, "cartoonOn"), cartoonOn);

    //glProgramUniform4fv(p, myLoc, 1, myFloats);

    gl.uniform1f(gl.getUniformLocation(program, "thres1"), threshold1);
    gl.uniform1f(gl.getUniformLocation(program, "thres2"), threshold2);

    if (lighting) {
       
    	//Normales Shading -> Cartoon Shader im Vertex Shader
        var materialDiffuse = vec4(0.0, 0.0, 1.0, 1.0);
        var materialAmbient = vec4(0.2, 0.4, 0.2, 1.0);
        var materialSpecular = vec4(0.3, 0.2, 0.4, 1.0);

        calculateLights(materialDiffuse, materialAmbient, materialSpecular);

    } else {};

    // Initialisierung mit der Einheitsmatrix
    model = mat4();

    // Das Objekt wird am Ende noch um die x-Achse rotiert 
    model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
    // Zuvor wird das Objekt um die y-Achse rotiert
    model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
    // Als erstes wird das Objekt um die z-Achse rotiert 
    model = mult(model, rotate(theta[2], [0, 0, 1] ));

    model = mult(model, translate(-5.0, 0.0, 6.0));

    model = mult(model, scalem(0.3, 0.3, 0.3));

    //Drehung um y Achse
    model = mult(model, rotate(theta3[0], [0, 1, 0] ));

    // die Model-Matrix ist fertig berechnet und wird an die Shader übergeben
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));
    gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    //Erst am Ende Cartoon Shader aus schalten
	gl.uniform1i(gl.getUniformLocation(program, "cartoonOn"), false);
	//// gl.uniform1f(gl.getUniformLocation(program, "thres2"), 0);

    console.log(threshold1);

    gl.uniform1f(gl.getUniformLocation(program, "shininessValue"), shininessValue);
    gl.uniform1f(gl.getUniformLocation(program, "ambientIntensityValue"), ambientIntensityValue);
} 

var render = function(){
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(rotateOn){
    	theta[axis] += 2;
    }
    
    // DurchfÃ¼hrung der Animation: der WÃ¼rfel wird um 2Â° weiter gedreht und zwar um die aktuell ausgewÃ¤hlte Achse
    
	//Würfel immer um z Achse drehen
	theta2[2] += 0.5;
    
    // DurchfÃ¼hrung der Animation: der WÃ¼rfel wird um 2Â° weiter gedreht und zwar um die aktuell ausgewÃ¤hlte Achse
    theta2[axis2] += 2.0;
	
	//Würfel immer um x Achse drehen
	theta3[0] += 1;
            
	displayFPS();
	
    // jetzt kann die Szene gezeichnet werden
    displayScene();
        
    // der Frame fertig gezeichnet ist, wird veranlasst, dass der nÃ¤chste Frame gezeichnet wird. Dazu wird wieder
    // die die Funktion aufgerufen, welche durch die Variable render spezifiziert wird
	requestAnimFrame(render);
}

function displayFPS(){

	var dateThis = new Date;
	var fps = Math.round(1000 / (dateThis - then));
    then = dateThis;

    if (counter == frameChange) {
        document.getElementById("fps").innerHTML = fps + " FPS";
        counter = 0;
    }

    counter++;
}

window.onload = function init() {

	document.getElementById("ButtonC").onclick = function() {
        cartoonOn = !cartoonOn;
    };

	function loadTeapot() {
    var request = new XMLHttpRequest();

    request.open("GET", "Teapot.json");

    request.onreadystatechange = function() {

        if (request.readyState == 4) {
            var teapotData = JSON.parse(request.responseText);

            var i = 0;

            while (i < teapotData.vertexNormals.length) {
                teapotNormalData.push(teapotData.vertexNormals[i]);
                i++;
            }

            i = 0;

            while (i < teapotData.vertexPositions.length) {
                teapotVertexData.push(teapotData.vertexPositions[i]);
                i++;
            }

            i = 0;

            while (i < teapotData.indices.length) {
                teapotIndexData.push(teapotData.indices[i]);
                i++;
            }
        }
    }
    request.send();
}

	function initSliders(){

	var slider1 = document.getElementById("threshold1");
    var slider2 = document.getElementById("threshold2");

	slider1.onclick = function() {
    	threshold1 = (slider1.value / 100);
	}

	slider2.onclick = function() {
    	threshold2 = (slider1.value / 100);
	}

   	threshold1 = document.getElementById("threshold1").value / 100;
	threshold2 = document.getElementById("threshold2").value / 100;

	//shininess
	var slider3 = document.getElementById("shininess");

	slider3.onclick = function(){
		shininessValue = (slider3.value)
	}

	shininessValue = document.getElementById("shininess").value;

	//Ambient Intensity
	var slider4 = document.getElementById("ambient");

	slider4.onclick = function(){
		ambientIntensityValue = (slider4.value)
	}

	ambientIntensityValue = document.getElementById("ambient").value;

}

	function initEvents(){
		document.getElementById("ButtonX").onclick = function(){axis = 0; axis2 = 0;};
	    document.getElementById("ButtonY").onclick = function(){axis = 1; axis2 = 1;};
	    document.getElementById("ButtonZ").onclick = function(){axis = 2;};
	   	document.getElementById("ButtonT").onclick = function(){rotateOn = !rotateOn;};
	   	image = document.getElementById("texImage");
	}

	function initTexture(){

	    let newImage = new Image();

	    texture = gl.createTexture();
    	gl.bindTexture(gl.TEXTURE_2D, texture);

   		newImage.addEventListener('load', function() {
        	gl.bindTexture(gl.TEXTURE_2D, texture);
        	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, newImage);
        	gl.generateMipmap(gl.TEXTURE_2D);
    });

    	newImage.src = image.src;
	}

	function requestAnimFrame() {

		if(!lastCalledTime) {
			lastCalledTime = Date.now();
			fps = 0;
			return;
		}

		delta = (Date.now() - lastCalledTime)/1000;
		lastCalledTime = Date.now();
		fps = 1/delta;
	} 
    
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
  
    // die Hintergrundfarbe wird festgelegt
    gl.clearColor( 0.9, 0.9, 1.0, 1.0 );
    
    // die Verdeckungsrechnung wird eingeschaltet: Objekte, die nÃ¤her an der Kamera sind verdecken
    // Objekte, die weiter von der Kamera entfernt sind
    gl.enable(gl.DEPTH_TEST);

    // der Vertex-Shader und der Fragment-Shader werden initialisiert
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    // die Ã¼ber die Refenz "program" zugÃ¤nglichen Shader werden aktiviert
    gl.useProgram( program );

	// OpenGL Speicherobjekte anlegen
	vBuffer = gl.createBuffer();
	nBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();

    
    //Buttons Binden
    initEvents();

    //Slider für Threshold
   	initSliders();

   	//Teapot laden
	loadTeapot();

	//Textur laden
	initTexture();

	//Alles rendern
    render();
}












 


