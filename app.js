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
  "Make a function to squeez text in a box" : "In Progress",
  "Add titles to the menues" : "Planned",
  "Add buttons to the menu" : "Planned",
  "Detect when the mouse is over an button in the menu" : "Planned",
  "Make the buttons clickable" : "Planned",
  "Add on open / on closed functions for the menu" : "Planned",
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
      width: .1,
      color: [50,50,50,.75]
  },
  title: {
      text: "I'm a title!",
      color: [0,0,100],
      size: .3
  },
  padding: 25,
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
      }
  ],
  functions: {
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
    let count = currentMenu.buttons.length
    let size = currentMenu.size
    let width = size.x
    let height = size.y
    let location = currentMenu.location
    let path

    function fitText(text, x, y, width, height, font) {
      let size = 1000
      const measureSize = 250
      ctx.font = `${measureSize}px ${font}`
      const words = text.split(" ")
      words.push(" ")
      let wordWidths = {}
      for (let wordIndex in words) {
        const word = words[wordIndex]
        const wordWidth = ctx.measureText(word)
        wordWidths[word] = wordWidth.width / measureSize
      }
      console.log("-----START-----")
      function calculate() {
        let lines = []
        let length = 0
        let index = 0
        let currentLine = ""

        let breakIndex = 0
        while (breakIndex < 1000) {
          breakIndex++

          //if there are no more words
          if (!words[index]) {
            console.log("Done")
            lines.push(currentLine)
            currentLine = ""
            break
          }

          //if the words fall off the bottom
          if ((index * size) > width) {
            console.log("Height overflow")
            console.log("lines:"+JSON.stringify(lines)+
            "\nlength:"+length+"\nindex:"+index+"\ncurrentLine:"+currentLine)
            size *= .9
            lines = []
            index = 0
            length = 0
            currentLine = ""
          }

          //if one word line does not fit
          if (length == 0 && wordWidths[words[index]] * size > width) {
            console.log("Single break")
            size *= .9
            lines = []
            index = 0
            length = 0
            currentLine = ""
          }

          //if one word line fits
          if (length == 0 && wordWidths[words[index]] * size <= width) {
            console.log("Single fit")
            currentLine = words[index]
            length += wordWidths[words[index]] * size
            index++
          }

          //if multi line does not fit
          if (length > 0 && (wordWidths[words[index]] + wordWidths[" "]) * size > width) {
            console.log("Multi break")
            lines.push(currentLine)
            currentLine = ""
            length = 0
          }

          //if multi line fits
          if (length > 0 && (wordWidths[words[index]] + wordWidths[" "]) * size <= width) {
            console.log("Multi fit")
            currentLine += " " + words[index]
            length += (wordWidths[words[index]] + wordWidths[" "]) * size
            index++
          }

          //todo
          //check if the words fall off the bottom
        }
        console.log(lines)
        console.log(size)
        for (let index in lines) {
          renderStack.push({
            stage: 10,
            size: size,
            mode: "text",
            color: [0,255,255],
            x: x,
            y: y + index * size,
            font: font,
            text: lines[index]
          })
                }
      }
      calculate()
    }
    fitText("Hello world, I am a text box!", 0, 0, 300, 300, "Arial")

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

    //get a nice corner cut box if cutCorners is true
    if (!currentMenu.cutCorners) {
      path = cutCorners(location.x,location.y,width,height)
    } else {
      
      //or just a rectangle
      path = []
      path.push({x: location.x, y: location.y})
      path.push({x: location.x + width, y: location.y})
      path.push({x: location.x + width, y: location.y + height})
      path.push({x: location.x, y: location.y + height})
      path.push({x: location.x, y: location.y})
      path.push({x: location.x + width, y: location.y})
    }

    //add the background of the menu
    renderStack.push({
      mode: "fill",
      path: path,
      color: currentMenu.backgroundColor,
      stage: currentMenu.stage,
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

    //TODO subtrack the title from height

    //calculate how big the boxes can be, as well as how to arrange them
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
    let colums = sizes[0].cols
    let rows = sizes[0].rowz
    let boxSize = sizes[0].size
  }
  

  //render the render stack
  function renderRenderStack() {

    //sort the stack by stage
    renderStack.sort(function(a,b){a.stage-b.stage})
    
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

  //start the next loop
  updateindex++
  requestAnimationFrame(update)
}
requestAnimationFrame(update)