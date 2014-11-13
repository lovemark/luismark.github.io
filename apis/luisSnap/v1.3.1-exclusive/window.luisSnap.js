// Use a little trick to expose Sizzle
var Sizzle = jQuery.find;

// Initialise the luisSnap object (based on Scratch by the Lifelong Kindergarten Group).

var luisSnap = {
  
  // Sprite list for this stage.
  sprites: [],
  
  // Custom blocks for every sprite, including the stage itself.
  // Difference: Every sprite can run the custom blocks of the stage.
  customBlocks: {stage: []},
  
  // Variables for the stage (and also every sprite)
  variables: {},
  
  // Lists for the stage (and also every sprite)
  lists: {},
  
  // Gets a variable 
  getVar: function(type, name) {
    return (typeof this.variables[name] === ((type === 3) ? "string" : "number")) ? this.variables[name] : undefined;
  },
  
  // Sets a variable
  setVar: function(name, value) {
    this.variables[name] = value;
    return typeof value == "string" ? 3 : (typeof value === "number" ? 2 : 0);
  },
  
  // Creates variables for the stage (or for a specific sprite)
  createVars: function(vars, sprite) {
    this.jQuery.each(vars, function(index, element) {
      this.variables[sprite != "" && typeof sprite === "string" ? sprite + ": " + element : element] = 0;
    });
  },
  
  // Errors out
  error: function() {
    // Error with a funny LuisSnap-related message
    throw new Error("Oh no, LuisSnap is too busy");
  },
  
  // Does nothing (used for LuisSnap opcode processing)
  noop: function() {},
  
  // Changes a number variable by a specified amount
  changeVar: function(name, delta) {
    try {
      if (typeof this.variables[name] == "string") {
        error();
      }
      this.variables[name] += delta;
    } catch (e) {
      error();
    }
  },
  
  // The variable monitors (also for lists) that contain visibility, location and size of the variable/list they belong to.
  varmonitors: {},
  
  // Shows a variable.
  showVar: function(name, x, y, w, h) {
    this.varmonitors[name] = {visible: true, x: x, y: y, width: w, height: h};
  },
  
  // Hides a variable.
  hideVar: function(name) {
    try {
      // Use a funny way of checking if the fields are present (throws an exception if not).
      this.varmonitors[name].x.toString();
      this.varmonitors[name].y.toString();
      this.varmonitors[name].width.toString();
      this.varmonitors[name].height.toString();
      this.varmonitors[name].visible.toString().replace(/f[A-Za-z]{4}/, "true");
      this.varmonitors[name] = false;
    } catch (e) {
      error();
    }
  },
  
  // Turbo mode
  turbo: false,
  
  // Waiter for LuisSnap purposes
  wait: function(seconds) {
    var start = new Date().getTime();
    while (!stopped) {
      if ((new Date().getTime() - start) > (milliseconds * 1000)){
        break;
      }
    }
  },
  
  // Repeats a specified block a certain number of times.
  repeat: function(times, callback) {
    for (var i = 0; i < times && !stopped; i++) {
      if (!turbo && i != 0) {
        // In normal (non-turbo) mode, we must delay between iterations.
        wait(3);
      }
      callback();
    }
  },
  
  // A boolean indicating whether the LuisSnap scripts are stopped.
  stopped: false,
  
  // Waits until a specified function returns true.
  waitUntil: function(callback) {
    while (!callback() && !stopped);
  },
  
  // Repeats a specified block until a specified function returns true.
  until: function(checker, callback) {
    while (!checker() && !stopped) {
      callback();
    }
  },
  
  // Repeats the specified block forever.
  forever: function(callback) {
    while (!stopped) {
      callback();
    }
  },
  
  // Adds a specified sprite to the stage.
  addSprite: function(name, flags, code) {
    this.sprites[name] = {
      name: name,
      code: btoa(String.fromCharCode(flags | 7) + name + "\x00" + atob(code)),
      x: 0,
      y: 0,
      d: 90,
      penDown: false,
      volume: 100,
      instrument: 1,
      costumeNum: 1,
      costumes: [name + (arguments[3] ? ".svg" : ".png")],
      costumeName: name.toLowerCase(),
      penColour: 0
    };
    this.currentSprite = name;
    this.show();
  },
  
  // The thank list.
  thanks: [],
  
  // Adds a thank to the thank list.
  addThanks: function(thank) {
    this.thanks.push(thank);
  },
  
  // Used for getting an error from a error code (I will leave it empty)
  Error: function() {},
  
  // Returns this if callback returns true, else returns undefined.
  assert: function(callback) {
    return callback() ? this : undefined;
  },
  
  // The current jQuery object.
  jQuery: undefined,
  
  // Checks if jQuery is present.
  checkForJQuery: function() {
    if (timer) {
      clearInterval(timer);
    }
    this.jQuery = this.assert(function() {
      return !!window.jQuery;
    }) ? window.jQuery : undefined;
    return this;
  },
  
  // The current sprite.
  currentSprite: "Stage",
  
  // Checks if the code we're running now is in a sprite.
  isSprite: function() {
    return this.currentSprite !== "Stage";
  },
  
  // The constant TAU.
  TAU: 6.283185307179586476,
  
  // Moves the current sprite forward the specified number of steps.
  move: function(steps) {
    // Error out if trying to move the stage
    if (!isSprite()) {
      error();
    }
    var direction = this.sprites[currentSprite].d;
    
    // Remember old x and y
    var x = this.sprites[currentSprite].x;
    var y = this.sprites[currentSprite].y;
    
    // Euler's formula: e ^ (i * theta) = cos(theta) + i * sin(theta).
    this.sprites[currentSprite].x += steps * Math.cos((90 - direction) / 360 * this.TAU);
    this.sprites[currentSprite].y += steps * Math.sin((90 - direction) / 360 * this.TAU);
    
    // Check for pen down
    if (this.sprites[currentSprite].penDown) {
      this.draw(x, y, this.sprites[currentSprite].x, this.sprites[currentSprite].y);
    }
  },
  
  // Rotates left the current sprite a specified number of degrees.
  rotateLeft: function(angle) {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].d -= angle;
    this.checkDirection();
  },
  
  // Checks the direction of the current sprite.
  checkDirection: function() {
    if (!isSprite()) {
      error();
    }
    while (this.sprites[currentSprite].d < -180) {
     this.sprites[currentSprite].d += 360;
    }
    while (this.sprites[currentSprite].d > 180) {
     this.sprites[currentSprite].d -= 360;
    }
  },
  
  // Rotates right the specified number of degrees.
  rotateRight: function(angle) {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].d += angle;
    this.checkDirection();
  },
  
  // Goes to a specified location.
  goTo: function(x1, y1) {
    if (!isSprite()) {
      error();
    }
    var x0 = this.sprites[currentSprite].x;
    var y0 = this.sprites[currentSprite].y;
    this.sprites[currentSprite].x = x1;
    this.sprites[currentSprite].y = y1;
    if (this.sprites[currentSprite].penDown) {
      this.draw(x0, y0, x1, y1);
    }
  },
  
  // The instruction set.
  instructions: [],
  
  // The constructor.
  constructor: function() {
    this.init();
    return this;
  },
  
  // Creates a new instance of LuisSnap.
  newInstance: function() {
    return window.luisSnap.constructor();
  },
  
  // Stores the current position in the instruction stream.
  position: 0,
  
  // Adds two numbers together.
  add: function(a, b) {
    return a + b;
  },
  
  // Subtracts one number from another.
  subtract: function(a, b) {
    return a - b;
  },
  
  // Multiplies one number by another.
  multiply: function(a, b) {
    return a * b;
  },
  
  // Divides one number by another.
  divide: function(a, b) {
    return a / b;
  },
  
  // Picks a random value between the specified minimum and maximum.
  random: function(a, b) {
    // Pick Random in LuisSnap returns an integer if both arguments are integers.
    if (Math.floor(a) === a && Math.floor(b) === b) {
      return Math.floor(a + ((b + 1 - a) * Math.random()));
    } else
    {
      // Otherwise, returns a decimal value.
      return (a + ((b - a) * Math.random()));
    }
  },
  
  // Shows this sprite.
  show: function() {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].shown = true;
  },
  
  // The canvas used for drawing.
  canvas: undefined,
  
  // Searches for canvas elements in the document.
  searchCanvas: function() {
    var canvas = $("canvas").length && $("canvas")[0];
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "canvas" + window.uuidgen(4).replace(/\x2d/g, "").substring(0, 7);
      canvas.width = 480;
      canvas.height = 360;
     
      // Display a message if the browser doesn't support HTML5 canvas technology
      $(canvas).html("Unfortunately, your browser doesn't support HTML5 canvas technology. To know more, go to https://github.com/luis140219 .");
      $("body").append(canvas);
    }
    this.canvas = canvas;
  },
  
  // Draws a line with source and destination.
  draw: function(x0, y0, x1, y1) {
    var ctx = this.canvas.getContext("2d");
    ctx.moveTo(x0, y0);
    ctx.strokeStyle = "#" + (function(a) {
      while (a.length < 6) {
        a = "0" + a;
      }
      return a;
    })(this.sprites[currentSprite].penColour.toString(16));
    ctx.lineTo(x1, y1);
  },
  
  // Puts the pen of the current sprite down.
  penDown: function() {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].penDown = true;
  },
  
  // Puts the pen of the current sprite up.
  penUp: function() {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].penDown = false;
  },
  
  // Sets the pen colour to a specified value.
  setPenColour: function(c) {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].penColour = c;
  },
  
  // Sets the pen colour to a specified HSL value.
  setPenColourHSL: function(h, s, l) {
    if (!isSprite()) {
      error();
    }
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    this.sprites[currentSprite].penColour = Math.round(r * 255) * 65536;
    this.sprites[currentSprite].penColour += Math.round(g * 255) * 256;
    this.sprites[currentSprite].penColour += Math.round(b * 255);
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  
  // Initialises the LuisSnap engine.
  init: function(vars) {
    window.luisSnap.addSprite("null", 7, "gCU=");
    window.luisSnap.sprite = this.sprites[currentSprite];
    for (var i = 0; i < 256; i++) {
      instructions.push(this.noop);
    }
    // Motion blocks
    instructions[0] = this.move;
    instructions[1] = this.rotateRight;
    instructions[2] = this.rotateLeft;
    instructions[5] = this.goTo;
    instructions[8] = this.changeX;
    instructions[9] = this.setX;
    instructions[10] = this.changeY;
    instructions[11] = this.setY;
    instructions[14] = this.xPosition;
    instructions[15] = this.yPosition;
    instructions[16] = this.direction;
    
    // Looks blocks
    instructions[36] = this.show;
    instructions[37] = this.hide;
    instructions[38] = this.switchCostume;
    instructions[39] = this.nextCostume;
    
    // Pen blocks
    instructions[98] = this.penDown;
    instructions[99] = this.penUp;
    
    // Sensing blocks (category added in v1.3.0)
    instructions[166] = this.keyPressed;
    instructions[167] = this.getMouseDown;
    instructions[168] = this.getMouseX;
    instructions[169] = this.getMouseY;
    instructions[176] = this.selectVar;
    instructions[177] = this.current;
    instructions[178] = this.daysSince2000;
    
    // Operators blocks
    instructions[192] = this.add;
    instructions[193] = this.subtract;
    instructions[194] = this.multiply;
    instructions[195] = this.divide;
    instructions[196] = this.random;
    instructions[197] = this.lessThan;
    instructions[198] = this.equals;
    instructions[199] = this.greaterThan;
    instructions[208] = this.math;
    instructions[209] = this.unicodeOf;
    instructions[210] = this.unicodeFrom;
    
    // Variables blocks
    instructions[224] = this.getVar;
    instructions[225] = this.setVar;
    instructions[226] = this.changeVar; // bug fixed with v1.2.0
    instructions[227] = this.showVar;
    instructions[228] = this.hideVar;

    window.luisSnap.extend({
      addSystem: function(z) {
        jQuery.each(atob(z).split("\xfe\xfb\xff\xff\xff"), function(i, e) {
          if ((e.charCodeAt(0) & 4) != 0) {
            window.luisSnap.addSprite(e.split("\x00")[0].substring(1, e.split("\x00")[0].length), e.charCodeAt(0), btoa(e));
          }
          window.luisSnap.position = e.indexOf("\x80");
          this.currentSprite = this[0].split("\x00")[0].substring(1, this[0].split("\x00")[0].length);
        });
      }
    });
  },
  
  // Gets the next byte available.
  nextByte: function() {
    if (atob(this.sprites[currentSprite].code).length <= this.position) {
      error();
    }
    var a = atob(this.sprites[currentSprite].code).charCodeAt(this.position);
    this.position++;
    return a;
  },
  
  // Gets the next boolean token available.
  nextBooleanToken: function() {
    var a = this.nextByte();
    if ((a & 4) == 4) {
      var b = [];
      var z = this.nextByte();
      for (var i = 0; i < instructions[z].length; i++) {
        b.push(this.nextToken());
      }
      return instructions[z].apply(this, b);
    } else
    {
      var c = this.nextByte();
      return c != 0;
    }
  },
  
  // Gets the next number token available.
  nextNumberToken: function() {
    var a = this.nextByte();
    if ((a & 4) == 4) {
      var b = [];
      var z = this.nextByte();
      for (var i = 0; i < instructions[z].length; i++) {
        b.push(this.nextToken());
      }
      return instructions[z].apply(this, b);
    } else
    {
      var c = this.nextByte();
      if ((c & 128) != 128) {
        var d = 0;
        for (var j = 0; j < c; j++) {
          d += Math.pow(256, j) * this.nextByte();
        }
        return d;
      } else
      {
        function doubleToBytes(f) {
          var buf = new ArrayBuffer(8);
          (new Float64Array(buf))[0] = f;
          return [ (new Uint32Array(buf))[0] ,(new Uint32Array(buf))[1] ];
        }
        function bytesToDouble(f)
        {
          var buffer = new ArrayBuffer(8);
          (new Uint32Array(buffer))[0] = f[0];
          (new Uint32Array(buffer))[1] = f[1];
          return new Float64Array(buffer)[0];
        }
        var e = 0;
        var f = [];
        for (var k = 0; k < 4; k++) {
          e += this.nextByte() * Math.pow(256, k);
        }
        f.push(e);
        e = 0;
        for (var l = 0; l < 4; l++) {
          e += this.nextByte() * Math.pow(256, l);
        }
        f.push(e);
        return bytesToDouble(f);
      }
    }
  },
  
  // Get the next string token available.
  nextStringToken: function() {
    var a = this.nextByte();
    if ((a & 4) == 4) {
      var b = [];
      var z = this.nextByte();
      for (var i = 0; i < instructions[z].length; i++) {
        b.push(this.nextToken());
      }
      return instructions[z].apply(this, b);
    } else
    {
      var c = "", d = 32;
      while (((a & 16 == 16) ? (d = this.nextByte() + 256 * this.nextByte()) : (d = this.nextByte)) != 0) {
        c += String.fromCharCode(d);
      }
      return c;
    }
  },
  
  // Gets the next token available.
  nextToken: function() {
    var a = this.nextByte();
    this.position--;
    switch (a & 3) {
      case 1: return this.nextBooleanToken();
      case 2: return this.nextNumberToken();
      case 3: return this.nextStringToken();
      default: error();
    }
  },
  
  // The base sprite for constructing new ones.
  sprite: undefined,
  
  // Adds a sprite object to the stage.
  addSpriteObj: function(sprite) {
    this.sprites[sprite.name] = sprite;
    currentSprite = sprite.name;
    this.position = sprite.name.length + 1;
  },
  
  // Executes the next instruction in the instruction stream.
  nextInstruction: function() {
    var z = this.nextByte();
    var b = [];
    for (var i = 0; i < instructions[z].length; i++) {
      b.push(this.nextToken());
    }
    instructions[z].apply(this, b);
  },
  
  // Runs the LuisSnap engine.
  run: function() {
    var frame = function() {
      try {
        window.luisSnap.nextInstruction();
        window.requestAnimationFrame(frame);
      }
      catch (e) {}
    }
    window.requestAnimationFrame(frame);
  },
  
  // Gets the X position of the current sprite. (v1.1.0)
  xPosition: function() {
    if (!isSprite()) {
      error();
    }
    return this.sprites[currentSprite].x;
  },
  
  // Gets the Y position of the current sprite. (v1.1.0)
  yPosition: function() {
    if (!isSprite()) {
      error();
    }
    return this.sprites[currentSprite].y;
  },
  
  // Gets the direction of the current sprite. (v1.1.0)
  direction: function() {
    if (!isSprite()) {
      error();
    }
    return this.sprites[currentSprite].d;
  },
  
  // Checks if two values are equal. (v1.1.0)
  equals: function(a, b) {
    return a == b;
  },
  
  // Checks if one value is less than another. (v1.1.0)
  lessThan: function(a, b) {
    return a < b;
  },
  
  // Checks if one value is greater than another. (v1.1.0)
  greaterThan: function(a, b) {
    return a > b;
  }, 
  
  // Calls a mathematical function of the specified number. (v1.1.0) (bug fixed with v1.1.1)
  math: function(n, a) {
    var map =[Math.abs, Math.floor, Math.ceil, Math.sqrt, Math.sin, Math.cos,
              Math.tan, Math.asin, Math.acos, Math.atan, Math.ln, Math.log,
              function(s) {
                return Math.pow(Math.E, s);
              },
              function(s) {
                return Math.pow(10, s);
              }];
    return map[n](a);
  },
  
  // Gets the Unicode code for a letter. (v1.1.0)
  unicodeOf: function(l) {
    return l.charCodeAt(0);
  },
  
  // Gets a letter from the specified Unicode code. (v1.1.0)
  unicodeFrom: function(l) {
    return String.fromCharCode(l);
  },
  
  // Switches to the specified costume. (v1.1.0)
  switchCostume: function(i) {
    if (!isSprite()) {
      error();
    }
    this.sprites[currentSprite].costumeNum = i;
  },
  
  // Switches to the next costume. (v1.2.0)
  nextCostume: function() {
    if (!isSprite()) {
      error();
    }
    this.switchCostume(this.sprites[currentSprite].costumeNum == this.sprites[currentSprite].costumes.length ? 1 : this.sprites[currentSprite].costumeNum + 1);
  },
  
  // The backdrop name. (v1.2.0)
  backdropName: "backdrop1",
  
  // The backdrop list. (v1.2.0)
  backdrops: ["backdrop1.png"],
  
  // Changes the X coordinate of the current sprite by a specified amount. (v1.2.0)
  changeX: function(dx) {
    if (!isSprite()) {
      error();
    }
    var x0 = this.sprites[currentSprite].x,
        y0 = this.sprites[currentSprite].y,
        y1 = y0;
    this.sprites[currentSprite].x += dx;
    if (this.sprites[currentSprite].penDown) {
      this.draw(x0, y0, x0 + dx, y1);
    }
  },
  
  // Sets the X coordinate of the current sprite to a specified value. (v1.2.0)
  setX: function(x1) {
    if (!isSprite()) {
      error();
    }
    var x0 = this.sprites[currentSprite].x,
        y0 = this.sprites[currentSprite].y,
        y1 = y0;
    this.sprites[currentSprite].x = x1;
    if (this.sprites[currentSprite].penDown) {
      this.draw(x0, y0, x1, y1);
    }
  },
  
  // Changes the Y coordinate of the current sprite by a specified amount. (v1.2.0)
  changeY: function(dy) {
    if (!isSprite()) {
      error();
    }
    var x0 = this.sprites[currentSprite].x,
        y0 = this.sprites[currentSprite].y,
        x1 = x0;
    this.sprites[currentSprite].y += dy;
    if (this.sprites[currentSprite].penDown) {
      this.draw(x0, y0, x1, y0 + dy);
    }
  },
  
  // Sets the Y coordinate of the current sprite to a specified value. (v1.2.0)
  setY: function(y1) {
    if (!isSprite()) {
      error();
    }
    var x0 = this.sprites[currentSprite].x,
        y0 = this.sprites[currentSprite].y,
        x1 = x0;
    this.sprites[currentSprite].y = y1;
    if (this.sprites[currentSprite].penDown) {
      this.draw(x0, y0, x1, y1);
    }
  },
  
  // Hides the current sprite. (could be in v1.0.0, added in v1.3.0)
  hide: function() {
    this.spriteCheck(function(d) {
      d.shown = false;
    });
  },
  
  // Executes the specified code if we're on a sprite. (v1.3.0)
  spriteCheck: function(f, d) {
    if (!isSprite()) {
      error();
    }
    return f.apply(this, this.sprites[currentSprite]);
  },
  
  // Triggers the mouse event. (v1.3.0)
  triggerMouse: function() {
    $(this.canvas).mousehover(function(e) {
      this.mouseX = (event && (event.mouseX !== undefined)) ? event.mouseX : e.mouseX;
      this.mouseY = (event && (event.mouseY !== undefined)) ? event.mouseY : e.mouseY;
    });
  },
  
  // Gets the X coordinate of the mouse. (v1.3.0)
  getMouseX: function() {
    this.triggerMouse();
    return this.mouseX;
  },
  
  // Gets the Y coordinate of the mouse. (v1.3.0)
  getMouseY: function() {
    this.triggerMouse();
    return this.mouseY;
  },
  
  // Initialises the mouseDown event. (v1.3.0)
  mouseDownInit: function() {
    this.mouseDown = false;
    $(this.canvas).mousedown(function(e) {
      this.mouseDown = true;
    }).mouseup(function(e) {
      this.mouseDown = false;
    });
  },
  
  // Checks if the mouse is down or not. (v1.3.0)
  getMouseDown: function() {
    return this.mouseDown;
  },
  
  // Gets the number of days since 2000. (v1.3.0)
  daysSince2000: function() {
    return Math.floor(((new Date()).getTime() - 946684800) / 86400);
  },
  
  // Gets the current element of the time specified by a value. (v1.3.0)
  current: function(x) {
    var map = ["getFullYear", "getMonth", "getDate", "getDay", "getHours", "getMinutes", "getSeconds"];
    return (new Date())[map[x]]();
  },
  
  // The keyboard keys table. (v1.3.0)
  keys: [],
  
  // Initialises the key engine. (v1.3.0)
  keyPressedInit: function(k) {
    $(this.canvas).keyDown(function(e) {
      keys[e.keyCode] = true;
    });
    $(this.canvas).keyUp(function(e) {
      keys[e.keyCode] = false;
    });
  },
  
  // Checks if a key is pressed. (v1.3.0)
  keyPressed: function(k) {
    return !!this.keys[k];
  },
  
  // The stage's volume. (v1.3.0)
  volume: 100,
  
  // Applies the specified selector in the specified sprite. (v1.3.0)
  selectVar: function(k, s) {
    if (s == "Stage") {
      if (this.variables.hasOwnProperty(k)) {
        return this.variables[k];
      } else
      // Handle volume access ("volume")
      if (k == "volume") {
        return this.volume;
      }
    } else
    // Handle LuisSnap property or method accessing (example, s = "__luissnap__" and k = "addSprite")
    if (s == "__luissnap__") {
      return this[k];
    } else
    // Handle colon-starting strings (variables, for example ":a local variable")
    if (k.indexOf(":") == 0) {
      return this.getVar(k.substring((k.indexOf(" ") == 1) ? 2 : 1, k.length), s);
    } else
    // Handle X position, Y position or volume access
    if (k == "x" || k == "y" || k == "volume") {
      return this.sprites[s][k];
    } else
    // Handle direction access ("direction")
    if (k == "direction") {
      return this.sprites[s].d;
    } else
    {
      // It's a local variable.
      return this.getVar(k, s);
    }
  }
}.checkForJQuery();

// Expose properties of LuisSnap.

Object.defineProperty(window, "currentSprite", {
  get: function() {
    return window.luisSnap.currentSprite;
  },
  set: function(val) {
    window.luisSnap.currentSprite = val;
  }
});
__defineGetter__("isSprite", function() {
  return window.luisSnap.isSprite;
});
__defineGetter__("error", function() {
  return window.luisSnap.error;
});
Object.defineProperty(window, "instructions", {
  get: function() {
    return window.luisSnap.instructions;
  },
  set: function(val) {
    return (window.luisSnap.instructions = val);
  }
});
// Initialise the ready callback.
$(document).ready(function() {
  window.luisSnap.searchCanvas();
});

// We're done!
// LuisSnap is totally initialised.
// What we need to do is just add a easy to use extender.

window.luisSnap.extend = function(data) {
  return stdUtils.Extend(true, window.luisSnap, data);
};

// Now, LuisSnap is a extensible library that executes projects
// at impressive speeds.

window.luisSnap.init();

// Unfortunately, I've done 10000000000000000000000+ syntax errors
// (just overdosing a lot) and I will publish version v1.3.0-beta.1
// as the previous one and then create a new one called v1.3.0.
