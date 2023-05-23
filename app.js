const todo = {
  "Make a nice todo list" : "Done",
  "Make the page remember how many times it's been reloaded" : "Done",
  "Setup canvas" : "Done",
  "Make canvas stretch to fill screen" : "Done",
  "Setup game loop" : "Done",
  "Create renderstack" : "Done",
  "Add rendering of renderstack" : "Done",
  "Add different renderstack modes for the menu system" : "Done",
  "Add keyboard inputs" : "Done",
  "Add mouse button inputs" : "Done",
  "Add mouse posision inputs" : "Done",
  "Add gamepad button inputs" : "Planned",
  "Add gamepad joystick inputs" : "Planned",
  "Add mousewheel inputs" : "Planned",
  "Start a modular menu system" : "Done",
  "Make the corners cut" : "Done",
  "Make the renderStack support text" : "Done",
  "Add support for scaling renderStack text" : "Planned",
  "Make a function to squeeze text in a box" : "Done",
  "Switch the funnction to a bianary search method" : "Done",
  "Add titles to the menues" : "Done",
  "Add buttons to the menu" : "Done",
  "Add text to the buttons" : "Done",
  "Add padding to the buttons" : "Done",
  "Fix the buttons so they are even" : "Done",
  "Add onRender functions to menus" : "Done",
  "Add onRender functions to buttons" : "Done",
  "Detect when the mouse is over an button in the menu" : "Done",
  "Make the buttons clickable" : "In Progress",
  "Add on open / on closed functions for the menu" : "In Progress",
  "Make menus draggable" : "Planned",
  "Add Matter" : "Planned",
  "Create a shape library" : "Planned",
  "Add support for convex shapes" : "Planned",
  "Add support for creation of composites" : "Planned",
  "Add composites parts with blocks" : "Planned",
  "Add rendering for matter blocks" : "Planned",
  "Add composites parts with constraints" : "Planned",
  "Add settings for collision filtering" : "Planned",
  "Add collision tags to composite main / branches" : "Planned",
  "Add collision detection" : "Planned",
  "Add onUpdate functions for blocks / constraints" : "Planned",
  "Add onCollision functions for blocks / composites" : "Planned",
  "Add onRender function for coverart" : "Planned",
  "Add an option to render matter blocks wireframes" : "Planned",
  "Add an option to render matter blocks collsions" : "Planned",
  "Add an option to render matter constraints" : "Planned",
  "Add an option to render matter blocks coverart" : "Planned",
  "Add a viewport" : "Done",
  "Add an option to make the vieport follow a composite" : "Planned",
  "Make the viewport fill the screen" : "Done",
  "Add mulltiple viewport transistion effects" : "Planned",
  "Make the matter engine take deltaTime" : "Planned",
  "Add an object for controll mapping" : "Planned",
  "Add a function to detect if any inputs are being triggered" : "Planned",
  "Add textures for constraints" : "Planned",
  "Add levels with multiple composites" : "Planned",
  "Add onEnter and onExit functions for levels" : "Planned",
  "Add saving / loading a level" : "Planned",
  "Add the player conposite" : "Planned",
  "Make the player jump" : "Planned",
  "Make the player move left / right" : "Planned",
  "Add a menu" : "Planned",
  "Add saving / loading levels to the menu" : "Planned",
  "Add starting new levels to the menu" : "Planned",
  "Add settings for the different viewport transistions to the menu" : "Planned",
  "Add a shape creator / editor" : "Planned",
  "Add a block creator / editor" : "Planned",
  "Add a composite creator / editor" : "Planned",
  "Add a level creator / editor" : "Planned",
  "Connect a server" : "Planned",
  "Make it possible the upload / download levels / composites / blocks / shapes from the server" : "Planned",
  "Add accounts" : "Planned",
  "Store accounts on the server" : "Planned",
  "Add sounds" : "Planned",
}

//Nice feedback of the todo list
function feedback() {
  let tasks = {}
  let ratio = {}
  let length = 0
  for (let task in todo) {
    const state = todo[task]
    if (!tasks[state]) { tasks[state] = [] ; ratio[state] = 0 }
    tasks[state].push(task)
    ratio[state]++
    length++
  }
  let message = "Tasks: ("+length+")\n"
  for (let state in tasks) {
    message+=("\n"+Math.round(ratio[state]/length*100)+"% ")
    message+=(state+": ")
    message+=("("+ratio[state]+")\n")
    for (let taskIndex in tasks[state]) {
      message+=(" * "+tasks[state][taskIndex]+"\n")
    }
  }
  let sessionVisitIndex = sessionStorage.getItem("sessionVisitIndex_try3") || 0
  let totalVistIndex = localStorage.getItem("totalVistIndex_try3") || 0
  sessionVisitIndex++
  totalVistIndex++
  sessionStorage.setItem("sessionVisitIndex_try3",sessionVisitIndex)
  localStorage.setItem("totalVistIndex_try3",totalVistIndex)
  message+=("\n\nYou have reloaded this page " + totalVistIndex + " times")
  message+=(" (" + sessionVisitIndex + " times this session)")
  console.debug(message)
}
feedback()

//Setup global vars
let renderStack = []
const backgroundTransparency = 1
let playerInputs = {
  buttons: {
  },
  mousePosistion: {
    x: 0,
    y: 0
  }
}

//Setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let vieport = {
  x: 0,
  y: 500,
  size: 500
}

//Make the canvas always fill the screen
function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.onresize = resize
resize()

//putting all the event listiners here so they don't take up so much space
function getPlayerInputs() {

  //add keys if allowed
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase()
    const allowedKeys = ['delete', 'escape', 'backspace', '0', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'l', 'k', 'j', 'h', 'g', 'f', 'd', 's', 'a', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'shift', ' ', 'enter', 'arrowright', 'arrowleft', 'arrowup', 'arrowdown']
    if (allowedKeys.includes(key) && (!playerInputs.buttons[key])) {
      playerInputs.buttons[key] = Math.round(event.timeStamp)
    }
  })

  //remove keys
  window.addEventListener("keyup", (event) => {
    delete playerInputs.buttons[event.key.toLowerCase()]
  })

  //prevent users from rightclicking open the menu
  window.addEventListener('contextmenu', function(event) {
    event.preventDefault()
  })

  //add mouse buttons
  window.addEventListener("mousedown", (event) => {
    const buttonNames = {0:"mouseLeft",1:"mouseMiddle",2:"mouseRight"}
    const button = buttonNames[event.button]
    if (!playerInputs.buttons[button]) {
      playerInputs.buttons[button] = Math.round(event.timeStamp)
    }
  })

  //remove mouse buttons
  window.addEventListener("mouseup", (event) => {
    const buttonNames = {0:"mouseLeft",1:"mouseMiddle",2:"mouseRight"}
    const button = buttonNames[event.button]
    delete playerInputs.buttons[button]
  })

  //track the mouse posistion
  window.addEventListener("mousemove", (event) => {
    playerInputs.mousePosistion.x = event.x
    playerInputs.mousePosistion.y = event.y
  })
}
getPlayerInputs()

let menu = {
  cutCorners: true,
  stage: 10,
  size: {
      x: 500,
      y: 500
  },
  location: {
      x: 100,
      y: 100
  },
  draggable: false,
  backgroundColor: [0,0,0,.75],
  border: {
      width: .015,
      color: [50,50,50,.75]
  },
  title: {
      text: "I'm a title!",
      color: [100,100,100],
      size: .25,
      font: "Arial"
  },
  padding: .05,
  buttons: [
      {
          border: {
              width: .1,
              color: [255,0,0,.2]
          },
          color: [0,0,255],
          title: {
              text: "I'm a title!",
              color: [0,0,0]
          },
          functions: {
              onHover: function(self) {},
              onClick: function(self) {}
          }
      },
  ],
  functions: {
      onRender: function(self) {
        if ((Date.now()%50000/1000)%1<.1) {
          self.buttons = []
          const count = Math.floor(Date.now()%50000/1000)+1
          //const count = 9
          for (let index = 0; index < count; index++) {
            self.buttons[index] = {
              border: {
                  width: .015,
                  color: [0,200,0]
              },
              color: [255 - index * (255 / count), 0, index * (255 / count)],
              title: {
                  text: "I am box #"+(index+1),
                  color: [0,0,0],
                  font: "Arial"
              },
              functions: {
                  onRender: function(self, menu) {
                    if (self.targeted) {
                      self.color = [255 - index * (255 / count), 0, index * (255 / count), .5]
                    } else {
                      self.color = [255 - index * (255 / count), 0, index * (255 / count)]
                    }
                  },
                  onClick: function(self, menu) {}
              }
            }
          }
        }
      },
      onOpen: function(self) {},
      onClose: function(self) {},
      onResize: function(self) {}
  }
}

//Do the rendering
function render(inputOptions) {

  //only set baseline once
  ctx.textBaseline = "top"
  ctx.textAlign = "left"

  //Set options
  let options = {
      ...inputOptions
  }  

  //clear the screen
  function clear() {
    //clear the screen and set the background
    ctx.fillStyle = `rgb(30,30,30,${backgroundTransparency})`
    ctx.fillRect(0,0,canvas.width,canvas.height)
  }

  //turn the menu into render stack entries
  function stackMenus() {
    let currentMenu = menu

    if (currentMenu.functions && currentMenu.functions.onRender) {
      currentMenu.functions.onRender(currentMenu)
    }

    let count = currentMenu.buttons.length
    let size = currentMenu.size
    let width = size.x
    let height = size.y
    let location = currentMenu.location
    let x = location.x
    let y = location.y
    let stage = currentMenu.stage
    let padding = currentMenu.padding
    let path

    //draws the text in a box as large as possible
    function fitText(text, x, y, width, height, stage, color, font) {
      let upperBound = Math.max(canvas.width,canvas.height)
      let lowerBound = 0
      let size = 1000

      //measures the text at measureSize to be scaled for doesItFit
      const measureSize = 250
      ctx.font = `${measureSize}px ${font}`
      const words = text.split(" ")
      let wordWidths = {}
      for (let wordIndex = 0; wordIndex < words.length + 1; wordIndex++) {
        const word = words[wordIndex] || " "
        const wordWidth = ctx.measureText(word)
        wordWidths[word] = wordWidth.width / measureSize
      }
      let lines = []
      let lengths = []
      let currentLine = ""
      let length = 0
      let index = 0
      let fitLines, fitLengths

      //checks if the text would fit at the current size
      function doesItFit() {
        lines = []
        lengths = []
        currentLine = ""
        length = 0
        index = 0
        while (true) {

          //if the lines take up too much hight
          if ((lines.length + (currentLine == "" ? 0 : 1)) * size > height) {
            return false
          }        

          //there are no more words
          else if (!words[index]) {
            lines.push(currentLine)
            lengths.push(length)
            fitLines = lines
            fitLengths = lengths
            return true
          }
          //if currentLine in empty
          else if (currentLine == "") {

            //if adding a word makes the line too long
            if (wordWidths[words[index]] * size > width) {
              return false
            } else {

            //if adding a word does not make the line too long
              currentLine = words[index]
              length = wordWidths[words[index]] * size
              index++
            }
          }

          //if currentLine has something in it
          else if (currentLine !== "") {

            //if adding a word and a space makes the line too long
            if (length + (wordWidths[words[index]] + wordWidths[" "]) * size > width) {
              lines.push(currentLine)
              lengths.push(length)
              length = 0
              currentLine = ""
            } else {

            //if adding a word and a space does not make the line too long
              currentLine += " " + words[index]
              length += (wordWidths[words[index]] + wordWidths[" "]) * size
              index++
            }
          }
        }
      }

      //finds the size
      for (let index = 0; index < 25; index++) {
        if (doesItFit()) {
          lowerBound = size
          size = (lowerBound + upperBound) / 2
        } else {
          upperBound = size
          size = (lowerBound + upperBound) / 2
        }
      }

      //adds it to the renderstack
      for (let index in fitLines) {
        renderStack.push({
          stage: stage,
          size: size,
          mode: "text",
          color: color,
          x: x + (width - fitLengths[index]) / 2,
          y: y + index * size,
          font: font,
          text: fitLines[index]
        })      
      }
    }

    fitText("Hello, I am a text box! 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22", Math.cos(Date.now()/500)*200+200, Math.sin(Date.now()/500)*200+200, 250, 250, 15, [0,200,0], "Arial")

    //takes the posisiton and size of a box and returns a path to the same box with its corner cut
    function cutCorners(x,y,width,height) {
      let path = []
      path.push({x: x,y: y + height * .1})
      path.push({x: x + width * .1,y: y})
      path.push({x: x + width * .9, y: y})
      path.push({x: x + width, y: y + height * .1})
      path.push({x: x + width, y: y + height * .9})
      path.push({x: x + width * .9, y: y + height})
      path.push({x: x + width * .1, y:y + height})
      path.push({x: x ,y: y + height * .9})
      path.push({x: x,y: y + height * .1})
      path.push({x: x + width * .1,y: y})
      return path
    }

    //add the background of the menu
    path = []
    path.push({x: x, y: y})
    path.push({x: x + width, y: y})
    path.push({x: x + width, y: y + height})
    path.push({x: x, y: y + height})
    path.push({x: x, y: y})
    path.push({x: x + width, y: y})
    renderStack.push({
      mode: "fill",
      path: path,
      color: currentMenu.backgroundColor,
      stage: stage,
      translated: true
    })

    //if the menu has a border add it
    if (currentMenu.border) {
      renderStack.push({
        mode: "line",
        path: path,
        color: currentMenu.border.color,
        stage: currentMenu.stage,
        translated: true,
        lineWidth: currentMenu.border.width * Math.min(size.x, size.y)
      })
    }

    //if the menu has a title, display it and make height and y take title space into acount
    if (currentMenu.title) {
      let title = currentMenu.title
      fitText(
        title.text,
        x,
        y,
        width,
        height * title.size,
        stage,
        title.color,
        title.font
        )
        y += height * title.size
        height *= (1 - title.size)
    }

    for (let index in currentMenu.buttons) {
      let button = currentMenu.buttons[index]
      if (button.functions && button.functions.onRender) {
        button.functions.onRender(button,currentMenu)
      }
    }

    //calculate how big the boxes can be, as well as how to arrange them
    if (currentMenu.buttons.length > 0) {
      const sizes = []
      for (let i = 1; i <= count; i++) {
          let cols = i
          let rowz = Math.ceil(count / i)
          sizes.push({cols, rowz, size:Math.min(width / cols, height / rowz)})
          rowz = i
          cols = Math.ceil(count / i)
          sizes.push({cols, rowz, size:Math.min(width / cols, height / rowz)})
      }
      sizes.sort(({size: a},{size: b})=> b - a)
      let columns = sizes[0].cols
      let rows = sizes[0].rowz
      let baseBoxSize = sizes[0].size
      let boxSize = baseBoxSize * (1 - (padding * 2))

      //run for each button
      for (let index = 0; index < currentMenu.buttons.length; index++) {
        let button = currentMenu.buttons[index]

        //calculate posistion
        let boxX = x + (index % columns) * (baseBoxSize + (width - columns * baseBoxSize) / columns) + (width - columns * baseBoxSize) / columns / 2
        let boxY = y + Math.floor(index / columns) * (baseBoxSize + (height - rows * baseBoxSize) / rows) + (height - rows * baseBoxSize) / rows / 2
        
        //offset for padding
        boxX += currentMenu.padding * baseBoxSize
        boxY += currentMenu.padding * baseBoxSize

        //store all these calculations in the button for click detection
        if (!button.posistion) { button.posistion = {} }
        button.posistion.x = boxX
        button.posistion.y = boxY
        button.size = boxSize

        //create the path, with or without corners cut
        if (currentMenu.cutCorners) {
          path = cutCorners(boxX,boxY,boxSize,boxSize)
        } else {
          path = []
          path.push({x: boxX, y: boxY})
          path.push({x: boxX, y: boxY + boxSize})
          path.push({x: boxX + boxSize, y: boxY + boxSize})
          path.push({x: boxX + boxSize, y: boxY})

          path.push({x: boxX, y: boxY})
          path.push({x: boxX, y: boxY + boxSize})
        }

        //render the button background
        renderStack.push({
          mode: "fill",
          path: path,
          color: button.color,
          stage: stage,
          translated: true
        })

        //if the button has a border add it to the renderstack
        if (button.border) {
          renderStack.push({
            mode: "line",
            path: path,
            color: button.border.color,
            stage: stage,
            translated: true,
            lineWidth: (boxSize * button.border.width)
          })  
        }

        //display the title if there is one, taking into acount cut corners
        if (button.title) {
          let title = button.title
          fitText(
            title.text,
            boxX + (currentMenu.cutCorners ? boxSize * .1 : 0),
            boxY + (currentMenu.cutCorners ? boxSize * .1 : 0),
            boxSize - (currentMenu.cutCorners ? boxSize * .2 : 0),
            boxSize - (currentMenu.cutCorners ? boxSize * .2 : 0),
            stage,
            title.color,
            title.font
            )
        }
      }
    }
  }
  

  //render the render stack
  function renderRenderStack() {

    //sort the stack by stage
    renderStack.sort(function(a,b){return a.stage-b.stage})
    
    //the scale to use to make stuff thats supposed to fill the screen does it right
    const scale = Math.min(canvas.width,canvas.height)

    //go block by block in the render stack
    for (let index in renderStack) {
      const block = renderStack[index]

      //ignore if on text mode
      if (block.mode !== "text") {
        //start the path
        ctx.beginPath()

        //if the line needs scaling do it here
        if ((!block.translated) && block.mode == "line") {
          block.lineWidth *= block.size
          block.lineWidth /= vieport.size
          block.lineWidth *= scale
        }

        //then point by point
        for (let pointIndex in block.path) {
          let point = block.path[pointIndex]

          //translate the point if needed
          if (!block.translated) {
            point.x *= block.size
            point.y *= block.size

            point.x += block.x
            point.y += block.y

            point.x -= vieport.x
            point.y -= vieport.y

            point.x /= vieport.size
            point.y /= vieport.size

            point.x *= scale
            point.y *= scale

          }

          //if the point jumps do a moveTo instead of lineTo (mainly for lines that don't always connect)
          if (point.jump) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        }
      }

      //set the color to a var so I don't call it 4 times
      let color = `rgb(${block.color[0]},${block.color[1]},${block.color[2]},${block.color[3] || 1})`

      //fill, stroke, or text as needed
      if (block.mode == "fill") {
        ctx.fillStyle = color
        ctx.fill()
      } else if (block.mode == "line") {
        ctx.strokeStyle = color
        ctx.lineWidth = block.lineWidth
        ctx.stroke()
      } else if (block.mode == "text") {
        ctx.fillStyle = color
        ctx.font = `${block.size}px ${block.font}`
        ctx.fillText(block.text,block.x,block.y)
      } 
    }
  }

  clear()
  stackMenus()
  renderRenderStack()
}

function menuFunctions() {
  let currentMenu = menu
  let mouse = playerInputs.mousePosistion
  for (let index in currentMenu.buttons) {
    let button = currentMenu.buttons[index]
    let x = button.posistion.x
    let y = button.posistion.y
    let size = button.size
    if (mouse.x >= x && mouse.x <= x + size && mouse.y >= y && mouse.y <= y + size) {
      button.targeted = true
    } else { button.targeted = false }
  }
}

function temp() {

  renderStack = []
  renderStack.push({
    stage : 5.2,
    translated : true,
    path : [{x:0,y:0},{x:0,y:250},{x:250,y:250},{x:250,y:0}],
    mode : "fill",
    color : [255,100,0,.5],
  })
  renderStack.push({
    stage : 3.2,
    translated : false,
    size : 100,
    path : [{x:0,y:0},{x:0,y:1},{x:1,y:1,jump:true},{x:1,y:0}],
    mode : "line",
    color : [255,100,255,.5],
    lineWidth : .25,
    x : 500,
    y : 500
  })
  renderStack.push({
    stage : -.3,
    translated : false,
    size : 500,
    path : [{x:0.4,y:0},{x:0.6,y:0},{x:0.8,y:0.1},{x:0.9,y:0.2},{x:1,y:0.4},{x:1,y:0.6},{x:0.9,y:0.8},{x:0.8,y:0.9},{x:0.6,y:1},{x:0.4,y:1},{x:0.2,y:0.9},{x:0.1,y:0.8},{x:0,y:0.6},{x:0,y:0.4},{x:0.1,y:0.2},{x:0.2,y:0.1}],
    mode : "fill",
    color : [0,100,0,.5],
    x : 0,
    y : 500
  })
  renderStack.push({
    stage: 11,
    size: 50,
    mode: "text",
    color: [0,255,255],
    x: 100,
    y: 700,
    font: "Arial",
    text: "Hello. World!"
  })

  vieport.x = Math.abs(Math.sin(Date.now()/2000)*500)
}

//The main loop
let [lastTime, updateindex] = [0, 0]
function update(inputTime) {
  const deltaTime = inputTime - lastTime
  lastTime = inputTime
  
  temp()
  render()
  menuFunctions()

  //start the next loop
  updateindex++
  requestAnimationFrame(update)
}
requestAnimationFrame(update)