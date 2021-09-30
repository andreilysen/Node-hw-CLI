const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "db/contacts.json");

const readContacts = async () => {
  try {
    const result = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(result);
    return contacts;
  } catch (error) {
    console.log(`error`, error);
  }
};

function listContacts() {
  return readContacts();
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const [result] = contacts.filter((contact) => contact.id === contactId);
  if (!result) {
    const id = Number(contactId);
    const [result] = contacts.filter((contact) => contact.id === id);
    return result;
  }
  return result;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  let result = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(result, null, 2));
  const changeContacts = await readContacts();
  const id = Number(contactId);
  result = changeContacts.filter((contact) => contact.id !== id);

  await fs.writeFile(contactsPath, JSON.stringify(result, null, 2));
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
