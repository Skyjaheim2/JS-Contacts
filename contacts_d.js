class Contacts {
    static loadContacts(filter) {
        let contactsContainer = document.querySelector('.contacts-container')

        let allContacts = Storage.getContacts().reverse()
        let Colors = {
            0: 'darkblue',
            1: 'darkgreen',
            2: 'darkred',
            3: 'darkorange',
        }

        if (filter === null) {
            let i = 0
            for (let contact of allContacts) {
                contactsContainer.innerHTML += `
                    <div class="detailed-view-container" data-color="${Colors[i % Object.keys(Colors).length]}">
                        <div class="contactInfo" style="background-color: ${Colors[i % Object.keys(Colors).length]}">  <!-- LOOP THE COLORS -->
                            <div class="contactName">${contact['name']}</div>
                            <div class="contactNumberLabel">Number:</div>
                            <div class="contactNumber">${contact['number']}</div>
                            <div class="contactAddressLabel">Address: <span class="contactAddress">${contact['address']}</span></div>
                            <span><img class="deleteBtn" src="Img/delete.svg" title="Delete Contact"></span>
                            <span><img class="editBtn" src="Img/edit.svg" title="Edit Contact"> </span>
                        </div>
                    </div>
                `
                i++
            }
        }
        else {
            contactsContainer.innerHTML = ''
            let i = 0
            for (let contact of allContacts) {
                if (wordsMatch(contact['name'], filter)) {
                    contactsContainer.innerHTML += `
                        <div class="detailed-view-container" data-color="${Colors[i % Object.keys(Colors).length]}">
                            <div class="contactInfo" style="background-color: ${Colors[i % Object.keys(Colors).length]}">  <!-- LOOP THE COLORS -->
                                <div class="contactName">${contact['name']}</div>
                                <div class="contactNumberLabel">Number:</div>
                                <div class="contactNumber">${contact['number']}</div>
                                <div class="contactAddressLabel">Address: <span class="contactAddress">${contact['address']}</span></div>
                                <span><img class="deleteBtn" src="Img/delete.svg" title="Delete Contact"></span>
                                <span><img class="editBtn" src="Img/edit.svg" title="Edit Contact"> </span>
                            </div>
                        </div>
                    `
                    i++
                }
            }
        }
    }
}

class Storage {
    static initializeStorage() {
        if (!(localStorage.getItem('contactsInfo'))) {
            // Create empty array of first load
            localStorage.setItem('contactsInfo', '[]')
        }
    }
    static getContacts() {
        let contactsInStorage = localStorage.getItem('contactsInfo')
        return JSON.parse(contactsInStorage)
    }
    static addContact(contactInfo) {
        let contactsInStorage = this.getContacts()
        contactsInStorage.push(contactInfo)
        // Update localStorage
        localStorage.setItem('contactsInfo', JSON.stringify(contactsInStorage))
    }
    static deleteContact(contactNumber) {

        let contactsInStorage = this.getContacts()
        contactsInStorage.forEach((contact, index) => {
            // Remove contact where the number matches
            if (contact['number'] === contactNumber) {
                contactsInStorage.splice(index, 1)
            }
        })
        localStorage.setItem('contactsInfo', JSON.stringify(contactsInStorage))

    }
    static editContact(contactNumber, newContactInfo) {
        let allContacts = this.getContacts()

        allContacts.forEach(contact => {
            if (contact.number === contactNumber) {
                contact.name = newContactInfo.name
                contact.number = newContactInfo.number
                contact.address = newContactInfo.address
            }
        })
        // Update localStorage
        localStorage.setItem('contactsInfo', JSON.stringify(allContacts))
    }

}

class UI {
    static addContact(contactName, contactNumber, contactAddress) {
        let firstContact = document.querySelector('.contacts-container').firstElementChild
        let contactsContainer = document.querySelector('.contacts-container')

        let divBgColor
        if (firstContact !== null) {
            // Choose color of new contact based on the color of the contact on top
            switch (firstContact.dataset.color) {
                case 'darkblue':
                    divBgColor = 'darkorange'
                    break
                case 'darkorange':
                    divBgColor = 'darkred'
                    break
                case 'darkred':
                    divBgColor = 'darkgreen'
                    break
                case 'darkgreen':
                    divBgColor = 'darkblue'
            }
        }
        else {
            // The default color of the first contact that is added
            divBgColor = 'darkblue'
        }
        // Create  DOM Element
        let div = document.createElement('div')
        div.className = 'detailed-view-container'
        div.dataset.color = divBgColor

        div.innerHTML = `
            <div class="contactInfo" style="background-color: ${divBgColor}">
                <div class="contactName">${contactName}</div>
                <div class="contactNumberLabel">Number:</div>
                <div class="contactNumber">${contactNumber}</div>
                <div class="contactAddressLabel">Address:<span class="contactAddress">${contactAddress}</span></div>
                <span><img class="deleteBtn" src="Img/delete.svg"></span>
            </div>
        `
        // Add Animation
        div.style.animationName = 'contactAdded'
        div.style.animationDuration = '1s'
        div.style.animationFillMode = 'forwards'
        // Add Element To Div
        if (firstContact !== null) {
            // Puts new contact on the top
            contactsContainer.insertBefore(div, firstContact)
        }
        else {
            document.querySelector('.contacts-container').appendChild(div)
        }
    }
    static showContactAddedText() {
        let contactAddedText = document.querySelector('#contactAddedText')
        contactAddedText.style.display = 'block'
    }
    static show_or_HideEditBtn(contactNumber, show=true) {
        let allEditBtn = document.querySelectorAll('.editBtn')
        let allContacts = Storage.getContacts()
        let contactIndex
        let filter

        filter = allContacts.length !== allEditBtn.length;

        if (filter) {
            allContacts = this.getContactsThatHaveBeenFiltered()
        }

        // Get the contact index of the contact that was clicked on
        allContacts.forEach((contact, index) => {
            if (contact.number === contactNumber) {
                contactIndex = Math.abs(index - (allContacts.length - 1))
            }
        })
        // Show the edit btn of the contact that was clicked on
        allEditBtn.forEach((btn, index) => {
            if (index === contactIndex) {
                if (show)
                    btn.style.display = 'block'
                else
                    btn.style.display = 'none'
            }
        })
    }
    static getContactsThatHaveBeenFiltered() {

        let filteredContactsToReturn = []

        let allFilteredContacts = document.querySelectorAll('.contactInfo')

        allFilteredContacts.forEach(contact => {
            let allChildrenElements = contact.children
            let contactName = allChildrenElements[0].textContent
            let contactNumber = allChildrenElements[2].textContent

            filteredContactsToReturn.push({'name': contactName, 'number': contactNumber})
        })



        return filteredContactsToReturn.reverse()
    }
    static contactIsBeingEdited() {
        let allContactsInDOM = document.querySelectorAll('.contactInfo')

        let contactBeingEdited = false
        allContactsInDOM.forEach(contact => {
            if (contact.innerHTML.includes('edit-contact'))
                contactBeingEdited = true
        })
        return contactBeingEdited
    }
    static enterKeyEventFunctionForContactEdit(e, contactName, contactNumber, prevContactNumber, addressDiv, contactAddressLabel) {

        if (e.keyCode === 13) {
            let newContactName = document.querySelector('.edit-contact-name-input').value
            let newContactNumber = document.querySelector('.edit-contact-number-input').value
            let newContactAddress = document.querySelector('.edit-contact-address-input').value


            // Contact name style
            contactName.innerHTML = newContactName
            contactName.style.marginBottom = '0'
            // Contact number style
            contactNumber.innerHTML = newContactNumber
            contactNumber.style.marginBottom = '0'
            // Contact address style
            addressDiv.remove()
            contactAddressLabel.innerHTML = `Address: <span class="contactAddress">${newContactAddress}</span>`
            contactAddressLabel.style.position = 'relative'

            // Update contact in storage
            let newContactInfo = {
                'name': newContactName,
                'number': newContactNumber,
                'address': newContactAddress
            }
            Storage.editContact(prevContactNumber, newContactInfo)
        }

    }
    static removeContactAddedText() {
        let contactAddedText = document.querySelector('#contactAddedText')
        contactAddedText.style.display = 'none'
    }
    static clearFields() {
        let contactNameField = document.querySelector('#newContactNameField')
        let contactAddressField = document.querySelector('#newContactAddressField')
        let contactNumberField = document.querySelector('#newContactNumberField')

        contactNameField.value = ''
        contactNumberField.value = ''
        contactAddressField.value = ''

    }
}

class Animations {
    static animateAddContactContainer() {
        let addContactContainer = document.querySelector('.add-contact-container')
        addContactContainer.style.display = 'block'
        addContactContainer.style.animationName = 'showAddContactsContainer'
        addContactContainer.style.animationDuration = '1s'
        addContactContainer.style.animationFillMode = 'forwards'

        addContactContainer.addEventListener('animationend', () => {
            addContactContainer.style.display = 'block'
        })
    }
    static animateRemoveAddContainer() {
        let addContactContainer = document.querySelector('.add-contact-container')
        addContactContainer.style.animationName = 'hideAddContactContainer'
        addContactContainer.style.animationDuration = '1s'
        addContactContainer.style.animationFillMode = 'forwards'
        addContactContainer.addEventListener('animationend', () => {
            addContactContainer.style.display = 'none'
        })
    }
    static animateMoveContactsDown() {
        let contactsContainer = document.querySelector('.contacts-container')
        contactsContainer.style.animationName = 'moveContactsDown'
        contactsContainer.style.animationDuration = '1s'
        contactsContainer.style.animationFillMode = 'forwards'
    }
    static animateMoveContactsUp() {
        let contactsContainer = document.querySelector('.contacts-container')
        contactsContainer.style.animationName = 'moveContactsUp'
        contactsContainer.style.animationDuration = '1s'
        contactsContainer.style.animationFillMode = 'forwards'
    }
    static animateExpandContactsInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel) {
        // Animate Contact Name
        contactName.style.animationName = 'moveContactNameToMiddle'
        contactName.style.animationDuration = '0.5s'
        contactName.style.animationFillMode = 'forwards'
        // Animate Contact Number
        contactNumber.style.animationName = 'moveContactNumberToRight'
        contactNumber.style.animationDuration = '0.5s'
        contactNumber.style.animationFillMode = 'forwards'
        // Animate Contact Number Label
        contactNumberLabel.style.animationName = 'makeLabelOpaque'
        contactNumberLabel.style.animationDuration = '1s'
        contactNumberLabel.style.animationFillMode = 'forwards'
        // Animate Contact Address Label
        contactAddressLabel.style.animationName = 'makeLabelOpaque'
        contactAddressLabel.style.animationDuration = '0.5s'
        contactAddressLabel.style.animationFillMode = 'forwards'
    }

    static animateMinimizeContactInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel) {
        // Animate Contact Name
        contactName.style.animationName = 'moveContactNameToStart'
        contactName.style.animationDuration = '0.5s'
        contactName.style.animationFillMode = 'forwards'
        // Animate Contact Number
        contactNumber.style.animationName = 'moveContactNumberToStart'
        contactNumber.style.animationDuration = '0.5s'
        contactNumber.style.animationFillMode = 'forwards'
        // Animate Contact Number Label
        contactNumberLabel.style.animationName = 'makeLabelTransparent'
        contactNumberLabel.style.animationDuration = '0.5s'
        contactNumberLabel.style.animationFillMode = 'forwards'
        // Animate Contact Address Label
        contactAddressLabel.style.animationName = 'makeLabelTransparent'
        contactAddressLabel.style.animationDuration = '1s'
        contactAddressLabel.style.animationFillMode = 'forwards'
    }
    static animateDeleteContact(contactToDelete) {
        contactToDelete.style.animationName = 'contactDeleted'
        contactToDelete.style.animationDuration = '1s'
        contactToDelete.style.animationFillMode = 'forwards'
    }

}

// DOM LOADED
document.addEventListener('DOMContentLoaded', () => {
    Storage.initializeStorage()
    Contacts.loadContacts(null)
})

// ONKEY-UP EVENTS

/* SEARCH NAME INPUT */
document.querySelector('#searchNameInput').addEventListener('keyup', function() {
    Contacts.loadContacts(this.value)
})
/* ADD NEW CONTACT FORM */
document.querySelector('#addNewContactForm').addEventListener('keyup', function() {
    let contactNameField = document.querySelector('#newContactNameField')
    let contactAddressField = document.querySelector('#newContactAddressField')
    let contactNumberField = document.querySelector('#newContactNumberField')
    let addContactBtn = document.querySelector('#addContactBtn')
    // Validate Form
    if (contactNameField.value === '' || contactAddressField.value === '' || contactNumberField.value === '') {
        addContactBtn.disabled = true
    }
    else {
        addContactBtn.disabled = false
    }
})

// ONCLICK EVENTS

/* ADD NEW CONTACT IMG BTN */
document.querySelector('#addNewContactBtn').addEventListener('click', function () {
    let addContactContainer = document.querySelector('.add-contact-container')
    if (addContactContainer.style.display === 'block') {
        Animations.animateRemoveAddContainer()
        Animations.animateMoveContactsUp()
    }
    else {
        Animations.animateMoveContactsDown()
        Animations.animateAddContactContainer()
    }
})
/* ADD CONTACT FORM BTN */
document.querySelector('#addContactBtn').addEventListener('click', function() {
    let contactNameField = document.querySelector('#newContactNameField')
    let contactAddressField = document.querySelector('#newContactAddressField')
    let contactNumberField = document.querySelector('#newContactNumberField')
    let contactInfo = {'name': contactNameField.value, 'address': contactAddressField.value, 'number': contactNumberField.value}

    UI.showContactAddedText()
    UI.addContact(contactInfo['name'], contactInfo['number'], contactInfo['address'])
    Storage.addContact(contactInfo)

    setTimeout(() => {
        Animations.animateRemoveAddContainer()
        Animations.animateMoveContactsUp()
        UI.removeContactAddedText()
    }, 1500)

    UI.clearFields()
    // Reset Button
    this.disabled = true

})

/* EXPAND CONTACT AND MINIMIZE CONTAINER */
var expanded = false
var contactName
var contactNumber
var contactNumberLabel
var contactAddressLabel
document.querySelector('.contacts-container').addEventListener('click', (e) => {
    if (expanded) {
        /* Minimize Contact Info */
        if (e.target.className === 'contactName' || e.target.className === 'contactNumber') {
            expanded = true
            if (e.target.className === 'contactName') {
                // Use event propagation to get the contact that was clicked
                contactName = e.target
                contactNumberLabel = e.target.nextElementSibling
                contactNumber = e.target.nextElementSibling.nextElementSibling
                contactAddressLabel = e.target.nextElementSibling.nextElementSibling.nextElementSibling
            }
            else if (e.target.className === 'contactNumber') {
                // Use event propagation to get the contact that was clicked
                contactName = e.target.previousElementSibling.previousElementSibling
                contactNumberLabel = e.target.previousElementSibling
                contactNumber = e.target
                contactAddressLabel = e.target.nextElementSibling
            }
            Animations.animateMinimizeContactInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel)

            UI.show_or_HideEditBtn(contactNumber.textContent, false)
        }
        expanded = false
        return
    }
    if (!expanded) {
        /* Expand Contact Info */
        if (e.target.className === 'contactName' || e.target.className === 'contactNumber') {
            expanded = true
            if (e.target.className === 'contactName') {
                // Use event propagation to get the contact that was clicked
                contactName = e.target
                contactNumberLabel = e.target.nextElementSibling
                contactNumber = e.target.nextElementSibling.nextElementSibling
                // console.log(contactNumber)
                contactAddressLabel = e.target.nextElementSibling.nextElementSibling.nextElementSibling
            } else if (e.target.className === 'contactNumber') {
                // Use event propagation to get the contact that was clicked
                contactName = e.target.previousElementSibling.previousElementSibling
                contactNumberLabel = e.target.previousElementSibling
                contactNumber = e.target
                contactAddressLabel = e.target.nextElementSibling
            }
            Animations.animateExpandContactsInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel)
            UI.show_or_HideEditBtn(contactNumber.textContent, true)
            // console.log(contactNumber.textContent)

        }
    }
})

/* DELETE CONTACT OR EDIT CONTACT */
var contactNameToEdit
var contactNumberToEdit
var contactAddressLabelToEdit
var addressDiv
var contactNumberText
document.querySelector('.contacts-container').addEventListener('click', (e) => {


    if (e.target.className === 'editBtn' && !(UI.contactIsBeingEdited()) ) {
        let contactToEdit = e.target.parentElement.parentElement

        let detailedViewContainer = contactToEdit.parentElement

        let inputColor = detailedViewContainer.dataset.color

        contactNameToEdit = contactToEdit.firstElementChild
        let contactNameText = contactNameToEdit.textContent
        contactNumberToEdit = contactNameToEdit.nextElementSibling.nextElementSibling
        contactNumberText = contactNumberToEdit.textContent
        let contactAddress = contactNumberToEdit.nextElementSibling.firstElementChild
        let contactAddressText = contactAddress.textContent

        contactAddressLabelToEdit = contactNumberToEdit.nextElementSibling
        let deleteBtnSpan = contactAddressLabelToEdit.nextElementSibling


        // Style fields
        contactNameToEdit.style.marginBottom = '10px'
        contactNumberToEdit.style.marginBottom = '10px'


        // Create Address Input
        contactAddressLabelToEdit.innerHTML = 'Address: '
        contactAddressLabelToEdit.style.position = 'absolute'
        addressDiv = document.createElement('div')
        addressDiv.className = 'contactAddress'
        addressDiv.style.left = '12%'

        /* Add inputs */

        contactNameToEdit.innerHTML = `<input class="form-control edit-contact-name-input" value="${contactNameText}" onkeyup="UI.enterKeyEventFunctionForContactEdit(event, contactNameToEdit, contactNumberToEdit, contactNumberText, addressDiv, contactAddressLabelToEdit)" style="background-color: ${inputColor}; color: white">`
        contactNumberToEdit.innerHTML = `<input class="form-control edit-contact-number-input" value="${contactNumberText}" onkeyup="UI.enterKeyEventFunctionForContactEdit(event, contactNameToEdit, contactNumberToEdit, contactNumberText, addressDiv, contactAddressLabelToEdit)" style="background-color: ${inputColor}; color: white">`
        addressDiv.innerHTML = `<input class="form-control edit-contact-address-input" onkeyup="UI.enterKeyEventFunctionForContactEdit(event, contactNameToEdit, contactNumberToEdit, contactNumberText, addressDiv, contactAddressLabelToEdit)" value="${contactAddressText}" autocomplete="chrome-off" style="background-color: ${inputColor}; color: white">`
        contactToEdit.insertBefore(addressDiv, deleteBtnSpan)



    }
    else if (e.target.className === 'deleteBtn') {
        let contactToDelete = e.target.parentElement.parentElement.parentElement
        let contactName = contactToDelete.firstElementChild.firstElementChild.textContent
        let contactNumber = contactToDelete.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent

        Animations.animateDeleteContact(contactToDelete)

        contactToDelete.addEventListener('animationend', () => {
            contactToDelete.remove()
            Storage.deleteContact(contactNumber)
        })
    }
})

function wordsMatch(word1, word2, matchCase=false) {
    if (!matchCase) {
        word1 = word1.toLowerCase()
        word2 = word2.toLowerCase()
        let index = Math.min(...[word1.length, word2.length])

        for (let i = 0; i < index; i++) {
            if (word1[i] !== word2[i]) {
                return false
            }
        }
        return true
    }
    else {
        let index = Math.min(...[word1.length, word2.length])

        for (let i = 0; i < index; i++) {
            if (word1[i] !== word2[i]) {
                return false
            }
        }
        return true

    }
}

