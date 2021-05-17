class Contacts {
    static loadContacts(filter) {

        let contactsContainer = document.querySelector('.contacts-container')

        let allContacts = Storage.getContacts().reverse()
        let Colors = {
            0: 'darkblue',
            1: 'darkgreen',
            2: 'darkred',
            3: 'darkorange'
        }

        if (filter === null) {
            let i = 0
            for (let contact of allContacts) {
                contactsContainer.innerHTML += `
                    <div class="detailed-view-container" data-color="${Colors[i % Object.keys(Colors).length]}">
                        <div class="contactInfo" style="background-color: ${Colors[i % Object.keys(Colors).length]};"> <!-- Loop the colors -->
                            <div class="contactName">${contact['name']}</div>
                            <div class="contactNumberLabel">Number:</div>
                            <div class="contactNumber">${contact['number']}</div>
                            <div class="contactAddressLabel">Address:<span class="contactAddress"> ${contact['address']}</span></div>
                            <span><img class="deleteBtn" src="Img/delete.svg"></span>
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
                            <div class="contactInfo" style="background-color: ${Colors[i % Object.keys(Colors).length]};">
                               <div class="contactName">${contact['name']}</div>
                                <div class="contactNumberLabel">Number:</div>
                                <div class="contactNumber">${contact['number']}</div>
                                <div class="contactAddressLabel">Address:<span class="contactAddress"> ${contact['address']}</span></div>
                                <span><img class="deleteBtn" src="Img/delete.svg"></span>
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
            // Create empty array on first load
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
        localStorage.setItem('contactsInfo', JSON.stringify(contactsInStorage))
    }
    static deleteContact(contactName, contactNumber) {
        let contactsInStorage = this.getContacts()

        contactsInStorage.forEach((contact, index) => {
            // Remove contact where name and number match
            if (contact['name'] === contactName && contact['number'] === contactNumber) {
                contactsInStorage.splice(index, 1)
            }
        })
        localStorage.setItem('contactsInfo', JSON.stringify(contactsInStorage))
    }
}

class UI {
    static showAlert(alertText, type) {
        if (type === undefined || !(['primary', 'warning', 'danger', 'success'].includes(type))) {
            type = 'primary'
        }
        // Create alert div
        const alertDiv = document.createElement('div')
        alertDiv.role = 'alert'
        alertDiv.className = `alert alert-${type}`
        alertDiv.id = 'alertMessage'
        alertDiv.style.borderRadius = '10px'
        alertDiv.textContent = alertText
        // Adjust style
        if (type === 'danger') {
            alertDiv.style.backgroundColor = 'rgb(209,13,13)'
        }
        if (type === 'primary') {
            alertDiv.style.backgroundColor = 'rgb(80, 113, 213)'
        }
        if (type === 'success') {
            alertDiv.style.backgroundColor = 'rgb(76, 180, 40)'
        }
        if (type === 'warning') {
            alertDiv.style.backgroundColor = 'rgb(227, 148, 16)'
        }
        // Add Alert
        document.querySelector('.alert-container').appendChild(alertDiv)

        // Remove alert
        setTimeout(()=>{alertDiv.remove()}, 3000)

    }

    static addContact(contactName, contactNumber, contactAddress) {
        let firstContact = document.querySelector('.contacts-container').firstElementChild
        let contactsContainer = document.querySelector('.contacts-container')

        let divBgColor
        if (firstContact !== null) {
            // Choose color of new contact based on the contact on top
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
            divBgColor = 'darkblue'
        }
        // Create DOM Element
        let div = document.createElement('div')
        div.className = 'detailed-view-container'
        div.dataset.color = divBgColor

        div.innerHTML = `
            <div class="contactInfo" style="background-color: ${divBgColor}">
                <div class="contactName">${contactName}</div>
                <div class="contactNumberLabel">Number:</div>
                <div class="contactNumber">${contactNumber}</div>
                <div class="contactAddressLabel">Address:<span class="contactAddress"> ${contactAddress}</span></div>
                <span><img class="deleteBtn" src="Img/delete.svg"></span>
            </div>
        `
        // Add animation
        div.style.animationName = 'contactAdded'
        div.style.animationDuration = '1s'
        div.style.animationFillMode = 'forwards'
        // Add Element to div
        if (firstContact !== null) {
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
    static removeContactAddedText() {
        let contactAddedText = document.querySelector('#contactAddedText')
        contactAddedText.style.display = 'none'
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
    static animateExpandContactInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel) {
        // Animate Contact Name
        contactName.style.animationName = 'moveContactNameToMiddle'
        contactName.style.animationDuration = '0.5s'
        contactName.style.animationFillMode = 'forwards'
        // Animate Contact Number
        contactNumber.style.animationName = 'moveContactNumberToRight'
        contactNumber.style.animationDuration = '0.5s'
        contactNumber.style.animationFillMode = 'forwards'
        // Animate Number Label
        contactNumberLabel.style.animationName = 'makeLabelOpaque'
        contactNumberLabel.style.animationDuration = '1s'
        contactNumberLabel.style.animationFillMode = 'forwards'
        // Animate Contact Address Label
        contactAddressLabel.style.animationName = 'makeLabelOpaque'
        contactAddressLabel.style.animationDuration = '1s'
        contactAddressLabel.style.animationFillMode = 'forwards'


    }
    static animateMinimizeContactInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel) {
        // Animate Contact Name
        contactName.style.animationName = 'moveContactNameToStart'
        contactName.style.animationDuration = '0.5s'
        contactName.style.animationFillMode = 'forwards'
        // Animate Contact Number
        contactNumber.style.animationName = 'moveContactNumberToStart'
        contactNumber.style.animationDuration = '1s'
        contactNumber.style.animationFillMode = 'forwards'
        // Animate Number Label
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
// DomContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    Storage.initializeStorage()
    Contacts.loadContacts(null)
})


// ONKEY-UP EVENTS

/* SEARCH NAME INPUT */
document.querySelector('#searchNameInput').addEventListener('keyup', function () {
    Contacts.loadContacts(this.value)
})
/* ADD NEW CONTACT FORM */
document.querySelector('#addNewContactForm').addEventListener('keyup', function () {
    let contactNameField = document.querySelector('#newContactNameField')
    let contactAddressField = document.querySelector('#newContactAddressField')
    let contactNumberField = document.querySelector('#newContactNumberField')
    let addContactBtn = document.querySelector('#addContactBtn')
    // Validate form
    if (contactNameField.value === '' || contactAddressField.value === '' || contactNumberField.value === '') {
        addContactBtn.disabled = true
    }
    else {
        addContactBtn.disabled = false
    }


})

// ONCLICK EVENTS

/* ADD NEW CONTACT IMG */
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
/* ADD CONTACT */
document.querySelector('#addContactBtn').addEventListener('click', function () {
    let contactNameField = document.querySelector('#newContactNameField')
    let contactAddressField = document.querySelector('#newContactAddressField')
    let contactNumberField = document.querySelector('#newContactNumberField')
    let contactInfo = {'name': contactNameField.value, 'address': contactAddressField.value, 'number': contactNumberField.value}

    UI.showContactAddedText()
    UI.addContact(contactNameField.value, contactNumberField.value, contactAddressField.value)
    Storage.addContact(contactInfo)

    setTimeout(() => {
        Animations.animateRemoveAddContainer()
        Animations.animateMoveContactsUp()
        UI.removeContactAddedText()

    }, 1500)


    // Clear Fields
    contactNameField.value = ''
    contactAddressField.value = ''
    contactNumberField.value = ''
    // Reset Button
    this.disabled = true

})
/* CONTACT CONTAINER-EXPAND */
var expanded = false
var contactName
var contactNumber
var contactNumberLabel
var contactAddressLabel
document.querySelector('.contacts-container').addEventListener('click', (e)=> {
    if (expanded) {
        // Minimize Contact Info
        if (e.target.className === 'contactName' || e.target.className === 'contactNumber') {
            expanded = true
            if (e.target.className === 'contactName') {
                // Use event propagation to get to the relevant contact info
                contactName = e.target
                contactNumberLabel = e.target.nextElementSibling
                contactNumber = e.target.nextElementSibling.nextElementSibling
                contactAddressLabel = e.target.nextElementSibling.nextElementSibling.nextElementSibling
            }
            else if (e.target.className === 'contactNumber') {
                // Use event propagation to get to the relevant contact info
                contactName = e.target.previousElementSibling.previousElementSibling
                contactNumberLabel = e.target.previousElementSibling
                contactNumber = e.target
                contactAddressLabel = e.target.nextElementSibling
            }
            Animations.animateMinimizeContactInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel)

        }

        expanded = false
        return
    }
    if (!expanded) {
        // Expand contact info
        if (e.target.className === 'contactName' || e.target.className === 'contactNumber') {
            expanded = true
            if (e.target.className === 'contactName') {
                // Use event propagation to get to the relevant contact info
                contactName = e.target
                contactNumberLabel = e.target.nextElementSibling
                contactNumber = e.target.nextElementSibling.nextElementSibling
                contactAddressLabel = e.target.nextElementSibling.nextElementSibling.nextElementSibling
            }
            else if (e.target.className === 'contactNumber') {
                // Use event propagation to get to the relevant contact info
                contactName = e.target.previousElementSibling.previousElementSibling
                contactNumberLabel = e.target.previousElementSibling
                contactNumber = e.target
                contactAddressLabel = e.target.nextElementSibling
            }
            Animations.animateExpandContactInfo(contactName, contactNumberLabel, contactNumber, contactAddressLabel)

        }
    }

})

/* CONTACT CONTAINER-DELETE CONTACT */
document.querySelector('.contacts-container').addEventListener('click', (e) => {
    if (e.target.className === 'deleteBtn') {
        let contactToDelete = e.target.parentElement.parentElement.parentElement
        let contactName = contactToDelete.firstElementChild.firstElementChild.textContent
        let contactNumber = contactToDelete.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent

        Animations.animateDeleteContact(contactToDelete)


        contactToDelete.addEventListener('animationend', () => {
            contactToDelete.remove()
            Storage.deleteContact(contactName, contactNumber)

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

