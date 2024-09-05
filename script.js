/**
 * [
 *    Todo: { id: string, text: string, completed: boolean, removed: boolean}
 * ]
 */
const todos = []

function addTodo(text) {
  const todo = { id: todos.length, text: text, completed: false, removed: false }
  todos.unshift(todo)
}

function updateTodo(id, updates) {
  const index = todos.findIndex((todo) => todo.id === id)
  if (updates.text) {
    todos[index].text = updates.text
  }

  if ('completed' in updates) {
    todos[index].completed = updates.completed
  }

  if ('removed' in updates) {
    todos[index].removed = updates.removed
  }
}

/**
 * filter -> { completed: <boolean>, removed: <boolean> }
 */
function filterTodos(filter) {
  return todos.filter((todo) => {
    let shouldFilter = true
    if ('completed' in filter) {
      shouldFilter = todo.completed === filter.completed
    }

    if ('removed' in filter) {
      shouldFilter = shouldFilter && todo.removed === filter.removed
    }

    return shouldFilter
  })
}

const todoHtml = (todo) => `
<li id=${todo.id} class='todo-item'>
  <input ${todo.completed ? 'checked' : ''} id='checkbox' type='checkbox' class='input-checkbox' />
  <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
  <i class='fa-solid fa-xmark close-button'></i>
</li>
`

const activeCountText = (count) => `${count} item left`

function showTodos(displayTodos) {
  const listHtml = []
  displayTodos.forEach((todo) => {
    if (todo.removed == false) {
      listHtml.push(todoHtml(todo))
    }
  })

  if (displayTodos.length > 0) {
    document.getElementById('footer').style.display = 'flex'
  }
  document.getElementById('display-area').innerHTML = listHtml.join('\n')
  document.getElementById('active-todos').innerHTML = activeCountText(
    filterTodos({ completed: false, removed: false }).length,
  )
}

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault()
  const inputText = document.getElementById('enter-text').value
  if (inputText !== '' || null) {
    document.getElementById('enter-text').value = ''
    addTodo(inputText)
    showTodos(todos)
  }
})

document.getElementById('display-area').addEventListener('click', (event) => {
  const isCheckbox = event.target.classList.contains('input-checkbox')
  const isRemoveButton = event.target.classList.contains('close-button')
  const id = Number(event.target.closest('.todo-item').id)

  if (isRemoveButton) {
    updateTodo(id, { removed: true })
  }

  if (isCheckbox) {
    updateTodo(id, { completed: event.target.checked })
  }
  showTodos(todos)
})

function resetButtonStates() {
  document.getElementById('all').classList.remove('active-button')
  document.getElementById('active').classList.remove('active-button')
  document.getElementById('completed').classList.remove('active-button')
}

document.getElementById('completed').addEventListener('click', (e) => {
  resetButtonStates()
  document.getElementById('completed').classList.add('active-button')
  const completedTodos = filterTodos({ completed: true, removed: false })
  showTodos(completedTodos)
})

document.getElementById('active').addEventListener('click', (e) => {
  resetButtonStates()
  document.getElementById('active').classList.add('active-button')
  const activeTodos = filterTodos({ completed: false, removed: false })
  showTodos(activeTodos)
})

document.getElementById('all').addEventListener('click', (e) => {
  resetButtonStates()
  document.getElementById('all').classList.add('active-button')
  showTodos(todos)
})
