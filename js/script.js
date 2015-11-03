/*
 * File script.js
 * Created by AlekseyMalyshev
 * Date created Oct 29, 2015
 */

'use strict';

(function app() {

  var documentReady = function () {
    $form = $('form#contact-form');
    $form.on('submit', editContact);
    $form.on('reset', closeModal);
    $('button.add').on('click', newContact);
    $('tbody#contact-list').on('click', 'tr', selectContact);
    $('tbody#contact-list').on('click', 'button.del', deleteContact);
    $('thead>tr>th').on('click', sort);

    init();
  };

  $(documentReady);
})();

function init() {
    $del = $('<td>');
    var $butt = $('<button>');
    $butt.addClass('del');
    var $icon = $('<i>');
    $icon.addClass('fa fa-trash-o');
    $butt.append($icon);
    $del.append($butt);

    initTable();
}

var $form;
var $del;
var contacts = [];
var lastId = 0;
var currentContact;

function initTable() {
  contacts = JSON.parse(localStorage.contacts || '[]');

  var rows = [];
  contacts.forEach(function(contact) {
    if (lastId < contact.id) {
      lastId = contact.id;
    }
    rows.push(createRow(contact));
  });
  $('tbody#contact-list').append(rows);
}

function closeModal() {
  currentContact = undefined;
  $('#edit-contact').modal('hide');
}

function editContact(event) {
  var contact = {};

  if (currentContact) {
    contact = currentContact;
  }
  else {
    contact.id = ++lastId;
  }

  contact.name = $form.find('input#name').val();
  contact.email = $form.find('input#email').val();
  contact.phone = $form.find('input#phone').val();
  contact.addr = $form.find('input#addr').val();
  contact.category = $form.find('select#category').val();
  contact.comment = $form.find('textarea#comment').val();

  var $row = createRow(contact);
  if (currentContact) {
    var $oldRaw = $('tbody#contact-list>tr#i' + contact.id);
    $oldRaw.replaceWith($row);
    for (var i = 0; i < contacts.length; ++i) {
      if (contact.id === contacts[i].id) {
        contacts[i] = contact;
        break;
      }
    }
  }
  else {
    $('tbody#contact-list').append($row);
    contacts.push(contact);
  }
  localStorage.contacts = JSON.stringify(contacts);

  currentContact = undefined;
  $('#edit-contact').modal('hide');
  return false;
}

function createData(content) {
  var $td = $('<td>');
  $td.text(content);
  return $td;
}

function createRow(contact) {
    var $row = $('<tr>');

    $row.attr('id', 'i' + contact.id);
    $row.append(createData(contact.name));
    $row.append(createData(contact.email));
    $row.append(createData(contact.phone));
    $row.append(createData(contact.addr));
    $row.append(createData(contact.category));
    $row.append(createData(contact.comment));
    $row.append($del.clone());

    return $row;
}

function newContact() {
  currentContact = undefined;
  $form.find('input#name').val('');
  $form.find('input#email').val('');
  $form.find('input#phone').val('');
  $form.find('input#addr').val('');
  $form.find('select#category').val('Friends');
  $form.find('textarea#comment').val('');

  $('#edit-contact').modal('show');
}

function selectContact (event) {
  var $row = $(event.target).parents('tr');
  var id = parseInt($row.attr('id').substr(1));

  var contact = undefined;
  for (var i = 0; i < contacts.length; ++i) {
    if (contacts[i].id === id) {
      setupEditForm(contacts[i]);
      break;
    }
  }
}

function setupEditForm(contact) {
  currentContact = contact;
  $form.find('input#name').val(contact.name);
  $form.find('input#email').val(contact.email);
  $form.find('input#phone').val(contact.phone);
  $form.find('input#addr').val(contact.addr);
  $form.find('select#category').val(contact.category);
  $form.find('textarea#comment').val(contact.comment);

  $('#edit-contact').modal('show');
}

function deleteContact(event) {
  event.stopPropagation();
  var $row = $(event.target).parents('tr');
  var id = parseInt($row.attr('id').substr(1));

  for (var i = 0; i < contacts.length; ++i) {
    if (contacts[i].id === id) {
      contacts.splice(i, 1);
      break;
    }
  }

  localStorage.contacts = JSON.stringify(contacts);
  $row.detach();
}

function sort(event) {
  console.log(event.target.id);
}
