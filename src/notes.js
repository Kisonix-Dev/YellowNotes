/* ==============================
1. DOM Elements
2. App State
3. Initialize the app
4. Note checkbox
5. Function for view-only mode
6. Color selection
7. Modal window with delay for animation
8. Edit button to modal
9. Color selection event
10. Search functionality event
11. Close modal when clicking outside event 
12. Reset color selection to primary color
13. Initialize color picker with default selection
============================== */

document.addEventListener('DOMContentLoaded', function () {
	// ============= DOM Elements ============= //
	const notesContainer = document.getElementById('notes-container')
	const addNoteBtn = document.getElementById('add-note-btn')
	const noteModal = document.getElementById('note-modal')
	const saveNoteBtn = document.getElementById('save-note-btn')
	const deleteNoteBtn = document.getElementById('delete-note-btn')
	const noteTitleInput = document.getElementById('note-title')
	const noteContentInput = document.getElementById('note-content')
	const colorOptions = document.querySelectorAll('.color-option')
	const searchInput = document.querySelector('.search-bar input')
	const deleteSelectedBtn = document.createElement('button')
	deleteSelectedBtn.className = 'delete-selected-btn'
	deleteSelectedBtn.innerHTML =
		'<span class="material-icons">delete</span> Удалить выбранные'
	deleteSelectedBtn.style.display = 'none'
	document.querySelector('.search-bar').after(deleteSelectedBtn)

	// ============= App State ============= //
	let notes = []
	let currentNoteId = null
	let selectedColor = '#4285F4'
	let selectedNotes = new Set()

	// ============= Initialize the app ============= //
	init()

	function init() {
		loadNotes()
		renderNotes()
		setupEventListeners()
	}

	function loadNotes() {
		const savedNotes = localStorage.getItem('notes')
		if (savedNotes) {
			notes = JSON.parse(savedNotes)
		}
	}

	function saveNotes() {
		localStorage.setItem('notes', JSON.stringify(notes))
	}

	function renderNotes(notesToRender = notes) {
		notesContainer.innerHTML = ''

		if (notesToRender.length === 0) {
			notesContainer.innerHTML = `
							<div class="empty-state">
									<span class="material-icons">note_add</span>
									<p>Заметки не найдены</p>
							</div>
					`
			deleteSelectedBtn.style.display = 'none'
			return
		}

		notesToRender.forEach(note => {
			const noteElement = document.createElement('div')
			noteElement.className = 'note-card'
			noteElement.style.borderTop = `4px solid ${note.color}`
			noteElement.dataset.id = note.id

			const date = new Date(note.createdAt)
			const formattedDate = date.toLocaleDateString('ru-RU', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})

			// ============= Note checkbox ============= //
			const checkbox = document.createElement('div')
			checkbox.className = 'note-checkbox'
			if (selectedNotes.has(note.id)) {
				checkbox.innerHTML = '<span class="material-icons">check_circle</span>'
				checkbox.style.backgroundColor = '#FFD700'
			} else {
				checkbox.innerHTML =
					'<span class="material-icons">radio_button_unchecked</span>'
				checkbox.style.backgroundColor = 'transparent'
			}

			checkbox.addEventListener('click', e => {
				e.stopPropagation()
				toggleNoteSelection(note.id)
			})

			noteElement.innerHTML = `
							<div class="note-header">
									<h3 class="note-title">${note.title}</h3>
							</div>
							<p class="note-content">${note.content}</p>
							<p class="note-date">${formattedDate}</p>
					`
			noteElement.prepend(checkbox)
			notesContainer.appendChild(noteElement)

			noteElement.addEventListener('click', e => {
				if (e.target !== checkbox && !checkbox.contains(e.target)) {
					openViewModal(note.id)
				}
			})
		})

		updateDeleteSelectedBtn()
	}

	function toggleNoteSelection(noteId) {
		if (selectedNotes.has(noteId)) {
			selectedNotes.delete(noteId)
		} else {
			selectedNotes.add(noteId)
		}
		renderNotes()
	}

	function updateDeleteSelectedBtn() {
		if (selectedNotes.size > 0) {
			deleteSelectedBtn.style.display = 'flex'
		} else {
			deleteSelectedBtn.style.display = 'none'
		}
	}

	function deleteSelectedNotes() {
		if (selectedNotes.size === 0) return

		if (confirm(`Удалить выбранные заметки (${selectedNotes.size})?`)) {
			notes = notes.filter(note => !selectedNotes.has(note.id))
			selectedNotes.clear()
			saveNotes()
			renderNotes()
			if (notes.length === 0) {
				deleteSelectedBtn.style.display = 'none'
			}
		}
	}

	// ============= Function for view-only mode ============= //
	function openViewModal(noteId) {
		const note = notes.find(n => n.id === noteId)
		if (!note) return

		currentNoteId = noteId
		noteTitleInput.value = note.title
		noteContentInput.value = note.content
		deleteNoteBtn.style.display = 'flex'

		// ============= Color selection ============= //
		colorOptions.forEach(opt => {
			opt.classList.remove('selected')
			if (opt.dataset.color === note.color) {
				opt.classList.add('selected')
				selectedColor = note.color
			}
		})

		// ============= Modal window with delay for animation ============= //
		noteModal.style.display = 'flex'
		setTimeout(() => {
			noteModal.classList.add('show')
		}, 10)

		noteTitleInput.readOnly = true
		noteContentInput.readOnly = true

		// ============= Edit button to modal ============= //
		const editBtn = document.createElement('button')
		editBtn.className = 'icon-button'
		editBtn.id = 'edit-note-btn'
		editBtn.innerHTML = '<span class="material-icons">edit</span>'
		editBtn.addEventListener('click', () => {
			noteTitleInput.readOnly = false
			noteContentInput.readOnly = false
			noteContentInput.focus()
			editBtn.remove()
		})

		const modalActions = document.querySelector('.modal-actions')
		modalActions.insertBefore(editBtn, deleteNoteBtn)

		noteModal.classList.add('show')
	}

	function setupEventListeners() {
		addNoteBtn.addEventListener('click', openNewModal)
		saveNoteBtn.addEventListener('click', saveNote)
		deleteNoteBtn.addEventListener('click', deleteNote)
		deleteSelectedBtn.addEventListener('click', deleteSelectedNotes)

		// ============= Color selection event ============= //
		colorOptions.forEach(option => {
			option.addEventListener('click', function () {
				colorOptions.forEach(opt => opt.classList.remove('selected'))
				this.classList.add('selected')
				selectedColor = this.dataset.color
			})
		})

		// ============= Search functionality event ============= //
		searchInput.addEventListener('input', function () {
			const searchTerm = this.value.toLowerCase().trim()
			if (searchTerm === '') {
				renderNotes()
				return
			}

			const filteredNotes = notes.filter(
				note =>
					note.title.toLowerCase().includes(searchTerm) ||
					note.content.toLowerCase().includes(searchTerm)
			)

			renderNotes(filteredNotes)
		})

		// ============= Close modal when clicking outside ============= //
		noteModal.addEventListener('click', function (e) {
			if (e.target === noteModal) {
				closeModal()
			}
		})
	}

	function openNewModal() {
		currentNoteId = null
		noteTitleInput.value = ''
		noteContentInput.value = ''
		deleteNoteBtn.style.display = 'none'

		// ============= Reset color selection to primary color ============= //
		colorOptions.forEach(opt => {
			opt.classList.remove('selected')
			if (opt.dataset.color === '#4285F4') {
				opt.classList.add('selected')
				selectedColor = '#4285F4'
			}
		})

		noteModal.style.display = 'flex'
		setTimeout(() => {
			noteModal.classList.add('show')
			noteTitleInput.focus()
		}, 10)
	}

	function openEditModal(noteId) {
		const note = notes.find(n => n.id === noteId)
		if (!note) return

		currentNoteId = noteId
		noteTitleInput.value = note.title
		noteContentInput.value = note.content
		deleteNoteBtn.style.display = 'flex'

		noteTitleInput.readOnly = false
		noteContentInput.readOnly = false

		colorOptions.forEach(opt => {
			opt.classList.remove('selected')
			if (opt.dataset.color === note.color) {
				opt.classList.add('selected')
				selectedColor = note.color
			}
		})

		const existingEditBtn = document.getElementById('edit-note-btn')
		if (existingEditBtn) {
			existingEditBtn.remove()
		}

		noteModal.classList.add('show')
		noteContentInput.focus()
	}

	function closeModal() {
		noteTitleInput.readOnly = false
		noteContentInput.readOnly = false
		const existingEditBtn = document.getElementById('edit-note-btn')
		if (existingEditBtn) {
			existingEditBtn.remove()
		}
		noteModal.classList.remove('show')
		setTimeout(() => {
			noteModal.style.display = 'none'
		}, 300)
	}

	function saveNote() {
		const title = noteTitleInput.value.trim()
		const content = noteContentInput.value.trim()

		if (!title) {
			return
		}

		const now = new Date()

		if (currentNoteId) {
			const noteIndex = notes.findIndex(n => n.id === currentNoteId)
			if (noteIndex !== -1) {
				notes[noteIndex] = {
					...notes[noteIndex],
					title,
					content,
					color: selectedColor,
					updatedAt: now.toISOString(),
				}
			}
		} else {
			const newNote = {
				id: Date.now().toString(),
				title,
				content,
				color: selectedColor,
				createdAt: now.toISOString(),
				updatedAt: now.toISOString(),
			}
			notes.unshift(newNote)
		}

		saveNotes()
		renderNotes()
		closeModal()
	}

	function deleteNote() {
		if (!currentNoteId) return

		if (confirm('Удалить эту заметку?')) {
			notes = notes.filter(note => note.id !== currentNoteId)
			saveNotes()
			renderNotes()
			closeModal()
		}
	}

	// ============= Initialize color picker with default selection ============= //
	colorOptions[0].classList.add('selected')
})
