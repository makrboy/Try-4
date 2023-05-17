const todo = {
  "Make a nice todo list" : "Done",
  "Make the page remember how many times it's been reloaded" : "Planned",
  "Setup canvas" : "Planned",
  "Make canvas stretch to fill screen" : "Planned",
  "Setup game loop" : "Planned",
  "Create renderstack" : "Planned",
  "Add rendering of renderstack" : "Planned",
  "Add different renderstack tags" : "Planned",
  "Create a modular GUI" : "Planned",
  "Add buttons to the GUI" : "Planned",
  "Add on open / on closed functions for the GUI" : "Planned",
  "Add keyboard inputs" : "Planned",
  "Add mouse button inputs" : "Planned",
  "Add mouse wheel inputs" : "Planned",
  "Make GUIs draggable" : "Planned",
  "Add Matter" : "Planned",
  "Create a shape library" : "Planned",
  "Add support for convex shapes" : "Planned",
  "Add support for creation of composites" : "Planned",
  "Add composites parts with blocks" : "Planned",
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
  "Add a viewport" : "Planned",
  "Add an option to make the vieport follow a composite" : "Planned",
  "Make the viewport fill the screen" : "Planned",
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

//nice feedback of the todo list
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