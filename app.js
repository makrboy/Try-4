const todo = {
  "Make a nice todo list" : "Done",
  "Make the page remember how many times it's been reloaded" : "Done",
  "Setup canvas" : "Done",
  "Make canvas stretch to fill screen" : "Done",
  "Setup game loop" : "Done",
  "Create renderstack" : "Done",
  "Add rendering of renderstack" : "Done",
  "Add different renderstack modes for the gui" : "Done",
  "Add keyboard inputs" : "Planned",
  "Add mouse button inputs" : "Planned",
  "Add mouse wheel inputs" : "Planned",
  "Create a modular GUI" : "Planned",
  "Add buttons to the GUI" : "Planned",
  "Add on open / on closed functions for the GUI" : "Planned",
  "Make GUIs draggable" : "Planned",
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

//Do the rendering
function render(inputOptions) {

  //clear the screen and set the background
  ctx.fillStyle = `rgb(30,30,30,${backgroundTransparency})`
  ctx.fillRect(0,0,canvas.width,canvas.height)

  //Set options
  let options = {
    ...inputOptions
  }

  //sort the stack by stage
  renderStack.sort(function(a,b){a.stage-b.stage})
  
  //the scale to use to make stuff thats supposed to fill the screen does it right
  const scale = Math.min(canvas.width,canvas.height)

  //go block by block in the render stack
  for (let index in renderStack) {
    const block = renderStack[index]

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

    //set the color to a var so I don't call it 4 times
    const color = block.color

    //fill or stroke as needed
    if (block.mode == "fill") {
      ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]},${color[3] || 1})`
      ctx.fill()
    } else {
      ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]},${color[3] || 1})`
      ctx.lineWidth = block.lineWidth
      ctx.stroke()
    }
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